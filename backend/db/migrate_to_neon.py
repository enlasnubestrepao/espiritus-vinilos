"""
migrate_to_neon.py — Copia la base de datos completa (estructura + contenido)
del Postgres viejo (Supabase) a Neon.

Pasos:
  1. pg_dump del esquema `public` (solo estructura)  → db/schema.sql   (se versiona en git)
  2. pg_dump del esquema `public` (solo datos)       → db/dumps/data.sql (NO se versiona: tiene emails/tokens)
  3. Limpia del schema lo que solo existe en Supabase (políticas RLS, roles anon/authenticated,
     esquema `extensions`) para que cargue limpio en un Postgres estándar.
  4. Carga schema + datos en Neon, cada uno en una sola transacción (todo o nada).
  5. Compara el conteo de filas tabla por tabla entre origen y destino.

Uso:
  export SOURCE_DATABASE_URL='postgresql://postgres.REF:PASS@aws-0-us-east-1.pooler.supabase.com:5432/postgres'
  export NEON_DATABASE_URL='postgresql://neondb_owner:PASS@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require'
  python3 db/migrate_to_neon.py            # dump + carga + verificación
  python3 db/migrate_to_neon.py --dump-only  # solo genera los .sql (no toca Neon)
  python3 db/migrate_to_neon.py --verify-only

Requiere: pg_dump y psql con versión >= a la del servidor origen, y psycopg2.
Analogía Oracle: es un Data Pump (expdp/impdp) con REMAP de lo que no existe en el destino.
"""
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

import psycopg2

DB_DIR    = Path(__file__).parent
DUMPS_DIR = DB_DIR / "dumps"
SCHEMA    = DB_DIR / "schema.sql"
DATA      = DUMPS_DIR / "data.sql"

# Roles/esquemas propios de Supabase que no existen en Neon
SUPABASE_ROLES   = ("anon", "authenticated", "service_role", "supabase_admin", "authenticator")
SUPABASE_SCHEMAS = ("auth.", "storage.", "realtime.", "graphql.", "vault.", "supabase_")


def env(name: str) -> str:
    value = (os.environ.get(name) or "").strip()
    if not value:
        sys.exit(f"ERROR: definí la variable {name} antes de correr el script")
    return value


def run(cmd: list, **kwargs) -> None:
    print("  $", " ".join(c if "://" not in c else "<url>" for c in cmd))
    subprocess.run(cmd, check=True, **kwargs)


# ── 1-2. Dump ────────────────────────────────────────────────────────────────

def dump(source_url: str) -> None:
    DUMPS_DIR.mkdir(exist_ok=True)
    base = ["pg_dump", "--dbname", source_url, "--schema=public",
            "--no-owner", "--no-privileges", "--quote-all-identifiers"]
    print("Exportando estructura...")
    run(base + ["--schema-only", "--file", str(SCHEMA)])
    print("Exportando datos...")
    run(base + ["--data-only", "--file", str(DATA)])


# ── 3. Limpieza de artefactos Supabase ───────────────────────────────────────

def sanitize_schema() -> None:
    sql = SCHEMA.read_text(encoding="utf-8")

    # Políticas RLS y ENABLE ROW LEVEL SECURITY: el backend se conecta como dueño
    # de las tablas, así que RLS nunca se aplicaba; además apuntan a roles de Supabase.
    sql = re.sub(r"^CREATE POLICY .*?;\s*$", "", sql, flags=re.M | re.S)
    sql = re.sub(r"^ALTER TABLE [^\n;]* (ENABLE|FORCE) ROW LEVEL SECURITY;$", "", sql, flags=re.M)
    # `public` ya existe en Neon
    sql = re.sub(r'^CREATE SCHEMA "?public"?;\s*$', "", sql, flags=re.M)
    sql = re.sub(r'^COMMENT ON SCHEMA "?public"? .*?;\s*$', "", sql, flags=re.M)

    # Supabase instala extensiones en el esquema `extensions`; en Neon van en public
    used_ext = set()
    if re.search(r'"?extensions"?\."?uuid_generate_v4"?', sql):
        used_ext.add("uuid-ossp")
    if re.search(r'"?extensions"?\."?(gen_random_bytes|crypt|gen_salt|digest)"?', sql):
        used_ext.add("pgcrypto")
    sql = re.sub(r'"?extensions"?\.', "public.", sql)
    header = "".join(f'CREATE EXTENSION IF NOT EXISTS "{e}" WITH SCHEMA public;\n' for e in sorted(used_ext))

    SCHEMA.write_text(header + sql, encoding="utf-8")

    # Si queda algo que dependa de Supabase, frenar antes de tocar Neon
    leftovers = [
        line.strip() for line in sql.splitlines()
        if not line.lstrip().startswith("--")
        and (any(s in line.replace('"', "") for s in SUPABASE_SCHEMAS)
             or any(re.search(rf'\b{r}\b', line.replace('"', "")) for r in SUPABASE_ROLES))
    ]
    if leftovers:
        print("\nERROR: el schema todavía referencia objetos de Supabase. Revisá estas líneas en db/schema.sql:")
        for line in leftovers[:20]:
            print("   ", line)
        sys.exit(1)
    print(f"Schema limpio → {SCHEMA.relative_to(DB_DIR.parent)}")


# ── 4. Carga en Neon ─────────────────────────────────────────────────────────

def ensure_empty(neon_url: str) -> None:
    with psycopg2.connect(neon_url) as conn, conn.cursor() as cur:
        cur.execute("SELECT count(*) FROM pg_tables WHERE schemaname = 'public'")
        if cur.fetchone()[0]:
            sys.exit("ERROR: la base de Neon ya tiene tablas en `public`. "
                     "Usá una base vacía (o borrá y recreá la base `neondb` en la consola de Neon).")


def load(neon_url: str) -> None:
    psql = ["psql", neon_url, "--quiet", "-v", "ON_ERROR_STOP=1", "--single-transaction", "--output", os.devnull]
    print("Cargando estructura en Neon...")
    run(psql + ["-f", str(SCHEMA)])
    print("Cargando datos en Neon...")
    run(psql + ["-f", str(DATA)])


# ── 5. Verificación ──────────────────────────────────────────────────────────

def row_counts(url: str) -> dict:
    with psycopg2.connect(url) as conn, conn.cursor() as cur:
        cur.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename")
        tables = [r[0] for r in cur.fetchall()]
        counts = {}
        for t in tables:
            cur.execute(f'SELECT count(*) FROM public."{t}"')
            counts[t] = cur.fetchone()[0]
    return counts


def verify(source_url: str, neon_url: str) -> None:
    src, dst = row_counts(source_url), row_counts(neon_url)
    print(f"\n{'tabla':<24}{'origen':>8}{'neon':>8}")
    ok = True
    for t in sorted(set(src) | set(dst)):
        a, b = src.get(t, "—"), dst.get(t, "—")
        mark = "✅" if a == b else "❌"
        ok &= a == b
        print(f"{t:<24}{a:>8}{b:>8}  {mark}")
    if not ok:
        sys.exit("\n❌ Hay diferencias — no cambies DATABASE_URL en Render todavía.")
    print("\n🎉 Migración verificada: mismas tablas y mismo número de filas.")


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--dump-only", action="store_true", help="solo genera schema.sql y dumps/data.sql")
    p.add_argument("--verify-only", action="store_true", help="solo compara conteos origen vs Neon")
    args = p.parse_args()

    source_url = env("SOURCE_DATABASE_URL")
    if args.verify_only:
        return verify(source_url, env("NEON_DATABASE_URL"))

    neon_url = None if args.dump_only else env("NEON_DATABASE_URL")
    if neon_url:
        ensure_empty(neon_url)
    dump(source_url)
    sanitize_schema()
    if not neon_url:
        return
    load(neon_url)
    verify(source_url, neon_url)


if __name__ == "__main__":
    main()

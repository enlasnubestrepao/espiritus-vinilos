# Migración de base de datos a Neon

Guía para mover la BD de **En Las Nubes Trepao** a [Neon](https://neon.com) (PostgreSQL serverless).
El backend usa PostgreSQL estándar con `psycopg2` y una sola variable (`DATABASE_URL`), así que la app no cambia: cambia solo dónde vive la base.

Duración estimada: 20–30 min. La app sigue funcionando contra la base vieja hasta el paso 4.

---

## 1. Crear la cuenta y el proyecto en Neon

1. Entrar a <https://neon.com> → **Sign up**. Lo más simple es *Continue with GitHub* con la misma cuenta del repo.
2. Crear un proyecto (**New Project**):
   - **Project name:** `espiritus-vinilos`
   - **Postgres version:** 17
   - **Region:** `AWS US West 2 (Oregon)`. Es la región por defecto de Render, así backend y BD quedan cerca (menos latencia).
   - **Database name:** dejar `neondb`.
3. Al crearlo, Neon muestra el panel **Connect**:
   - Branch `production` (o `main`, según cómo lo nombre Neon), database `neondb`, role `neondb_owner`.
   - Dejar activado **Connection pooling**.
   - Copiar la connection string. Se ve así:
     ```
     postgresql://neondb_owner:XXXX@ep-algo-123456-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require
     ```
     Guardarla en un lugar seguro (gestor de contraseñas). Es la nueva `DATABASE_URL`.

> **Plan free:** Neon apaga el cómputo tras ~5 min sin consultas y lo despierta solo en la siguiente (tarda menos de un segundo). Los datos no se pausan ni se borran, a diferencia de Supabase free, que pausa el proyecto entero tras una semana sin actividad.
> Para separar ambientes, Neon permite crear **branches** (p. ej. `dev`) o proyectos adicionales.

---

## 2. Migrar estructura y contenido

Se hace **una vez** con `backend/db/migrate_to_neon.py`.

> **Cómo se hizo en la práctica (2026-10-22):** se corrió en GitHub Actions, sin instalar nada en el Mac, con un workflow temporal en la rama `claude/migracion-neon` y dos secrets del repo (`SOURCE_DATABASE_URL`, `NEON_DATABASE_URL`). Puntos clave:
> - La URL de Supabase tiene que ser la del **Session pooler** (`postgres.REF@aws-0-...pooler.supabase.com:5432`). La *Direct connection* (`db.REF.supabase.co`) es solo IPv6 y los runners de GitHub no la alcanzan.
> - Los secrets se pegan como URL completa, empezando con `postgresql://`.
> - Resultado: 9 tablas, conteos idénticos (vinyls 106, rums 25, whiskies 34, sesiones y config).
>
> Para hacerlo localmente, sigue estos pasos:

### Requisitos (macOS)

```bash
brew install libpq && brew link --force libpq   # trae pg_dump y psql
pg_dump --version                               # debe ser ≥ 17
cd espiritus-vinilos/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

### Variables

- `SOURCE_DATABASE_URL`: la `DATABASE_URL` que hoy está en Render (Dashboard de Render → servicio `espiritus-vinilos-api` → **Environment**).
- `NEON_DATABASE_URL`: la connection string del paso 1.

```bash
export SOURCE_DATABASE_URL='postgresql://postgres.REF:PASS@aws-0-us-east-1.pooler.supabase.com:5432/postgres'
export NEON_DATABASE_URL='postgresql://neondb_owner:PASS@ep-xxx-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require'
```

### Correr

```bash
python3 db/migrate_to_neon.py
```

El script:

1. Verifica que la base de Neon esté vacía.
2. Exporta la **estructura** del esquema `public` → `backend/db/schema.sql` (se versiona en git).
3. Exporta los **datos** → `backend/db/dumps/data.sql`. Está en `.gitignore` porque tiene emails, tokens y el hash del PIN, así que **no se sube**.
4. Limpia del schema lo que solo existe en Supabase: políticas RLS ligadas a los roles `anon`/`authenticated` y el esquema `extensions`. Si queda alguna referencia a Supabase, se detiene antes de tocar Neon.
5. Carga estructura y datos en Neon. Cada archivo va en una sola transacción: si algo falla, no queda nada a medias.
6. Compara el número de filas tabla por tabla y muestra ✅/❌.

Salida esperada al final:

```
tabla                     origen    neon
app_config                     1       1  ✅
rums                          ..      ..  ✅
...
vinyls                       106     106  ✅

🎉 Migración verificada: mismas tablas y mismo número de filas.
```

Opciones:
- `--dump-only`: solo genera los `.sql` (útil para revisar `schema.sql` antes de cargar).
- `--verify-only`: solo vuelve a comparar conteos.

Si necesitás repetir la carga: en Neon → **Databases**, borrar y recrear la base `neondb` (mismo owner `neondb_owner`).

---

## 3. Probar localmente contra Neon

```bash
cd backend
DATABASE_URL="$NEON_DATABASE_URL" uvicorn main:app --reload
```

Abrir <http://localhost:8000/docs> y probar `GET /api/vinyls/`, `GET /api/rums/`, `GET /api/config/pin`.

---

## 4. Conectar la app en producción

El frontend (GitHub Pages, desplegado por `.github/workflows/deploy.yml`) **no habla con la BD**: llama al backend en Render (`VITE_API_URL`). Por eso solo hay que cambiar el backend:

1. Render Dashboard → `espiritus-vinilos-api` → **Environment**.
2. Editar `DATABASE_URL` y pegar la connection string de Neon → **Save Changes**. Render redeploya solo.
3. Verificar <https://espiritus-vinilos.onrender.com/api/vinyls/> y la web <https://enlasnubestrepao.com>, incluyendo crear/editar algo con PIN y una Sesión.

No hay secretos de BD en GitHub Actions: el workflow no necesita cambios. El commit con estos cambios dispara el deploy normal del frontend (solo cambian textos de About/Settings).

---

## 5. Retirar Supabase

Cuando la app lleve unos días estable en Neon:

1. Opcional: guardar un respaldo final con `pg_dump "$SOURCE_DATABASE_URL" -Fc -f supabase-final.dump`, fuera del repo.
2. Supabase Dashboard → proyecto → **Settings → General → Delete project**.
3. Borrar `backend/db/dumps/` de tu computador.
4. Opcional: borrar `backend/db/migrate_to_neon.py`, que ya cumplió su función. `schema.sql` se queda como referencia de la estructura.

---

## Rollback

Hasta el paso 5 es instantáneo: volver a poner la `DATABASE_URL` vieja en Render. Ojo: lo que se haya escrito en Neon mientras tanto no estará en la base vieja.

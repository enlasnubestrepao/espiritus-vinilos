# Base de datos — Neon PostgreSQL

La BD de **En Las Nubes Trepao** vive en [Neon](https://neon.com) (PostgreSQL serverless, plan free).
El backend se conecta con `psycopg2` usando una sola variable: `DATABASE_URL`.

## Proyecto

| | |
|---|---|
| Proyecto | `espiritus-vinilos` |
| Región | AWS US West 2 (Oregon), la misma de Render |
| Branch | `production` (default) |
| Base / rol | `neondb` / `neondb_owner` |
| Estructura | [`backend/db/schema.sql`](../backend/db/schema.sql) |

El plan free suspende el cómputo tras ~5 min sin consultas. La primera consulta lo despierta en menos de un segundo; los datos no se pausan.

## Conexión

En la consola de Neon → botón **Connect** → con **Connection pooling** activado → copiar la connection string:

```
postgresql://neondb_owner:[PASSWORD]@ep-xxxx-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require
```

- **Producción:** Render → `espiritus-vinilos-api` → **Environment** → `DATABASE_URL`.
- **Local:** `DATABASE_URL='...' uvicorn main:app --reload` desde `backend/`.
- El frontend (GitHub Pages) nunca habla con la BD, solo con el backend (`VITE_API_URL`).

Nunca commitear la connection string: incluye la contraseña.

## Tareas comunes

**Rotar la contraseña:** Neon → **Roles** → `neondb_owner` → **Reset password**, y actualizar `DATABASE_URL` en Render.

**Respaldo manual** (requiere `pg_dump` ≥ 17):
```bash
pg_dump "$DATABASE_URL" -Fc -f enlt-$(date +%F).dump   # fuera del repo
```
Neon además guarda historial para restaurar a un punto en el tiempo (**Backup & Restore**, ventana según el plan).

**Probar cambios de esquema sin tocar producción:** Neon → **Branches** → **Create child branch** desde `production`. Es una copia instantánea con su propia connection string; se borra al terminar.

**Actualizar `schema.sql` tras un cambio de estructura:**
```bash
pg_dump "$DATABASE_URL" --schema=public --schema-only --no-owner --no-privileges \
  --quote-all-identifiers > backend/db/schema.sql
```

**Recrear la estructura en una base vacía:**
```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 --single-transaction -f backend/db/schema.sql
```

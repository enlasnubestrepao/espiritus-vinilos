import { useEffect } from 'react'
import styles from './About.module.css'

// Modal informativo — misma estructura de overlay que Modal.jsx
// Se abre desde el botón 📖 en el Header
export default function About({ onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.box}>

        {/* Header */}
        <div className={styles.hdr}>
          <div className={styles.hdrIcon}>📖</div>
          <div className={styles.hdrText}>
            <h2>Espíritus &amp; Vinilos</h2>
            <p>Documentación del proyecto</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>

          {/* ── Arquitectura ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Arquitectura</h3>
            <pre className={styles.arch}>{ARCH}</pre>
          </section>

          {/* ── Stack con analogías SQL ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Stack — analogías SQL/Oracle</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Tecnología</th>
                    <th>Analogía SQL</th>
                    <th>Para qué sirve</th>
                  </tr>
                </thead>
                <tbody>
                  {STACK.map(([tech, sql, desc]) => (
                    <tr key={tech}>
                      <td><code className={styles.code}>{tech}</code></td>
                      <td className={styles.sql}>{sql}</td>
                      <td className={styles.desc}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Componentes ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Componentes del frontend</h3>
            <div className={styles.compGrid}>
              {COMPONENTS.map(({ name, desc }) => (
                <div className={styles.comp} key={name}>
                  <div className={styles.compName}>{name}</div>
                  <div className={styles.compDesc}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── API Endpoints ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>API Endpoints</h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Método</th>
                    <th>Endpoint</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {ENDPOINTS.map(([method, ep, desc]) => (
                    <tr key={ep + method}>
                      <td>
                        <span className={`${styles.method} ${styles[method.toLowerCase()]}`}>
                          {method}
                        </span>
                      </td>
                      <td><code className={styles.code}>{ep}</code></td>
                      <td className={styles.desc}>{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Correr localmente ── */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Cómo correr localmente</h3>
            <div className={styles.runGrid}>
              <div className={styles.runBlock}>
                <div className={styles.runLabel}>Backend (FastAPI)</div>
                <pre className={styles.codeBlock}>{BACKEND_RUN}</pre>
              </div>
              <div className={styles.runBlock}>
                <div className={styles.runLabel}>Frontend (React + Vite)</div>
                <pre className={styles.codeBlock}>{FRONTEND_RUN}</pre>
              </div>
            </div>
            <div className={styles.note}>
              El flag <code className={styles.code}>--reload</code> reinicia el backend automáticamente al guardar cambios.
              Vite hace lo mismo en el frontend con Hot Module Replacement.
            </div>
          </section>

          <div className={styles.footer}>
            <button className={styles.closeFooterBtn} onClick={onClose}>Cerrar</button>
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Datos ─────────────────────────────────────────────────────────────────────

const ARCH = `Browser
  │
  ├─ React (Vite) — GitHub Pages
  │    ├─ Header · KpiBar · Sidebar · SearchBar
  │    ├─ Dashboard → useQuery · useMemo · useCrud
  │    └─ Modal · AdminForm · About
  │
  │  axios (VITE_API_URL)
  │
  ▼
FastAPI Backend — Render.com
  ├─ CORSMiddleware
  ├─ /api/vinyls   (routers/vinyls.py)
  ├─ /api/rums     (routers/rums.py)
  ├─ /api/whiskies (routers/whiskies.py)
  └─ /api/covers   (routers/covers.py)
       │
  data_store.py
       │
  data/  →  vinilos.json · rums.json · whiskies.json`

const STACK = [
  ['React components',  'Vistas / reportes',           'Piezas de UI reutilizables con su propio estado'],
  ['useQuery',          'SELECT con cache + TTL',       'Fetcha datos, los cachea, refresca automáticamente'],
  ['useMutation',       'DML + COMMIT',                 'INSERT/UPDATE/DELETE — invalida cache en onSuccess'],
  ['useMemo',           'Columna computada / inline view', 'Recalcula solo cuando cambian sus dependencias'],
  ['useState',          'Variable de sesión PL/SQL',    'Estado local del componente (filtros, item seleccionado…)'],
  ['useEffect',         'Trigger con cleanup',          'Se activa al cambiar dependencias; return = deshabilitar'],
  ['useCrud hook',      'Procedure DML reutilizable',   'Encapsula add/update/remove — se instancia por colección'],
  ['CSS Modules',       'Scope por esquema',            'Nombres de clase únicos por componente, sin colisiones'],
  ['axios',             'Database link / dblink',       'Cliente HTTP preconfigurado con URL base del backend'],
  ['FastAPI routers',   'Packages PL/SQL',              'Agrupan endpoints por colección, se registran en main.py'],
  ['data_store.py',     'Capa de acceso a datos',       'read = SELECT *, write = TRUNCATE + INSERT bulk'],
  ['JSON files',        'Tablas',                       'Cada .json es una tabla; no hay motor de BD'],
  ['CORSMiddleware',    'Permisos entre esquemas',       'Autoriza al browser a llamar al backend desde otro dominio'],
]

const COMPONENTS = [
  { name: 'Header',     desc: 'Logo animado, título, toggle de colección, token Discogs (🔑), botón About (📖)' },
  { name: 'Dashboard',  desc: 'Orquestador: useQuery, filtros con useMemo, grid de cards, controla modales' },
  { name: 'Sidebar',    desc: 'Filtros por categoría/género/tipo/país — activa/desactiva con click' },
  { name: 'KpiBar',     desc: 'Métricas automáticas: totales, artistas únicos, escala promedio, etc.' },
  { name: 'SearchBar',  desc: 'Búsqueda full-text en memoria sobre los datos ya cargados' },
  { name: 'Modal',      desc: 'Detalle de un item (solo lectura). Cierra con Escape, overlay click, o botón' },
  { name: 'AdminForm',  desc: 'Alta/edición/borrado + auto-fetch de portada Discogs + og:image scraping' },
  { name: 'About',      desc: 'Este modal — arquitectura, stack, endpoints, cómo correr' },
]

const ENDPOINTS = [
  ['GET',    '/api/vinyls/',              'Lista de vinilos con filtros opcionales'],
  ['POST',   '/api/vinyls/',              'Agregar vinilo'],
  ['PUT',    '/api/vinyls/{index}',       'Actualizar vinilo por posición'],
  ['DELETE', '/api/vinyls/{index}',       'Eliminar vinilo'],
  ['GET',    '/api/rums/',                'Lista de rones'],
  ['POST',   '/api/rums/',                'Agregar ron'],
  ['PUT',    '/api/rums/{index}',         'Actualizar ron'],
  ['DELETE', '/api/rums/{index}',         'Eliminar ron'],
  ['GET',    '/api/whiskies/',            'Lista de whiskies'],
  ['POST',   '/api/whiskies/',            'Agregar whisky'],
  ['PUT',    '/api/whiskies/{index}',     'Actualizar whisky'],
  ['DELETE', '/api/whiskies/{index}',     'Eliminar whisky'],
  ['GET',    '/api/covers/',              'Buscar portada en Discogs (requiere x-discogs-token)'],
  ['POST',   '/api/covers/fetch',         'Raspar og:image de URL y guardar en licor'],
  ['POST',   '/api/covers/fetch-discogs', 'Buscar en Discogs y guardar en vinilo'],
  ['GET',    '/api/covers/scrape',        'Raspar og:image sin guardar'],
  ['POST',   '/api/covers/bulk-discogs',  'Portadas Discogs para todos los vinilos sin cover_url'],
]

const BACKEND_RUN = `cd espiritus-vinilos/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000
# → Docs: http://localhost:8000/docs`

const FRONTEND_RUN = `cd espiritus-vinilos/frontend
npm install
npm run dev
# → http://localhost:5173`

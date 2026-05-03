# Backlog — En Las Nubes Trepao

> **Última actualización:** 2026-05-03 · v2.6.0

---

## Tabla de estado — resumen ejecutivo

| ID | Feature | Prioridad | Esfuerzo | Estado |
|---|---|---|---|---|
| ARCH-01 | Migrar SPA a SSG (Astro) | 🔴 Crítica | Grande | ✅ Completado v2.4 |
| QA-01 | Triage responsive end-to-end | 🔴 Alta | Medio | 🔶 Parcial — fixes aplicados en v2.5 y v2.6 |
| UXUI-01 | Modal UX overhaul | 🔴 Alta | Medio | ✅ Completado v2.5 |
| UXUI-03 | Modal 2 columnas siempre | 🔴 Alta | Medio | ✅ Completado v2.6 |
| UXUI-04 | Páginas estáticas editorial redesign | 🔴 Alta | Medio | ✅ Completado v2.6 |
| UXUI-02 | Cloudflare fallback hosting | 🟡 Media | Pequeño | ⏳ Pendiente decisión |
| PROD-01 | Email capture / lista propia | 🔴 Crítica | Pequeño | ⏳ Pendiente decisión |
| EDIT-01 | Arquitectura por mood/concepto | 🔴 Alta | Grande | ⏳ Pendiente |
| EDIT-02 | Pairing vinilo + espíritu | 🔴 Alta | Grande | ⏳ Pendiente |
| EDIT-05 | Profundidad progresiva | 🟡 Media | Grande | ✅ Completado — páginas indexables via ARCH-01 |
| SEO-01 | Sitemap + indexación Google | 🔴 Alta | Pequeño | ✅ Completado v2.4 |
| UX-SHARE | ShareView spirits (equivalente a ?v= para vinilos) | 🟡 Media | Medio | ⏳ Pendiente |
| UX-SPOTIFY | Spotify en footer comprimido (mobile) | 🟡 Media | Pequeño | ✅ Resuelto — demovido a CTA card v2.6 |
| DATA-01 | Fetch tracklist + créditos desde Discogs | 🟡 Media | Medio | ⏳ Pendiente |
| CI-01 | GitHub Actions CI/CD estable | 🔴 Crítica | Pequeño | ✅ Completado v2.6 |

---

## QA-01 — Triage responsive end-to-end

**Status:** 🔶 Parcial
**Priority:** 🔴 Alta

**Fixes aplicados en v2.5 (2026-05-02):**
- Bottom sheet mobile (85vh, slide desde abajo, border-radius top)
- Drag handle visual en parte superior del sheet
- Campos a 1 columna desde 560px (antes 480px)
- Mapa colapsable (oculto por defecto)
- Admin footer con menor peso visual
- Hero de spirits: botella más grande (195px), cover_url como fondo con blur
- Hero de vinilos: portada cuadrada grande a la izquierda (148px)
- Spotify player movido al footer sticky
- Botón Compartir unificado en todos los modales

**Fixes aplicados en v2.6 (2026-05-03):**
- `min-height: 0` en `.dataCol` — scroll independiente correcto en grid
- `max-width: min(820px, calc(100vw - 40px))` — modal no se pega al borde en tablets
- Columna derecha siempre visible en desktop sin necesidad de scroll

**Issues conocidos pendientes:**
- ShareView para spirits no existe (vinilos tienen ?v=N, spirits redirigen a página estática)
- Vistas aún sin QA mobile formal: stats, crate, atlas, sesiones, admin form, welcome modal

---

## UXUI-03 — Modal 2 columnas siempre

**Status:** ✅ Completado — v2.6 (2026-05-03)

**Qué se implementó:**
- Layout siempre 2 columnas: izquierda exploración (campos, tracklist, notas), derecha acción
- Panel derecho siempre visible: Compartir → CTAs → ENLT social → Admin al fondo
- Eliminado footer sticky — las acciones no requieren scroll
- `actionsPanel` con `actionsSpacer flex:1` que empuja admin al fondo
- Mobile: colapsa a columna única, exploración primero, acciones debajo
- Notas editoriales integradas al final de columna izquierda (no panel separado)
- `box` siempre `max-width: min(820px, 100vw - 40px)`

---

## UXUI-04 — Páginas estáticas editorial redesign

**Status:** ✅ Completado — v2.6 (2026-05-03)

**Qué se implementó (los 3 tipos):**

**Vinilos** (`/vinilos/[slug]/`):
1. Hero full-bleed: cover como fondo borroso + cover grande (210px) + título/artista/botones superpuestos
2. Notas editoriales como pieza central — primer párrafo en Fraunces grande, resto en serif de lectura
3. Meta + Spotify embed dark side by side (2 columnas)
4. Recomendaciones: hasta 4 vinilos del mismo género, grid 4-col (2-col mobile), hover lift

**Rones** (`/rones/[slug]/`):
1. Hero con `hero-1.png` + blur de la botella como segundo fondo
2. Botella prominente (220px, drop-shadow), score ENLT debajo
3. Pills: ABV, años, blend, terminado — en el hero
4. Buy box en el hero: precio + disponibilidad + CTA
5. CTA card "Más información" con descripción
6. Recomendaciones por tipo o país

**Whiskies** (`/whiskies/[slug]/`):
- Mismo patrón que rones con `hero-2.png` y variables `--wh-acc`

---

## CI-01 — GitHub Actions CI/CD estable

**Status:** ✅ Completado — v2.6 (2026-05-03)

**Fixes aplicados:**
- Agregado paso `npm ci --legacy-peer-deps` para `frontend/` antes del build de Astro
- `react-simple-maps@3.0.0` no soporta React 19 — `--legacy-peer-deps` resuelve el conflicto
- Vite aliases en `astro.config.mjs` apuntan a `../frontend/node_modules/` que ahora existe en CI

---

## UXUI-01 — Modal UX overhaul

**Status:** ✅ Completado — v2.5 (2026-05-02)

Ver detalle completo en historial v2.5.

---

## ARCH-01 — Migrar SPA a Static Site Generator (SSG)

**Status:** ✅ Completado — v2.4 (2026-04-30 / 2026-05-01)

Ver detalle completo en historial v2.4.

---

## UXUI-02 — Resiliencia ante caídas / Fallback hosting

**Status:** ⏳ No iniciado — requiere confirmar DNS con Porkbun
**Priority:** 🟡 Media
**Effort:** Pequeño (1–2 horas)

Cloudflare free tier frente a GitHub Pages.

---

## PROD-01 — Canal de audiencia propia / Email capture

**Status:** ⏳ No iniciado — requiere decisión del owner
**Priority:** 🔴 Crítica para monetización
**Effort:** Pequeño (1 snippet una vez elegida plataforma)

100% de la audiencia vive en Instagram. Sin lista de emails no hay base de monetización.

**Opciones:**
1. **Kit (ConvertKit) — recomendado.** Gratis hasta 1,000 suscriptores.
2. **Buttondown** — más simple, gratis hasta 100.
3. **Substack — evitar.** Crea dependencia de plataforma.

---

## TRACK B — Concepto editorial

### EDIT-01 — Arquitectura por mood/concepto

**Status:** ⏳ Pendiente decisión estratégica
**Effort:** Grande

### EDIT-02 — Feature de pairing vinilo + espíritu

**Status:** ⏳ Pendiente — requiere contenido curatorial del owner
**Effort:** Grande

### DATA-01 — Fetch tracklist + créditos desde Discogs

**Status:** ⏳ Pendiente
**Effort:** Medio (backend + frontend)

Poblar `tracks` y `credits` en DB via Discogs API. Precondición para mostrar créditos con iconos de instrumentos en páginas estáticas.

### UX-SHARE — ShareView spirits

**Status:** ⏳ Pendiente
**Effort:** Medio

Vinilos tienen `?v=N` — URL cinématica que abre el modal directamente. Spirits usan la página estática. Pendiente decidir si se implementa un equivalente para spirits.

---

## Historial de versiones

| Versión | Fecha | Qué se hizo |
|---|---|---|
| v2.3.0 | 2026-04-29 | Fix persistencia notes/credits en DB, badge ❝ clickable, modal 2col datos+notas |
| v2.4.0 | 2026-04-30 | **ARCH-01**: Astro SSG, 166 páginas estáticas, sitemap, robots.txt, CI/CD config, cards crawleables, tema oscuro en páginas estáticas, pre-loader solo en home |
| v2.5.0 | 2026-05-02 | **UXUI-01**: Modal UX overhaul completo — bottom sheet, hero unificado, portada vinyl hero, botella spirits prominente, Spotify en footer, Compartir unificado, mapa colapsable, admin footer sutil, campos 1col ≤560px |
| v2.6.0 | 2026-05-03 | **UXUI-03+04 + CI-01**: Modal 2 columnas siempre (exploración/acción), Spotify demovido a CTA card, CTAs con descripción, páginas estáticas editorial redesign (hero, notas, recomendaciones, buy box en hero) para vinilos/rones/whiskies, CI fix legacy-peer-deps |

*Actualizado manualmente en cada sesión de trabajo.*

# Backlog — En Las Nubes Trepao

> **Última actualización:** 2026-05-02 · v2.5.0

---

## Tabla de estado — resumen ejecutivo

| ID | Feature | Prioridad | Esfuerzo | Estado |
|---|---|---|---|---|
| ARCH-01 | Migrar SPA a SSG (Astro) | 🔴 Crítica | Grande | ✅ Completado v2.4 |
| QA-01 | Triage responsive end-to-end | 🔴 Alta | Medio | 🔶 Parcial — fixes aplicados en v2.5 |
| UXUI-01 | Modal UX overhaul | 🔴 Alta | Medio | ✅ Completado v2.5 |
| UXUI-02 | Cloudflare fallback hosting | 🟡 Media | Pequeño | ⏳ Pendiente decisión |
| PROD-01 | Email capture / lista propia | 🔴 Crítica | Pequeño | ⏳ Pendiente decisión |
| EDIT-01 | Arquitectura por mood/concepto | 🔴 Alta | Grande | ⏳ Pendiente |
| EDIT-02 | Pairing vinilo + espíritu | 🔴 Alta | Grande | ⏳ Pendiente |
| EDIT-05 | Profundidad progresiva | 🟡 Media | Grande | ✅ Completado — páginas indexables via ARCH-01 |
| SEO-01 | Sitemap + indexación Google | 🔴 Alta | Pequeño | ✅ Completado v2.4 |
| UX-SHARE | ShareView spirits (equivalente a ?v= para vinilos) | 🟡 Media | Medio | ⏳ Pendiente |
| UX-SPOTIFY | Spotify en footer comprimido (mobile) | 🟡 Media | Pequeño | ⏳ Pendiente |

---

## QA-01 — Triage responsive end-to-end

**Status:** 🔶 Parcial
**Priority:** 🔴 Alta
**Effort:** Medio (1 sesión)

**Fixes aplicados en v2.5 (2026-05-02):**
- Bottom sheet mobile (85vh, slide desde abajo, border-radius top)
- Drag handle visual en parte superior del sheet
- Campos a 1 columna desde 560px (antes 480px — textos largos se truncaban)
- Mapa colapsable (oculto por defecto — reducía navegación)
- Admin footer con menor peso visual (opacity 0.7, botones más pequeños)
- Hero de spirits: botella más grande (195px), cover_url como fondo con blur adicional
- Hero de vinilos: portada cuadrada grande a la izquierda (148px), título/artista a la derecha
- Spotify player movido al footer sticky (siempre visible sin scroll)
- Botón Compartir unificado en todos los modales

**Issues conocidos pendientes:**
- Footer del modal con Spotify player abierto en mobile (~200px) deja poco espacio al body — monitorear en 375px
- Título largo de vinilo en hero mobile (110px cover + 44px padding) puede truncarse — monitorear
- ShareView para spirits no existe (vinilos tienen ?v=N, spirits redirigen a página estática)

**Vistas aún sin QA mobile formal:** stats, crate, atlas, sesiones, admin form mobile, welcome modal.

---

## ARCH-01 — Migrar SPA a Static Site Generator (SSG)

**Status:** ✅ Completado — v2.4 (2026-04-30 / 2026-05-01)
**Deploy:** GitHub Pages · rama `gh-pages` · manual via `npm run deploy`

**Qué se implementó:**
- Proyecto Astro en `frontend-astro/` con `client:only="react"` para islands React
- `getStaticPaths()` en 3 rutas: `/vinilos/[slug]`, `/rones/[slug]`, `/whiskies/[slug]`
- 166 páginas HTML estáticas generadas en build time (106 vinilos, 25 rones, 34 whiskies)
- `@astrojs/sitemap` → `sitemap-index.xml` + `sitemap-0.xml` auto-generados
- `robots.txt` actualizado apuntando al sitemap correcto
- Cards de dashboard convertidas a `<a href>` — crawleables por Google
- Tema oscuro aplicado a todas las páginas estáticas (`global.css`)
- Pre-loader controlado por prop `showLoader` — solo en home, nunca en páginas estáticas
- Sitemap enviado a Google Search Console ✅
- GitHub Actions CI/CD configurado (`.github/workflows/deploy.yml`) — pendiente PAT con scope `workflow`
- Slugify compartido entre Astro y React vía alias Vite `@frontend`

---

## UXUI-01 — Modal UX overhaul

**Status:** ✅ Completado — v2.5 (2026-05-02)

**Qué se implementó:**
1. Scroll interno con footer sticky — header fijo, body scrollable, acciones siempre visibles
2. Hero unificado para todos los tipos (vinilos + spirits) — cinemático con blur y overlay
3. Bottom sheet en mobile (≤767px) — 85vh, slide desde abajo, drag handle visual
4. 1 columna de campos desde 560px
5. Mapa de país colapsable (oculto por defecto, toggle "Ver en mapa · País")
6. Admin footer con menor peso visual (separado por borde sutil, opacity reducida)
7. Botella de spirit más grande y prominente (195px, bottom-anchored)
8. Hero de vinyl: cover cuadrada 148px a la izquierda, título/artista a la derecha
9. Spotify player en footer sticky (visible sin scroll al activar)
10. Botón Compartir único y prominente — vinilos → ShareView (?v=N), spirits → página estática
11. Botón 🔗 de card hover corregido → también usa ?v=N para vinilos

---

## UXUI-02 — Resiliencia ante caídas / Fallback hosting

**Status:** ⏳ No iniciado — requiere confirmar DNS con Porkbun
**Priority:** 🟡 Media
**Effort:** Pequeño (1–2 horas)

Cloudflare free tier frente a GitHub Pages — puede servir página cacheada ante falla del origen. Requiere migrar NS del dominio a Cloudflare.

---

## PROD-01 — Canal de audiencia propia / Email capture

**Status:** ⏳ No iniciado — requiere decisión del owner
**Priority:** 🔴 Crítica para monetización
**Effort:** Pequeño (1 snippet una vez elegida plataforma)

100% de la audiencia vive en Instagram. Sin lista de emails no hay base de monetización ni resiliencia ante cambios de algoritmo.

**Opciones:**
1. **Kit (ConvertKit) — recomendado.** Gratis hasta 1,000 suscriptores. Nativo para creadores. Newsletter pago integrado.
2. **Buttondown** — más simple, gratis hasta 100.
3. **Substack — evitar.** Crea dependencia de plataforma.

Copy sugerido: *"Si querés saber cuándo llega un disco nuevo, dejá tu correo acá."*

---

## TRACK B — Concepto editorial

**Priority:** 🔴 Alta para posicionamiento a largo plazo

### EDIT-01 — Arquitectura por mood/concepto

**Status:** ⏳ Pendiente decisión estratégica
**Effort:** Grande

Reemplazar los tabs por categoría por una arquitectura de descubrimiento basada en mood, ocasión o concepto curatorial.

---

### EDIT-02 — Feature de pairing vinilo + espíritu

**Status:** ⏳ Pendiente
**Effort:** Grande

El núcleo del concepto editorial: framework *Booze & Vinyl* digitalizado. Una vista o página que propone combinaciones concretas: este disco con este espíritu, por qué, qué notas comparten. Requiere contenido curatorial del owner.

---

### EDIT-05 — Profundidad progresiva

**Status:** ✅ Completado (ARCH-01 completado)

Dos capas de contenido por ítem implementadas:
- **Capa 1:** tarjeta / modal (datos duros + hero visual)
- **Capa 2:** página estática indexable por Google (166 páginas via Astro SSG)
- **Capa 3 (vinilos):** notas editoriales + tracklist Discogs + créditos manuales

---

## Historial de versiones

| Versión | Fecha | Qué se hizo |
|---|---|---|
| v2.3.0 | 2026-04-29 | Fix persistencia notes/credits en DB, badge ❝ clickable, modal 2col datos+notas |
| v2.4.0 | 2026-04-30 | **ARCH-01**: Astro SSG, 166 páginas estáticas, sitemap, robots.txt, CI/CD config, cards crawleables, tema oscuro en páginas estáticas, pre-loader solo en home |
| v2.5.0 | 2026-05-02 | **UXUI-01**: Modal UX overhaul completo — bottom sheet, hero unificado, portada vinyl hero, botella spirits prominente, Spotify en footer, Compartir unificado, mapa colapsable, admin footer sutil, campos 1col ≤560px |

*Actualizado manualmente en cada sesión de trabajo.*

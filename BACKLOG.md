# Backlog — En Las Nubes Trepao

> **Última actualización:** 2026-05-03 · v2.6.1

---

## Pendientes activos

| ID | Feature | Prioridad | Esfuerzo | Estado |
|---|---|---|---|---|
| PROD-01 | Email capture / lista propia | 🔴 Crítica | Pequeño | ⏳ Requiere decisión de plataforma |
| EDIT-02 | Pairing vinilo + espíritu | 🔴 Alta | Grande | ⏳ Requiere contenido curatorial |
| EDIT-01 | Arquitectura por mood/concepto | 🔴 Alta | Grande | ⏳ Decisión estratégica pendiente |
| QA-01 | QA mobile formal — vistas pendientes | 🔴 Alta | Medio | 🔶 Parcial — modal OK, faltan stats/crate/atlas/sesiones/admin/welcome |
| UX-SHARE | ShareView para spirits (?s=N) | 🟡 Media | Medio | ⏳ Pendiente |
| DATA-01 | Fetch tracklist + créditos desde Discogs | 🟡 Media | Medio | ⏳ Pendiente |
| UXUI-02 | Cloudflare fallback hosting | 🟡 Media | Pequeño | ⏳ Requiere acceso DNS Porkbun |

---

## PROD-01 — Email capture

**Priority:** 🔴 Crítica para monetización

100% de la audiencia en Instagram. Sin lista propia no hay base de monetización ni resiliencia ante cambios de algoritmo.

**Opciones:**
1. **Kit (ConvertKit) — recomendado.** Gratis hasta 1,000 suscriptores. Newsletter pago integrado.
2. **Buttondown** — más simple, gratis hasta 100.
3. **Substack — evitar.** Dependencia de plataforma.

Copy sugerido: *"Si querés saber cuándo llega un disco nuevo, dejá tu correo acá."*

---

## EDIT-02 — Pairing vinilo + espíritu

**Priority:** 🔴 Alta — núcleo del concepto editorial

Framework *Booze & Vinyl* digitalizado. Una vista que propone combinaciones concretas: este disco con este espíritu, por qué, qué notas comparten. Requiere contenido curatorial del owner.

---

## EDIT-01 — Arquitectura por mood/concepto

**Priority:** 🔴 Alta para posicionamiento

Reemplazar tabs por categoría con arquitectura de descubrimiento basada en mood, ocasión o concepto curatorial.

---

## QA-01 — Vistas sin QA mobile formal

**Vistas pendientes a 375px:** stats, crate, atlas, sesiones, admin form, welcome modal.

Modal ✅ revisado y corregido en v2.5 y v2.6.

---

## DATA-01 — Fetch tracklist + créditos desde Discogs

Poblar `tracks` y `credits` en DB via Discogs API. Precondición para mostrar créditos con iconos de instrumentos en páginas estáticas de vinilos.

---

## UX-SHARE — ShareView para spirits

Vinilos tienen `?v=N` — URL que abre el modal directamente. Spirits van a página estática. Pendiente evaluar si se implementa equivalente dinámico.

---

## Historial de versiones completadas

| Versión | Fecha | Qué se hizo |
|---|---|---|
| v2.3.0 | 2026-04-29 | Fix persistencia notes/credits en DB, badge ❝ clickable, modal 2col datos+notas |
| v2.4.0 | 2026-04-30 | **ARCH-01**: Astro SSG, 166 páginas estáticas, sitemap, robots.txt, CI/CD, cards crawleables |
| v2.5.0 | 2026-05-02 | **UXUI-01**: Modal UX overhaul — bottom sheet, hero unificado, vinyl/spirits hero, Spotify en footer, Compartir unificado, mapa colapsable, drag handle |
| v2.6.0 | 2026-05-03 | **UXUI-03+04**: Modal 2 columnas siempre (exploración/acción), CTAs con descripción, páginas estáticas editorial redesign para los 3 tipos. **CI-01**: fix legacy-peer-deps |
| v2.6.1 | 2026-05-03 | **Limpieza**: CSS muerto eliminado del modal (~100 líneas), .gitignore expandido, formateo de precios por moneda (COP/USD/EUR) |

*Actualizado manualmente en cada sesión de trabajo.*

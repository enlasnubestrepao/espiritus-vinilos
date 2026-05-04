# Backlog — En Las Nubes Trepao

> **Última actualización:** 2026-05-04 · v2.7.0

---

## Pendientes activos

| ID | Feature | Prioridad | Esfuerzo | Estado |
|---|---|---|---|---|
| PROD-01 | Email capture / lista propia | 🔴 Crítica | Pequeño | ⏳ Requiere decisión de plataforma |
| EDIT-02 | Pairing vinilo + espíritu | 🔴 Alta | Grande | ⏳ Requiere contenido curatorial |
| QA-01 | QA mobile formal — vistas pendientes | 🟡 Media | Pequeño | 🔶 Parcial — sesiones post-login pendiente |
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

## QA-01 — Vistas pendientes mobile

**Revisadas y corregidas en v2.7.0:** stats, crate, atlas, sesiones (form), admin form, welcome modal.

**Pendiente:** sesiones post-login (lista de sesiones, track picker, preview).

---

## Historial de versiones completadas

| Versión | Fecha | Qué se hizo |
|---|---|---|
| v2.3.0 | 2026-04-29 | Fix persistencia notes/credits en DB, badge ❝ clickable, modal 2col datos+notas |
| v2.4.0 | 2026-04-30 | **ARCH-01**: Astro SSG, 166 páginas estáticas, sitemap, robots.txt, CI/CD, cards crawleables |
| v2.5.0 | 2026-05-02 | **UXUI-01**: Modal UX overhaul — bottom sheet, hero unificado, vinyl/spirits hero, Spotify en footer, Compartir unificado, mapa colapsable, drag handle |
| v2.6.0 | 2026-05-03 | **UXUI-03+04**: Modal 2 columnas siempre (exploración/acción), CTAs con descripción, páginas estáticas editorial redesign para los 3 tipos. **CI-01**: fix legacy-peer-deps |
| v2.6.1 | 2026-05-03 | **Limpieza**: CSS muerto eliminado del modal (~100 líneas), .gitignore expandido, formateo de precios por moneda (COP/USD/EUR) |
| v2.7.0 | 2026-05-04 | **QA-01**: fixes mobile welcome modal (line-clamp), admin form (purchase fields 2-col). **DATA-01**: columna `tracks` JSONB, endpoints save-discogs-release + bulk-discogs-tracks, créditos con íconos en páginas estáticas de vinilos |

*Actualizado manualmente en cada sesión de trabajo.*

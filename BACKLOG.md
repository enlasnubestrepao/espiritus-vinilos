# Backlog — En Las Nubes Trepao

> **Última actualización:** 2026-05-05 · v2.7.2

---

## Pendientes activos

| ID | Feature | Prioridad | Estado |
|---|---|---|---|
| PROD-01 | Email capture / lista propia | 🔴 Crítica | ⏳ Requiere decisión de plataforma |
| EDIT-02 | Pairing vinilo + espíritu | 🔴 Alta | ⏳ Requiere contenido curatorial |
| DATA-01 | 2 vinilos sin tracklist (sin URL Discogs) | 🟡 Media | 🔶 104/106 — agregar URL en admin y correr endpoint |
| UX-SESIONES | Búsqueda en vinyl picker dentro de sesiones | 🟡 Media | 💡 Sugerido |
| UXUI-02 | Cloudflare fallback hosting | 🟡 Media | ⏳ Requiere acceso DNS Porkbun |

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

## DATA-01 — 2 vinilos sin tracklist

Edith Piaff (Disque D'Or Vol. 2) y Varios Artistas (El sonido joven de America / Motown) no tienen URL de Discogs. Pasos para cerrar:
1. Agregar URL de Discogs en admin para cada uno
2. Correr `POST /api/covers/save-discogs-release` con `{"index": 86}` y `{"index": 102}`

---

## UX-SESIONES — Búsqueda en vinyl picker

El picker de vinilos dentro de una sesión lista los 106 álbumes sin filtro. En mobile implica scroll largo. Solución: input de búsqueda local (filtra artista/álbum en cliente, sin llamada al backend).

---

## UXUI-02 — Cloudflare fallback hosting

Requiere acceso a DNS en Porkbun para configurar Cloudflare Pages como fallback de GitHub Pages.

---

## Historial cerrado

| Versión | Fecha | Qué se hizo |
|---|---|---|
| v2.3.0 | 2026-04-29 | Fix persistencia notes/credits en DB, badge ❝ clickable, modal 2col datos+notas |
| v2.4.0 | 2026-04-30 | **ARCH-01**: Astro SSG, 166 páginas estáticas, sitemap, robots.txt, CI/CD, cards crawleables |
| v2.5.0 | 2026-05-02 | **UXUI-01**: Modal UX overhaul — bottom sheet, hero unificado, vinyl/spirits hero, Spotify en footer, Compartir unificado, mapa colapsable, drag handle |
| v2.6.0 | 2026-05-03 | **UXUI-03+04**: Modal 2 columnas siempre (exploración/acción), CTAs con descripción, páginas estáticas editorial redesign. **CI-01**: fix legacy-peer-deps |
| v2.6.1 | 2026-05-03 | **Limpieza**: CSS muerto (~100 líneas), .gitignore expandido, formateo precios COP/USD/EUR |
| v2.7.0 | 2026-05-04 | **DATA-01**: tracks JSONB en Supabase, save-discogs-release, bulk-discogs-tracks paginado, créditos con íconos en páginas estáticas. **QA-01**: fixes mobile WelcomeModal + AdminForm |
| v2.7.1 | 2026-05-05 | **QA-01 cerrado**: auditoría CSS sesiones post-login, fix spiritCountry overflow + detailTitle ellipsis |
| v2.7.2 | 2026-05-05 | **DATA-01 casi cerrado**: soporte URLs /master/ en endpoints Discogs, 104/106 vinilos con tracklist poblado |

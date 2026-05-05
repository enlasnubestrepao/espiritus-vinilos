# Backlog — En Las Nubes Trepao

> **Última actualización:** 2026-05-05 · v2.7.3

---

## Pendientes activos

| ID | Feature | Prioridad | Estado |
|---|---|---|---|
| PROD-01 | Email capture / lista propia | 🔴 Crítica | ⏳ Requiere decisión de plataforma |
| SEO-01 | og:image en páginas estáticas | 🔴 Alta | 🔶 Infraestructura ok, falta fallback + fixes |
| ANALYTICS-01 | Analytics (Plausible o GA4) | 🟡 Media | 💡 Pendiente |
| UX-NEW | Badge "nuevo" / sección recién llegado | 🟡 Media | 💡 Pendiente |
| QA-ASTRO | QA mobile páginas Astro en teléfono real | 🟡 Media | 💡 Pendiente |
| EDIT-02 | Pairing vinilo + espíritu | 🔴 Alta | ⏳ Requiere contenido curatorial |
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

## SEO-01 — og:image en páginas estáticas

La infraestructura está en su lugar (`Base.astro` tiene los meta tags, `[slug].astro` pasa `cover_url`). Tres fixes pendientes:
1. **Fallback roto**: `og-image.jpg` referenciado en código pero no existe en `public/` → usar `hero-1.png` o crear imagen dedicada
2. **Dimensiones hardcodeadas**: `og:image:width/height` declara 1200×630 pero las covers de Discogs son cuadradas → remover o hacer condicional
3. **Falta `og:image:alt`** para accesibilidad

---

## ANALYTICS-01 — Analytics

Sin tracking, el lanzamiento v3.0 es a ciegas. Plausible (privacidad-first, gratis tier) o GA4. Requiere cuenta y script en `Base.astro`.

---

## UX-NEW — Badge "nuevo" / recién llegado

Sin señal de "nuevo contenido" no hay motivo para que un seguidor vuelva. Opciones: badge en card de vinilos recientes, sección "Últimos en llegar" en home.

---

## QA-ASTRO — QA mobile páginas Astro

Las 166 páginas estáticas (tracklist, créditos, hero) no fueron auditadas en teléfono real a 375px. Revisar manualmente 3-5 páginas representativas.

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
| v2.7.3 | 2026-05-05 | **UX-SESIONES**: búsqueda local en vinyl picker (filtra por artista/álbum). **UX**: remover botón Spotify del hero en páginas estáticas de vinilos |

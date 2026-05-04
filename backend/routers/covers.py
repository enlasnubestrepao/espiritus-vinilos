from fastapi import APIRouter, Query, Header
from typing import Optional
import urllib.request
import urllib.parse
import json
import re
import time
from data_store import read_collection, write_collection

router = APIRouter()

# ── GET /api/covers?type=vinyl&q=... ─────────────────────────────────────────
# Busca portada en Discogs (vinilos) — token via header x-discogs-token
@router.get("/")
def get_cover(
    type: str = Query(...),
    q: str = Query(...),
    x_discogs_token: Optional[str] = Header(None),
):
    if type == "vinyl":
        return search_discogs(q, x_discogs_token)
    return {"cover": None, "source": None}


# ── POST /api/covers/fetch ────────────────────────────────────────────────────
# Scrapea og:image de la URL del producto y guarda cover_url en el JSON
# Body: { "coll": "rum", "index": 5, "url": "https://..." }
@router.post("/fetch")
def fetch_and_save_cover(body: dict):
    coll  = body.get("coll")
    index = body.get("index")
    url   = body.get("url")

    if not all([coll, index is not None, url]):
        return {"cover": None, "error": "faltan parámetros"}

    cover = scrape_og_image(url)

    if cover:
        data = read_collection(coll)
        if 0 <= index < len(data):
            data[index]["cover_url"] = cover
            write_collection(coll, data)

    return {"cover": cover}


# ── POST /api/covers/fetch-discogs ────────────────────────────────────────────
# Busca portada en Discogs y la persiste en el vinilo
# Body: { "index": 5, "q": "Hector Lavoe La Voz" }
@router.post("/fetch-discogs")
def fetch_and_save_discogs(
    body: dict,
    x_discogs_token: Optional[str] = Header(None),
):
    index = body.get("index")
    q     = body.get("q")

    if index is None or not q:
        return {"cover": None, "error": "faltan parámetros"}

    result = search_discogs(q, x_discogs_token)
    cover  = result.get("cover")

    if cover:
        data = read_collection("vinyls")
        if 0 <= index < len(data):
            data[index]["cover_url"] = cover
            write_collection("vinyls", data)

    return result


# ── GET /api/covers/scrape?url=... ───────────────────────────────────────────
# Raspa og:image de cualquier URL y devuelve la imagen real (sin guardar)
# Útil cuando el usuario pega una URL de release de Discogs manualmente
@router.get("/scrape")
def scrape_cover(url: str = Query(...)):
    cover = scrape_og_image(url)
    return {"cover": cover, "original_url": url}


# ── POST /api/covers/bulk-discogs ─────────────────────────────────────────────
# Fetchea portadas Discogs para todos los vinilos que no tienen cover_url
# Retorna { updated: N, skipped: N }
@router.post("/bulk-discogs")
def bulk_fetch_discogs(x_discogs_token: Optional[str] = Header(None)):
    if not x_discogs_token:
        return {"error": "no token", "updated": 0, "skipped": 0}

    data    = read_collection("vinyls")
    updated = 0
    skipped = 0

    for i, vinyl in enumerate(data):
        if vinyl.get("cover_url"):   # ya tiene portada → saltar
            skipped += 1
            continue
        q      = f"{vinyl.get('artista', '')} {vinyl.get('album', '')}".strip()
        result = search_discogs(q, x_discogs_token)
        if result.get("cover"):
            data[i]["cover_url"] = result["cover"]
            updated += 1

    if updated:
        write_collection("vinyls", data)

    return {"updated": updated, "skipped": skipped}


# ── GET /api/covers/discogs-release?url=... ──────────────────────────────────
# Devuelve tracklist + créditos de un release de Discogs
@router.get("/discogs-release")
def get_discogs_release(
    url: str = Query(...),
    x_discogs_token: Optional[str] = Header(None),
):
    if not x_discogs_token:
        return {"error": "no token", "tracklist": [], "credits": []}

    m = re.search(r"/release/(\d+)", url)
    if not m:
        return {"error": "URL de release inválida", "tracklist": [], "credits": []}

    release_id = m.group(1)
    api_url = f"https://api.discogs.com/releases/{release_id}?token={x_discogs_token}"

    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "EspiritusVinilos/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())

        tracklist = [
            {
                "position": t.get("position", ""),
                "title":    t.get("title", ""),
                "duration": t.get("duration", ""),
                "type":     t.get("type_", "track"),
            }
            for t in data.get("tracklist", [])
        ]

        credits = [
            {
                "name": c.get("anv") or c.get("name", ""),
                "role": c.get("role", ""),
            }
            for c in data.get("extraartists", [])
            if c.get("role")
        ]

        return {
            "tracklist": tracklist,
            "credits":   credits,
            "country":   data.get("country", ""),
            "year":      data.get("year", ""),
        }
    except Exception as e:
        return {"error": str(e), "tracklist": [], "credits": []}


# ── POST /api/covers/save-discogs-release ─────────────────────────────────────
# Fetchea tracklist + créditos de Discogs y los persiste en el vinilo
# Body: { "index": 5 }  — usa el campo `url` del vinilo como Discogs release URL
# Actualiza `tracks` siempre; actualiza `credits` solo si el vinilo no tiene créditos aún
@router.post("/save-discogs-release")
def save_discogs_release(
    body: dict,
    x_discogs_token: Optional[str] = Header(None),
):
    if not x_discogs_token:
        return {"error": "no token", "updated": False}

    index = body.get("index")
    if index is None:
        return {"error": "falta index", "updated": False}

    data = read_collection("vinyls")
    if not (0 <= index < len(data)):
        return {"error": "index fuera de rango", "updated": False}

    vinyl = data[index]
    discogs_url = vinyl.get("url", "")
    m = re.search(r"/release/(\d+)", discogs_url)
    if not m:
        return {"error": "el vinilo no tiene URL de release Discogs válida", "updated": False}

    release_id = m.group(1)
    api_url = f"https://api.discogs.com/releases/{release_id}?token={x_discogs_token}"

    try:
        req = urllib.request.Request(api_url, headers={"User-Agent": "EspiritusVinilos/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            release = json.loads(resp.read())

        tracklist = [
            {
                "position": t.get("position", ""),
                "title":    t.get("title", ""),
                "duration": t.get("duration", ""),
                "type":     t.get("type_", "track"),
            }
            for t in release.get("tracklist", [])
        ]
        credits = [
            {
                "name": c.get("anv") or c.get("name", ""),
                "role": c.get("role", ""),
            }
            for c in release.get("extraartists", [])
            if c.get("role")
        ]

        data[index]["tracks"] = tracklist
        if not vinyl.get("credits") and credits:
            data[index]["credits"] = credits

        write_collection("vinyls", data)
        return {
            "updated": True,
            "tracks":  len(tracklist),
            "credits": len(credits),
        }
    except Exception as e:
        return {"error": str(e), "updated": False}


# ── POST /api/covers/bulk-discogs-tracks ──────────────────────────────────────
# Fetchea tracklist para vinilos con URL de Discogs que no tienen tracks.
# Procesa en lotes para evitar timeout en Render.
# Body: { "limit": 20, "offset": 0, "force": false }
# Retorna { updated, skipped, errors, next_offset, done }
@router.post("/bulk-discogs-tracks")
def bulk_fetch_discogs_tracks(
    body: Optional[dict] = None,
    x_discogs_token: Optional[str] = Header(None),
):
    if not x_discogs_token:
        return {"error": "no token", "updated": 0, "skipped": 0, "errors": 0}

    params  = body or {}
    force   = params.get("force", False)
    limit   = min(int(params.get("limit", 15)), 30)   # máx 30 por lote
    offset  = int(params.get("offset", 0))

    data    = read_collection("vinyls")
    updated = skipped = errors = 0
    processed = 0

    for i, vinyl in enumerate(data):
        if processed >= limit:
            break
        if i < offset:
            continue

        if not force and vinyl.get("tracks"):
            skipped += 1
            offset += 1
            continue
        discogs_url = vinyl.get("url", "")
        m = re.search(r"/release/(\d+)", discogs_url)
        if not m:
            skipped += 1
            offset += 1
            continue

        release_id = m.group(1)
        api_url = f"https://api.discogs.com/releases/{release_id}?token={x_discogs_token}"
        try:
            req = urllib.request.Request(api_url, headers={"User-Agent": "EspiritusVinilos/1.0"})
            with urllib.request.urlopen(req, timeout=8) as resp:
                release = json.loads(resp.read())

            data[i]["tracks"] = [
                {
                    "position": t.get("position", ""),
                    "title":    t.get("title", ""),
                    "duration": t.get("duration", ""),
                    "type":     t.get("type_", "track"),
                }
                for t in release.get("tracklist", [])
            ]
            if not vinyl.get("credits"):
                credits = [
                    {"name": c.get("anv") or c.get("name", ""), "role": c.get("role", "")}
                    for c in release.get("extraartists", [])
                    if c.get("role")
                ]
                if credits:
                    data[i]["credits"] = credits
            updated += 1
        except Exception:
            errors += 1

        processed += 1
        offset += 1
        time.sleep(1.1)   # Discogs: ~60 req/min para usuarios autenticados

    if updated:
        write_collection("vinyls", data)

    done = offset >= len(data)
    return {
        "updated":     updated,
        "skipped":     skipped,
        "errors":      errors,
        "next_offset": offset if not done else None,
        "done":        done,
        "total":       len(data),
    }


# ── POST /api/covers/fetch-purchase ──────────────────────────────────────────
# Scrapea precio, moneda y disponibilidad de la URL del producto
# Body: { "url": "https://..." }
@router.post("/fetch-purchase")
def fetch_purchase_info(body: dict):
    url = body.get("url")
    if not url:
        return {"error": "falta url"}
    return scrape_purchase_info(url)


# ── Helpers ───────────────────────────────────────────────────────────────────

def scrape_og_image(url: str) -> Optional[str]:
    """Extrae og:image del HTML de la URL — como un SELECT sobre el <head>"""
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; EspiritusVinilos/1.0)"}
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            # Leer solo los primeros 50KB — el <head> siempre está al inicio
            html = resp.read(50_000).decode("utf-8", errors="ignore")

        # Buscar og:image en cualquier orden de atributos
        patterns = [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']',
            r'<meta[^>]+name=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        ]
        for pattern in patterns:
            m = re.search(pattern, html, re.IGNORECASE)
            if m:
                img = m.group(1).strip()
                if img.startswith("http"):
                    return img
        return None
    except Exception:
        return None


def scrape_purchase_info(url: str) -> dict:
    """
    Extrae precio, moneda y disponibilidad de la página del producto.
    Estrategia: JSON-LD (schema.org/Product) → meta product tags → vacío.
    """
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (compatible; EspiritusVinilos/1.0)"}
        )
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read(100_000).decode("utf-8", errors="ignore")

        # 1. JSON-LD schema.org/Product
        json_ld_blocks = re.findall(
            r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html, re.IGNORECASE | re.DOTALL
        )
        for raw in json_ld_blocks:
            try:
                obj = json.loads(raw.strip())
                items = obj if isinstance(obj, list) else [obj]
                for item in items:
                    if item.get("@type") in ("Product", "IndividualProduct"):
                        offers = item.get("offers", {})
                        if isinstance(offers, list):
                            offers = offers[0] if offers else {}
                        price    = offers.get("price") or offers.get("lowPrice")
                        currency = offers.get("priceCurrency", "")
                        avail    = offers.get("availability", "")
                        if "InStock" in avail:
                            avail = "En stock"
                        elif "OutOfStock" in avail:
                            avail = "Sin stock"
                        elif avail:
                            avail = avail.split("/")[-1]
                        if price:
                            return {
                                "price": str(price),
                                "currency": currency,
                                "availability": avail,
                                "source": "json-ld",
                            }
            except Exception:
                continue

        # 2. Meta tags de producto (OpenGraph commerce)
        price_patterns = [
            r'<meta[^>]+property=["\']product:price:amount["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']product:price:amount["\']',
            r'<meta[^>]+property=["\']og:price:amount["\'][^>]+content=["\']([^"\']+)["\']',
        ]
        currency_patterns = [
            r'<meta[^>]+property=["\']product:price:currency["\'][^>]+content=["\']([^"\']+)["\']',
            r'<meta[^>]+property=["\']og:price:currency["\'][^>]+content=["\']([^"\']+)["\']',
        ]
        price = None
        for p in price_patterns:
            m = re.search(p, html, re.IGNORECASE)
            if m:
                price = m.group(1).strip()
                break
        currency = ""
        for p in currency_patterns:
            m = re.search(p, html, re.IGNORECASE)
            if m:
                currency = m.group(1).strip()
                break
        if price:
            return {"price": price, "currency": currency, "availability": "", "source": "meta"}

        return {"price": None, "currency": None, "availability": None, "source": None}

    except Exception as e:
        return {"price": None, "currency": None, "availability": None, "source": None, "error": str(e)}


def search_discogs(q: str, token: Optional[str]):
    if not token:
        return {"cover": None, "source": "discogs", "error": "no token"}

    encoded = urllib.parse.quote(q)
    url = f"https://api.discogs.com/database/search?q={encoded}&type=release&per_page=1&token={token}"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "EspiritusVinilos/1.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read())
        results = data.get("results", [])
        if results:
            img = results[0].get("cover_image")
            if img and "spacer" not in img:
                return {"cover": img, "source": "discogs"}
        return {"cover": None, "source": "discogs"}
    except Exception as e:
        return {"cover": None, "source": "discogs", "error": str(e)}

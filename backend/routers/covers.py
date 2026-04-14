from fastapi import APIRouter, Query, Header
from typing import Optional
import urllib.request
import urllib.parse
import json

router = APIRouter()

# GET /api/covers?type=vinyl&q=Hector+Lavoe+La+Voz
# El backend centraliza la llamada a Discogs — el token nunca sale al frontend
@router.get("/")
def get_cover(
    type: str = Query(...),
    q: str = Query(...),
    x_discogs_token: Optional[str] = Header(None),  # token viene en header, no en URL
):
    if type == "vinyl":
        return search_discogs(q, x_discogs_token)
    # Extensible: rum, whisky pueden tener su propia fuente
    return {"cover": None, "source": None}


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
            # Discogs devuelve una imagen placeholder cuando no hay portada
            if img and "spacer" not in img:
                return {"cover": img, "source": "discogs"}
        return {"cover": None, "source": "discogs"}
    except Exception as e:
        return {"cover": None, "source": "discogs", "error": str(e)}

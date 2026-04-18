from fastapi import APIRouter, HTTPException, Query, Header
from typing import Optional
from data_store import read_collection, write_collection

router = APIRouter()

# GET /api/vinyls — como SELECT * FROM vinilos WHERE ...
@router.get("/")
def get_vinyls(
    genero: Optional[str] = Query(None),
    agrupador: Optional[str] = Query(None),
    fuera: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
):
    data = read_collection("vinilos")

    if genero:
        data = [r for r in data if r.get("genero") == genero]
    if agrupador:
        data = [r for r in data if r.get("agrupador") == agrupador]
    if fuera is not None:
        data = [r for r in data if r.get("fuera") == fuera]
    if search:
        s = search.lower()
        data = [r for r in data if
            s in (r.get("artista") or "").lower() or
            s in (r.get("album") or "").lower() or
            s in (r.get("genero") or "").lower()]

    return data

# GET /api/vinyls/{id} — SELECT * FROM vinilos WHERE rownum = id
@router.get("/{index}")
def get_vinyl(index: int):
    data = read_collection("vinilos")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Vinilo no encontrado")
    return data[index]

# POST /api/vinyls — INSERT INTO vinilos
@router.post("/", status_code=201)
def add_vinyl(vinyl: dict):
    data = read_collection("vinilos")
    data.append(vinyl)
    write_collection("vinilos", data)
    return {"index": len(data) - 1, **vinyl}

# PUT /api/vinyls/{id} — UPDATE vinilos WHERE rownum = id
@router.put("/{index}")
def update_vinyl(index: int, vinyl: dict):
    data = read_collection("vinilos")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Vinilo no encontrado")
    data[index] = vinyl
    write_collection("vinilos", data)
    return vinyl

# DELETE /api/vinyls/{id} — DELETE FROM vinilos WHERE rownum = id
@router.delete("/{index}", status_code=204)
def delete_vinyl(index: int):
    data = read_collection("vinilos")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Vinilo no encontrado")
    data.pop(index)
    write_collection("vinilos", data)

# ── PATCH /api/vinyls/{index}/social — endpoint para Zapier ──────────────────
# Guarda tiktok_url y/o ig_url en un vinilo existente.
# Uso: POST desde Zapier con body { "tiktok_url": "...", "artista": "...", "album": "..." }
# Si se pasa index=-1 busca por artista+album y actualiza el primero que coincida.
@router.patch("/{index}/social")
def patch_social(index: int, payload: dict, x_zapier_token: Optional[str] = Header(None)):
    # Protección mínima por token (configurable en Render env vars)
    import os
    zapier_token = os.environ.get("ZAPIER_TOKEN", "")
    if zapier_token and x_zapier_token != zapier_token:
        raise HTTPException(status_code=401, detail="Token inválido")

    data = read_collection("vinilos")

    # Si index == -1, buscar por artista + album
    if index == -1:
        artista = (payload.get("artista") or "").lower()
        album   = (payload.get("album")   or "").lower()
        index   = next(
            (i for i, r in enumerate(data)
             if artista in (r.get("artista") or "").lower()
             or album   in (r.get("album")   or "").lower()),
            -1
        )

    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Vinilo no encontrado")

    if "tiktok_url" in payload:
        data[index]["tiktok_url"] = payload["tiktok_url"]
    if "ig_url" in payload:
        data[index]["ig_url"] = payload["ig_url"]

    write_collection("vinilos", data)
    return {"index": index, "artista": data[index].get("artista"), "album": data[index].get("album")}

from fastapi import APIRouter, HTTPException, Query
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

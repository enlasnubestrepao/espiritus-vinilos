from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from data_store import read_collection, write_collection

router = APIRouter()

@router.get("/")
def get_whiskies(
    country: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    origin: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    data = read_collection("whiskies")
    if country:
        data = [r for r in data if r.get("country") == country]
    if type:
        data = [r for r in data if r.get("type") == type]
    if origin:
        data = [r for r in data if r.get("origin") == origin]
    if search:
        s = search.lower()
        data = [r for r in data if
            s in (r.get("brand") or "").lower() or
            s in (r.get("version") or "").lower() or
            s in (r.get("distillery") or "").lower()]
    return data

@router.get("/{index}")
def get_whisky(index: int):
    data = read_collection("whiskies")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Whisky no encontrado")
    return data[index]

@router.post("/", status_code=201)
def add_whisky(whisky: dict):
    data = read_collection("whiskies")
    data.append(whisky)
    write_collection("whiskies", data)
    return {"index": len(data) - 1, **whisky}

@router.put("/{index}")
def update_whisky(index: int, whisky: dict):
    data = read_collection("whiskies")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Whisky no encontrado")
    data[index] = whisky
    write_collection("whiskies", data)
    return whisky

@router.delete("/{index}", status_code=204)
def delete_whisky(index: int):
    data = read_collection("whiskies")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Whisky no encontrado")
    data.pop(index)
    write_collection("whiskies", data)

from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from data_store import read_collection, write_collection

router = APIRouter()

@router.get("/")
def get_rums(
    country: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
):
    data = read_collection("rums")
    if country:
        data = [r for r in data if r.get("country") == country]
    if type:
        data = [r for r in data if r.get("type") == type]
    if search:
        s = search.lower()
        data = [r for r in data if
            s in (r.get("brand") or "").lower() or
            s in (r.get("name") or "").lower() or
            s in (r.get("country") or "").lower()]
    return data

@router.get("/{index}")
def get_rum(index: int):
    data = read_collection("rums")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Ron no encontrado")
    return data[index]

@router.post("/", status_code=201)
def add_rum(rum: dict):
    data = read_collection("rums")
    data.append(rum)
    write_collection("rums", data)
    return {"index": len(data) - 1, **rum}

@router.put("/{index}")
def update_rum(index: int, rum: dict):
    data = read_collection("rums")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Ron no encontrado")
    data[index] = rum
    write_collection("rums", data)
    return rum

@router.delete("/{index}", status_code=204)
def delete_rum(index: int):
    data = read_collection("rums")
    if index < 0 or index >= len(data):
        raise HTTPException(status_code=404, detail="Ron no encontrado")
    data.pop(index)
    write_collection("rums", data)

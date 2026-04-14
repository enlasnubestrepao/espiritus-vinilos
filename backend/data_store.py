import json
import os
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"

# Lee un archivo JSON — como un SELECT * FROM tabla
def read_collection(name: str) -> list:
    path = DATA_DIR / f"{name}.json"
    if not path.exists():
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

# Escribe el archivo JSON completo — como TRUNCATE + INSERT bulk
def write_collection(name: str, data: list) -> None:
    path = DATA_DIR / f"{name}.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

import os, json, uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
import redis

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

router = APIRouter(prefix="/modules", tags=["modules"])

KEY_PREFIX = "ualf:module:"

class ModuleIn(BaseModel):
    title: str = Field(..., min_length=2, max_length=160)
    objective: str = Field(..., min_length=2, max_length=2000)
    bloom_level: Optional[str] = Field(default="apply")

class Module(ModuleIn):
    id: str

def _key(module_id: str) -> str:
    return f"{KEY_PREFIX}{module_id}"

@router.post("", response_model=Module)
def create_module(payload: ModuleIn):
    mid = str(uuid.uuid4())
    data = {"id": mid, **payload.model_dump()}
    r.set(_key(mid), json.dumps(data))
    return data

@router.get("", response_model=List[Module])
def list_modules():
    modules = []
    cursor = "0"
    while True:
        cursor, keys = r.scan(cursor=cursor, match=f"{KEY_PREFIX}*")
        for k in keys:
            raw = r.get(k)
            if raw:
                modules.append(json.loads(raw))
        if cursor == "0":
            break
    modules.sort(key=lambda m: m["id"], reverse=True)
    return modules

@router.get("/{module_id}", response_model=Module)
def get_module(module_id: str):
    raw = r.get(_key(module_id))
    if not raw:
        raise HTTPException(status_code=404, detail="Module not found")
    return json.loads(raw)

@router.delete("/{module_id}")
def delete_module(module_id: str):
    deleted = r.delete(_key(module_id))
    if not deleted:
        raise HTTPException(status_code=404, detail="Module not found")
    return {"ok": True, "deleted": module_id}

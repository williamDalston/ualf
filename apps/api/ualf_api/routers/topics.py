from fastapi import APIRouter
from uuid import uuid4
router = APIRouter()
@router.post("/topics")
def create_topic(payload: dict):
    return {"id": str(uuid4()), "title": payload.get("title","")}

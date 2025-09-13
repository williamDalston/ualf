from fastapi import APIRouter

router = APIRouter(prefix="/health")

@router.get("")
def health():
    return {"ready": True, "message": "API is healthy"}

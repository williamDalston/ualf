from fastapi import APIRouter
from .settings import Settings

health_router = APIRouter()
settings = Settings()

@health_router.get("/live")
def live():
    return {"status":"live"}

@health_router.get("/ready")
def ready():
    if settings.READINESS_STRICT:
        return {"status":"ready","checks":{"db":"skipped","cache":"skipped"}}
    return {"status":"ready"}

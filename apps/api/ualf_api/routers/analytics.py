from fastapi import APIRouter
router = APIRouter(prefix="/analytics")
@router.get("/summary")
def summary():
    return {"effect_size":0.52,"time_to_mastery_days":14,"violation_rate":0.01,"cogs_per_user_month":2.75,"p95_latency_ms":900}

from fastapi import APIRouter
router = APIRouter()
@router.get("/planner/plan")
def get_plan(topic_id: str):
    bloom = ["Remember","Understand","Apply","Analyze","Evaluate","Create"]
    concepts = [{"id":"c1","name":"Foundations"},{"id":"c2","name":"Applications"}]
    return {"topic_id":topic_id,"bloom":bloom,"concepts":concepts}

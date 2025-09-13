from fastapi import APIRouter
router = APIRouter(prefix="/learner")
@router.get("/pretest")
def get_pre(topic_id:str):
    items=[{"q":"Q1","options":["A","B","C","D"]},{"q":"Q2","options":["A","B","C","D"]}]
    return {"topic_id":topic_id,"items":items}
@router.get("/practice")
def get_practice(topic_id:str):
    return {"topic_id":topic_id,"items":[{"q":"GateQ","options":["A","B","C","D"]}]}
@router.post("/gate/check")
def gate_check(payload:dict):
    return {"pass": True, "score": 90, "rationale_quality": 4.2, "remediation": None}
@router.get("/posttest")
def get_post(topic_id:str):
    return {"topic_id":topic_id,"items":[{"q":"PostQ","options":["A","B","C","D"]}]}
@router.post("/posttest/submit")
def submit_post(payload:dict):
    return {"ok":True}

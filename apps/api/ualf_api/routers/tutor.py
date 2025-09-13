from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/tutor")

@router.post("/turn")
async def socratic_turn(req: Request):
    async def gen():
        yield b"The tutor will not provide direct answers. "
        yield b"Think through prerequisites and explain your reasoning."
    return StreamingResponse(gen(), media_type="text/plain")

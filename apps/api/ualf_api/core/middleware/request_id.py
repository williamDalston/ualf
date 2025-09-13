import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from ..logging import set_request_id

class RequestIdMiddleware(BaseHTTPMiddleware):
    header_name = "X-Request-ID"
    def _ensure_id(self, request: Request) -> str:
        rid = request.headers.get(self.header_name) or str(uuid.uuid4())
        set_request_id(rid)
        return rid
    async def dispatch(self, request: Request, call_next):
        rid = self._ensure_id(request)
        try:
            resp: Response = await call_next(request)
        finally:
            set_request_id(None)
        resp.headers[self.header_name] = rid
        return resp

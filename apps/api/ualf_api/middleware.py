import time
import uuid
import logging
from logging import Logger
from pythonjsonlogger import jsonlogger
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

def _configure_logger() -> Logger:
    logger = logging.getLogger("ualf")
    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = jsonlogger.JsonFormatter("%(asctime)s %(levelname)s %(message)s")
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger

logger = _configure_logger()

def add_request_id_middleware(app: FastAPI):
    @app.middleware("http")
    async def request_id_mw(request: Request, call_next):
        rid = request.headers.get("x-request-id", str(uuid.uuid4()))
        request.state.request_id = rid
        response = await call_next(request)
        response.headers["x-request-id"] = rid
        return response

def add_logging_middleware(app: FastAPI):
    @app.middleware("http")
    async def logging_mw(request: Request, call_next):
        start = time.time()
        rid = getattr(request.state, "request_id", str(uuid.uuid4()))
        try:
            response = await call_next(request)
            duration_ms = int((time.time() - start) * 1000)
            logger.info("request_ok", extra={"request_id": rid, "path": request.url.path, "method": request.method, "status_code": response.status_code, "duration_ms": duration_ms})
            return response
        except Exception as ex:
            duration_ms = int((time.time() - start) * 1000)
            logger.exception("request_error", extra={"request_id": rid, "path": request.url.path, "method": request.method, "duration_ms": duration_ms, "error": str(ex)})
            return JSONResponse(status_code=500, content={"error":{"code":"ERR-0500","message":"Internal server error","request_id":rid}})

def install_exception_handlers(app: FastAPI):
    from fastapi.exceptions import RequestValidationError
    from starlette.exceptions import HTTPException as StarletteHTTPException

    @app.exception_handler(RequestValidationError)
    async def validation_handler(request: Request, exc: RequestValidationError):
        rid = getattr(request.state, "request_id", str(uuid.uuid4()))
        logger.warning("validation_error", extra={"request_id": rid, "errors": exc.errors()})
        return JSONResponse(status_code=422, content={"error":{"code":"ERR-0001","message":"Invalid request","details":exc.errors(),"request_id":rid}})

    @app.exception_handler(StarletteHTTPException)
    async def http_handler(request: Request, exc: StarletteHTTPException):
        rid = getattr(request.state, "request_id", str(uuid.uuid4()))
        return JSONResponse(status_code=exc.status_code, content={"error":{"code":"ERR-0002" if exc.status_code==404 else "ERR-0500","message":exc.detail,"request_id":rid}})

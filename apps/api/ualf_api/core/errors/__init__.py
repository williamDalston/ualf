from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ValidationError
from fastapi.exceptions import RequestValidationError
from ..logging import log, get_request_id

class ErrorResponse(BaseModel):
    error_code: str
    message: str
    detail: dict | list | str | None = None
    request_id: str | None = None

def http_exception_handler(request: Request, exc: HTTPException):
    body = ErrorResponse(
        error_code=f"HTTP_{exc.status_code}",
        message=exc.detail if isinstance(exc.detail, str) else "HTTP error",
        detail=None if isinstance(exc.detail, str) else exc.detail,
        request_id=get_request_id(),
    ).model_dump()
    return JSONResponse(status_code=exc.status_code, content=body)

def validation_exception_handler(request: Request, exc: RequestValidationError | ValidationError):
    body = ErrorResponse(
        error_code="VALIDATION_ERROR",
        message="Invalid request",
        detail=exc.errors() if hasattr(exc, "errors") else str(exc),
        request_id=get_request_id(),
    ).model_dump()
    return JSONResponse(status_code=422, content=body)

def unhandled_exception_handler(request: Request, exc: Exception):
    log.exception("unhandled_exception", path=str(request.url), method=request.method)
    body = ErrorResponse(
        error_code="INTERNAL_ERROR",
        message="Unexpected server error",
        detail=None,
        request_id=get_request_id(),
    ).model_dump()
    return JSONResponse(status_code=500, content=body)

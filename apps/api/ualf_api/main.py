from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .routers import analytics as analytics_router, tutor as tutor_router
from .routers import modules as modules_router
from .core.logging import configure_logging, log, Stopwatch
from .core.middleware.request_id import RequestIdMiddleware
from .core.errors import http_exception_handler, validation_exception_handler, unhandled_exception_handler
from fastapi.exceptions import RequestValidationError

app = FastAPI(title="UALF API", version="0.1.0")

configure_logging()
app.add_middleware(RequestIdMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics_router.router)
app.include_router(tutor_router.router)
app.include_router(modules_router.router)

@app.middleware("http")
async def log_requests(request, call_next):
    sw = Stopwatch()
    response = await call_next(request)
    log.info("http_request", method=request.method, path=request.url.path, status=response.status_code, duration_ms=sw.ms())
    return response

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

@app.get("/debug/boom")
def boom():
    raise ValueError("boom")

@app.get("/health")
def health():
    return {"ready": True, "message": "API is healthy"}

from __future__ import annotations
import logging, sys, time, uuid, contextvars
from pythonjsonlogger import jsonlogger
import structlog

_request_id: contextvars.ContextVar[str | None] = contextvars.ContextVar("request_id", default=None)

def get_request_id() -> str | None:
    return _request_id.get()

def set_request_id(value: str | None) -> None:
    _request_id.set(value)

def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    fmt = jsonlogger.JsonFormatter("%(asctime)s %(levelname)s %(name)s %(message)s")
    handler.setFormatter(fmt)
    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(level)

    structlog.configure(
        processors=[
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            lambda _, __, event_dict: (event_dict.update(request_id=get_request_id()) or event_dict),
            structlog.processors.dict_tracebacks,
            structlog.processors.JSONRenderer(),
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

log = structlog.get_logger()

class Stopwatch:
    def __init__(self): self.start=time.perf_counter()
    def ms(self): return int((time.perf_counter()-self.start)*1000)

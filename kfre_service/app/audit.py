import logging
from pythonjsonlogger import jsonlogger

logger = logging.getLogger("kfre_service")
logger.setLevel(logging.INFO)

handler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    "%(asctime)s %(levelname)s %(name)s %(event)s %(request_id)s %(meta)s"
)
handler.setFormatter(formatter)
logger.addHandler(handler)


def audit(event: str, request_id: str, meta: dict):
    logger.info("audit", extra={
        "event": event,
        "request_id": request_id,
        "meta": meta
    })

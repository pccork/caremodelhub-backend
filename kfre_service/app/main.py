import uuid
from fastapi import FastAPI, Header, HTTPException
from .schemas import KFREInput, KFREOutput
from .kfre import calculate_kfre_5y, MODEL_NAME, MODEL_VERSION
from .audit import audit

app = FastAPI(
    title="CareModelHub KFRE Service",
    version=MODEL_VERSION
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "kfre_service",
        "model": MODEL_NAME,
        "version": MODEL_VERSION,
    }


@app.post("/calculate", response_model=KFREOutput)
def calculate(
    payload: KFREInput,
    x_request_id: str | None = Header(default=None),
):
    request_id = x_request_id or str(uuid.uuid4())

    audit("kfre.calculate.start", request_id, {
        "age": payload.age,
        "sex": payload.sex,
        "egfr": payload.egfr,
        "acr_present": payload.acr > 0,
    })

    try:
        risk_5y = calculate_kfre_5y(
            payload.age,
            payload.sex,
            payload.egfr,
            payload.acr,
        )
    except Exception as e:
        audit("kfre.calculate.error", request_id, {"error": str(e)})
        raise HTTPException(status_code=400, detail=str(e))

    audit("kfre.calculate.success", request_id, {
        "risk_5y_percent": risk_5y,
    })

    return KFREOutput(
        request_id=request_id,
        model=MODEL_NAME,
        model_version=MODEL_VERSION,
        risk_5y_percent=risk_5y,
        interpretation="5-year kidney failure risk using KFRE 4-variable equation",
    )

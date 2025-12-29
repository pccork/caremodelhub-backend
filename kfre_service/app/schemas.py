from pydantic import BaseModel, Field, field_validator

class KFREInput(BaseModel):
    age: int = Field(ge=18, le=110)
    sex: str
    egfr: float = Field(gt=0, le=200)
    acr: float = Field(gt=0, le=5000)

    @field_validator("sex")
    @classmethod
    def validate_sex(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ("male", "female"):
            raise ValueError("sex must be 'male' or 'female'")
        return v


class KFREOutput(BaseModel):
    request_id: str
    model: str
    model_version: str
    risk_5y_percent: float
    interpretation: str

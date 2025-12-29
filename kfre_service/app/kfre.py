"""
KFRE 4-variable equation (5-year risk)
Calibrated to a non–North American population

Risk = 1 - 0.9365 ^ exp(βsum)

βsum =
-0.2201 × (age/10 − 7.036)
+ 0.2467 × (male − 0.5642)
− 0.5567 × (eGFR/5 − 7.222)
+ 0.4510 × (ln(ACR) − 5.137)

male = 1 if male, 0 if female
"""

import math

MODEL_NAME = "KFRE_4VAR_5YR"
MODEL_VERSION = "1.0.0-nonNA-calibrated"


def calculate_kfre_5y(age: int, sex: str, egfr: float, acr: float) -> float:
    """
    Returns 5-year ESRD risk percentage (0–100).
    """
    if sex not in ("male", "female"):
        raise ValueError("sex must be 'male' or 'female'")

    male = 1 if sex.lower() == "male" else 0

    if acr <= 0:
        raise ValueError("ACR must be > 0")

    log_acr = math.log(acr)

    beta_sum = (
        -0.2201 * (age / 10 - 7.036)
        + 0.2467 * (male - 0.5642)
        - 0.5567 * (egfr / 5 - 7.222)
        + 0.4510 * (log_acr - 5.137)
    )

    risk = 1 - math.pow(0.9365, math.exp(beta_sum))

    return round(max(0.0, min(risk * 100, 100.0)), 2)

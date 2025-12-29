# kfre_service/tests/test_kfre.py

import math
import pytest
from app.kfre import calculate_kfre_5y


def test_known_reference_case_male():
    """
    Reference test:
    age=60, male, eGFR=35, ACR=120
    Expected ≈ 8.49% (validated manually)
    """
    risk = calculate_kfre_5y(
        age=60,
        sex="male",
        egfr=35,
        acr=120
    )

    assert risk == pytest.approx(8.49, rel=0.01)


def test_known_reference_case_female():
    """
    Female risk should be lower than male for same parameters
    """
    male_risk = calculate_kfre_5y(
        age=60,
        sex="male",
        egfr=35,
        acr=120
    )

    female_risk = calculate_kfre_5y(
        age=60,
        sex="female",
        egfr=35,
        acr=120
    )

    assert female_risk < male_risk


def test_deterministic_output():
    """
    Same inputs must always return same output
    """
    r1 = calculate_kfre_5y(55, "male", 40, 80)
    r2 = calculate_kfre_5y(55, "male", 40, 80)

    assert r1 == r2


def test_invalid_sex_raises():
    with pytest.raises(ValueError):
        calculate_kfre_5y(
            age=60,
            sex="unknown",
            egfr=35,
            acr=120
        )


def test_invalid_acr_raises():
    with pytest.raises(ValueError):
        calculate_kfre_5y(
            age=60,
            sex="male",
            egfr=35,
            acr=0
        )

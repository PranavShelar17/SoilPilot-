"""Soil service — retrieves soil data with classification."""

from typing import Optional, List
from sqlalchemy.orm import Session

from backend.app.models.soil import SoilSample, SoilObservation, SoilParameter, SoilClassificationRule


def get_soil_summary(field_id: int, db: Session) -> Optional[dict]:
    """Get soil summary for a field — latest sample with key parameters."""
    latest_sample = db.query(SoilSample).filter(
        SoilSample.field_id == field_id
    ).order_by(SoilSample.sample_date.desc()).first()

    if not latest_sample:
        return None

    observations = db.query(SoilObservation).filter(
        SoilObservation.sample_id == latest_sample.id
    ).all()

    params_data = []
    for obs in observations:
        param = db.query(SoilParameter).filter(SoilParameter.id == obs.parameter_id).first()
        if not param:
            continue

        status, status_mr, interpretation = _classify_value(param.id, obs.value, db)

        params_data.append({
            "parameter_name": param.name,
            "parameter_name_mr": param.name_mr,
            "value": obs.value,
            "unit": obs.unit or param.unit,
            "category": param.category,
            "status": status,
            "status_mr": status_mr,
            "interpretation": interpretation,
            "data_source": obs.data_source.value if obs.data_source else None,
            "display_order": param.display_order,
        })

    params_data.sort(key=lambda x: x["display_order"])

    # Key parameters (first 6)
    key_params = [p for p in params_data if p["category"] in ("chemical", "primary")][:6]

    return {
        "field_id": field_id,
        "latest_sample_date": latest_sample.sample_date,
        "depth": f"{int(latest_sample.depth_from_cm or 0)}-{int(latest_sample.depth_to_cm or 30)} cm",
        "is_demo": latest_sample.is_demo,
        "overall_status": None,  # Not classified without ALL validated rules
        "overall_status_message": "Not classified — classification rules not configured",
        "key_parameters": key_params,
        "all_parameters": params_data,
    }


def get_soil_history(field_id: int, db: Session) -> List[dict]:
    """Get all soil samples for a field ordered by date."""
    samples = db.query(SoilSample).filter(
        SoilSample.field_id == field_id
    ).order_by(SoilSample.sample_date.desc()).all()

    result = []
    for sample in samples:
        observations = db.query(SoilObservation).filter(
            SoilObservation.sample_id == sample.id
        ).all()

        obs_data = []
        for obs in observations:
            param = db.query(SoilParameter).filter(SoilParameter.id == obs.parameter_id).first()
            if not param:
                continue
            status, status_mr, interpretation = _classify_value(param.id, obs.value, db)
            obs_data.append({
                "parameter_name": param.name,
                "parameter_name_mr": param.name_mr,
                "value": obs.value,
                "unit": obs.unit or param.unit,
                "category": param.category,
                "status": status,
                "status_mr": status_mr,
                "display_order": param.display_order,
            })

        obs_data.sort(key=lambda x: x["display_order"])

        result.append({
            "id": sample.id,
            "sample_date": sample.sample_date,
            "depth_from_cm": sample.depth_from_cm,
            "depth_to_cm": sample.depth_to_cm,
            "data_source": sample.data_source.value if sample.data_source else None,
            "lab_name": sample.lab_name,
            "is_demo": sample.is_demo,
            "observations": obs_data,
        })

    return result


def _classify_value(parameter_id: int, value: Optional[float], db: Session) -> tuple:
    """
    Classify a soil value using configured rules.
    Returns (status, status_mr, interpretation).
    If no rule exists, returns "Not classified".
    """
    if value is None:
        return (None, None, None)

    rules = db.query(SoilClassificationRule).filter(
        SoilClassificationRule.parameter_id == parameter_id,
        SoilClassificationRule.is_active == True,  # noqa: E712
    ).all()

    if not rules:
        return ("Not classified", "वर्गीकृत नाही", "Classification rule not configured")

    for rule in rules:
        min_ok = rule.min_value is None or value >= rule.min_value
        max_ok = rule.max_value is None or value < rule.max_value
        if min_ok and max_ok:
            return (rule.status, rule.status_mr, rule.interpretation)

    return ("Not classified", "वर्गीकृत नाही", "Value outside configured ranges")

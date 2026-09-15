"""Soil API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.api.deps import get_current_farmer, verify_field_ownership
from backend.app.models.farmer import Farmer
from backend.app.services.soil_service import get_soil_summary, get_soil_history

router = APIRouter(tags=["Soil"])


@router.get("/fields/{field_id}/soil")
def get_field_soil(field_id: int, farmer: Farmer = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Get full soil data for a field."""
    if not verify_field_ownership(farmer.id, field_id, db):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This field is not associated with your account.")

    summary = get_soil_summary(field_id, db)
    if not summary:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil data is not available for this field.")
    return summary


@router.get("/fields/{field_id}/soil/summary")
def get_field_soil_summary(field_id: int, farmer: Farmer = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Get key soil parameters summary."""
    if not verify_field_ownership(farmer.id, field_id, db):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This field is not associated with your account.")

    summary = get_soil_summary(field_id, db)
    if not summary:
        return {"field_id": field_id, "key_parameters": [], "overall_status": None, "overall_status_message": "No soil data available"}
    return {"field_id": field_id, "key_parameters": summary["key_parameters"], "overall_status": summary["overall_status"], "overall_status_message": summary["overall_status_message"], "is_demo": summary["is_demo"]}


@router.get("/fields/{field_id}/soil/history")
def get_field_soil_history(field_id: int, farmer: Farmer = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Get soil test history for a field."""
    if not verify_field_ownership(farmer.id, field_id, db):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This field is not associated with your account.")

    history = get_soil_history(field_id, db)
    return {"field_id": field_id, "records": history}

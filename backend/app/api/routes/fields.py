"""Fields API routes with authorization enforcement."""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from backend.app.db.session import get_db
from backend.app.api.deps import get_current_farmer
from backend.app.models.farmer import Farmer
from backend.app.services.field_service import get_farmer_fields, get_field_by_id, search_field_by_gat

router = APIRouter(prefix="/fields", tags=["Fields"])


@router.get("")
def list_my_fields(farmer: Farmer = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Get all fields authorized for the current farmer."""
    fields = get_farmer_fields(farmer.id, db)
    return {"fields": fields, "total": len(fields)}


@router.get("/search")
def search_field(
    gat_no: str = Query(..., description="Gat/Survey number"),
    village_id: Optional[int] = Query(None),
    farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """
    Search field by Gat number.
    Backend enforces authorization — farmer cannot access another farmer's field.
    """
    # Default to farmer's village if not specified
    vid = village_id or farmer.village_id
    if not vid:
        raise HTTPException(status_code=400, detail="Village not specified.")

    result = search_field_by_gat(gat_no, vid, farmer.id, db)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No field was found for this Gat number.",
        )
    if result == "unauthorized":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This field is not associated with your account.",
        )
    return result


@router.get("/{field_id}")
def get_field(
    field_id: int,
    farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Get field details — authorization enforced."""
    field = get_field_by_id(field_id, farmer.id, db)
    if not field:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This field is not associated with your account.",
        )
    return field

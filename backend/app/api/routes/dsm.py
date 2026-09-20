"""DSM API routes."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.dsm import DSMLayer, DSMLayerMetadata

router = APIRouter(prefix="/dsm", tags=["DSM"])


@router.get("/layers")
def list_dsm_layers(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """List all registered DSM layers."""
    layers = db.query(DSMLayer).all()
    result = []
    for layer in layers:
        meta = db.query(DSMLayerMetadata).filter(DSMLayerMetadata.layer_id == layer.id).first()
        result.append({
            "id": layer.id,
            "property_name": layer.property_name,
            "property_name_mr": layer.property_name_mr,
            "depth_from_cm": layer.depth_from_cm,
            "depth_to_cm": layer.depth_to_cm,
            "unit": layer.unit,
            "status": layer.status.value,
            "is_demo": layer.is_demo,
            "resolution_m": meta.resolution_m if meta else None,
            "model_name": meta.model_name if meta else None,
        })
    return {"layers": result}


@router.get("/layers/{layer_id}")
def get_dsm_layer(layer_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get DSM layer details."""
    layer = db.query(DSMLayer).filter(DSMLayer.id == layer_id).first()
    if not layer:
        raise HTTPException(status_code=404, detail="DSM layer not found.")
    meta = db.query(DSMLayerMetadata).filter(DSMLayerMetadata.layer_id == layer.id).first()
    return {
        "id": layer.id, "property_name": layer.property_name,
        "status": layer.status.value, "is_demo": layer.is_demo,
        "metadata": {
            "resolution_m": meta.resolution_m if meta else None,
            "model_name": meta.model_name if meta else None,
            "model_version": meta.model_version if meta else None,
        } if meta else None,
    }


@router.get("/properties")
def list_dsm_properties(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """List available DSM properties."""
    layers = db.query(DSMLayer).all()
    seen = set()
    props = []
    for l in layers:
        if l.property_name not in seen:
            seen.add(l.property_name)
            props.append({"name": l.property_name, "name_mr": l.property_name_mr, "unit": l.unit, "available": l.status.value == "AVAILABLE"})
    return {"properties": props}


@router.get("/depths")
def list_dsm_depths(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """List available DSM depths."""
    return {"depths": [{"depth_from_cm": 0, "depth_to_cm": 30, "label": "0-30 cm"}]}

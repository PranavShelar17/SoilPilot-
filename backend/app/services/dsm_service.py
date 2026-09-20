"""
DSM Service
============
Service layer for Digital Soil Mapping layer management.
Provides listing, detail retrieval, and placeholder for raster tile serving.
"""

from typing import Optional, List
from sqlalchemy.orm import Session

from backend.app.models.dsm import DSMLayer, DSMLayerMetadata, DSMLayerStatusEnum
from backend.app.core.logging import get_logger

logger = get_logger(__name__)


def get_all_dsm_layers(db: Session) -> dict:
    """Get all DSM layers with metadata summary."""
    layers = db.query(DSMLayer).all()
    result = []
    properties_seen = set()
    properties = []
    depths_seen = set()
    depths = []

    for layer in layers:
        meta = db.query(DSMLayerMetadata).filter(
            DSMLayerMetadata.layer_id == layer.id
        ).first()

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

        # Track unique properties
        if layer.property_name not in properties_seen:
            properties_seen.add(layer.property_name)
            properties.append({
                "name": layer.property_name,
                "name_mr": layer.property_name_mr,
                "unit": layer.unit,
                "available": layer.status == DSMLayerStatusEnum.AVAILABLE,
            })

        # Track unique depths
        depth_key = (layer.depth_from_cm, layer.depth_to_cm)
        if depth_key not in depths_seen:
            depths_seen.add(depth_key)
            depths.append({
                "depth_from_cm": layer.depth_from_cm,
                "depth_to_cm": layer.depth_to_cm,
                "label": f"{int(layer.depth_from_cm)}-{int(layer.depth_to_cm)} cm",
            })

    return {
        "layers": result,
        "properties": properties,
        "depths": depths,
    }


def get_dsm_layer_detail(layer_id: int, db: Session) -> Optional[dict]:
    """Get detailed DSM layer info with metadata."""
    layer = db.query(DSMLayer).filter(DSMLayer.id == layer_id).first()
    if not layer:
        return None

    meta = db.query(DSMLayerMetadata).filter(
        DSMLayerMetadata.layer_id == layer.id
    ).first()

    return {
        "id": layer.id,
        "property_name": layer.property_name,
        "property_name_mr": layer.property_name_mr,
        "depth_from_cm": layer.depth_from_cm,
        "depth_to_cm": layer.depth_to_cm,
        "unit": layer.unit,
        "status": layer.status.value,
        "is_demo": layer.is_demo,
        "file_path": layer.file_path,
        "metadata": {
            "resolution_m": meta.resolution_m,
            "crs": meta.crs,
            "model_name": meta.model_name,
            "model_version": meta.model_version,
            "prediction_method": meta.prediction_method,
            "uncertainty": meta.uncertainty,
            "validation_r2": meta.validation_r2,
            "validation_rmse": meta.validation_rmse,
            "source_agency": meta.source_agency,
            "notes": meta.notes,
        } if meta else None,
    }

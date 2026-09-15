"""Pydantic schemas for fields."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class FieldResponse(BaseModel):
    id: int
    village_id: int
    village_name: Optional[str] = None
    village_name_mr: Optional[str] = None
    taluka_name: Optional[str] = None
    district_name: Optional[str] = None
    gat_no: str
    area_reported_ha: Optional[float] = None
    area_calculated_ha: Optional[float] = None
    is_demo: bool = False
    geometry_geojson: Optional[dict] = None
    soil_health_status: Optional[str] = None
    last_soil_test: Optional[str] = None

    class Config:
        from_attributes = True


class FieldListResponse(BaseModel):
    fields: List[FieldResponse]
    total: int

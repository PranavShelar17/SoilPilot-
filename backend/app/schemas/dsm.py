"""Pydantic schemas for DSM layers."""
from pydantic import BaseModel
from typing import Optional, List


class DSMLayerResponse(BaseModel):
    id: int
    property_name: str
    property_name_mr: Optional[str] = None
    depth_from_cm: float
    depth_to_cm: float
    unit: Optional[str] = None
    status: str
    is_demo: bool = False
    resolution_m: Optional[float] = None
    model_name: Optional[str] = None

    class Config:
        from_attributes = True


class DSMPropertyResponse(BaseModel):
    name: str
    name_mr: Optional[str] = None
    unit: Optional[str] = None
    available: bool = False


class DSMDepthResponse(BaseModel):
    depth_from_cm: float
    depth_to_cm: float
    label: str


class DSMLayersListResponse(BaseModel):
    layers: List[DSMLayerResponse]
    properties: List[DSMPropertyResponse]
    depths: List[DSMDepthResponse]

"""Pydantic schemas for soil data."""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SoilObservationResponse(BaseModel):
    parameter_name: str
    parameter_name_mr: Optional[str] = None
    value: Optional[float] = None
    unit: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    status_mr: Optional[str] = None
    interpretation: Optional[str] = None
    data_source: Optional[str] = None
    display_order: int = 0

    class Config:
        from_attributes = True


class SoilSampleResponse(BaseModel):
    id: int
    sample_date: Optional[datetime] = None
    depth_from_cm: Optional[float] = None
    depth_to_cm: Optional[float] = None
    data_source: Optional[str] = None
    lab_name: Optional[str] = None
    is_demo: bool = False
    observations: List[SoilObservationResponse] = []

    class Config:
        from_attributes = True


class SoilSummaryResponse(BaseModel):
    field_id: int
    gat_no: str
    village_name: Optional[str] = None
    latest_sample_date: Optional[datetime] = None
    depth: Optional[str] = None
    is_demo: bool = False
    overall_status: Optional[str] = None  # None if rules not configured
    overall_status_message: Optional[str] = None
    key_parameters: List[SoilObservationResponse] = []
    all_parameters: List[SoilObservationResponse] = []

    class Config:
        from_attributes = True


class SoilHistoryResponse(BaseModel):
    field_id: int
    records: List[SoilSampleResponse] = []

    class Config:
        from_attributes = True

"""Pydantic schemas for reports."""
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime


class ReportCreateRequest(BaseModel):
    field_id: int
    report_type: str = "soil_health_card"


class ReportResponse(BaseModel):
    id: UUID
    field_id: int
    gat_no: Optional[str] = None
    report_type: str
    public_token: UUID
    report_version: int
    created_at: datetime
    has_pdf: bool = False

    class Config:
        from_attributes = True


class ReportListResponse(BaseModel):
    reports: List[ReportResponse]


class PublicReportResponse(BaseModel):
    """Public report data — NO sensitive farmer info exposed."""
    report_id: str
    report_type: str
    report_version: int
    created_at: datetime
    village: Optional[str] = None
    gat_no: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None
    is_demo: bool = False
    soil_parameters: List[dict] = []
    verified: bool = True

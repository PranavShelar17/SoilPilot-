"""Pydantic schemas for common responses."""
from pydantic import BaseModel
from typing import Optional, List, Any


class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None


class MessageResponse(BaseModel):
    message: str
    success: bool = True


class HealthResponse(BaseModel):
    status: str
    version: str
    demo_mode: bool

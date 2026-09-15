"""Pydantic schemas for authentication."""

from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID


class OTPRequest(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=15, pattern=r"^\d{10,15}$")


class OTPVerify(BaseModel):
    mobile: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=4, max_length=6)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    farmer_name: Optional[str] = None


class UserResponse(BaseModel):
    id: UUID
    mobile: str
    role: str
    farmer_name: Optional[str] = None
    farmer_name_mr: Optional[str] = None
    village: Optional[str] = None
    village_mr: Optional[str] = None
    taluka: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

    class Config:
        from_attributes = True

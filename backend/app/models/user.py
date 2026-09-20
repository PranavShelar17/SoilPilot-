"""
User & OTP Models
=================
User accounts and OTP records for authentication.

Security rules:
- users.mobile is UNIQUE
- OTP records track expiry, attempts, and usage
- Development OTP (123456) only when APP_ENV=development
"""

import uuid
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class User(Base):
    """
    User account for authentication.
    Each user has a unique mobile number.
    Role determines access level (farmer, officer, scientist, admin).
    """
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mobile = Column(String(15), nullable=False, unique=True, index=True)
    role = Column(String(20), nullable=False, default="farmer")     # farmer, officer, scientist, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    farmer = relationship("Farmer", back_populates="user", uselist=False)
    otp_records = relationship("OTPRecord", back_populates="user", lazy="dynamic")

    def __repr__(self):
        return f"<User(id={self.id}, mobile='{self.mobile}', role='{self.role}')>"


class OTPRecord(Base):
    """
    OTP verification record.

    Security:
    - OTP expires after OTP_EXPIRY_SECONDS (default: 5 minutes)
    - Maximum OTP_MAX_ATTEMPTS verification attempts (default: 3)
    - OTP is invalidated (is_used=True) after successful verification
    - Rate limiting: OTP_COOLDOWN_SECONDS between requests (default: 60s)
    """
    __tablename__ = "otp_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    otp_hash = Column(String(255), nullable=False)          # Hashed OTP, never store plaintext
    expires_at = Column(DateTime(timezone=True), nullable=False)
    attempts = Column(Integer, default=0)                    # Failed verification attempts
    is_used = Column(Boolean, default=False)                 # Invalidated after success
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="otp_records")

    def __repr__(self):
        return f"<OTPRecord(id={self.id}, user_id={self.user_id}, is_used={self.is_used})>"

"""
Report & Audit Log Models
==========================
Report generation records and audit logging.

Key design:
- public_token (UUID, UNIQUE) — used in public QR URLs, never exposes database IDs
- report_version — for report versioning
- Audit logs for future admin panel
"""

import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Report(Base):
    """
    Generated report record.

    public_token is a cryptographically random UUID used for:
    - Public report URLs: /report/{public_token}
    - QR code links: {PUBLIC_APP_URL}/report/{public_token}

    Never expose internal database IDs in public URLs.
    Public report endpoint must not reveal sensitive farmer information.
    """
    __tablename__ = "reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    field_id = Column(Integer, ForeignKey("fields.id", ondelete="CASCADE"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)

    # Report identification
    report_type = Column(String(50), nullable=False, default="soil_health_card")  # soil_health_card, field_report, dsm_report
    public_token = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, nullable=False, index=True)
    report_version = Column(Integer, default=1)

    # Generated file
    pdf_path = Column(String(500), nullable=True)

    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    field = relationship("Field", back_populates="reports")
    farmer = relationship("Farmer")

    def __repr__(self):
        return f"<Report(id={self.id}, type='{self.report_type}', token={self.public_token})>"


class AuditLog(Base):
    """
    Audit log for tracking user actions.
    Designed for future admin panel — no admin UI in V1.
    """
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False)                     # e.g., "LOGIN", "GENERATE_REPORT"
    entity_type = Column(String(50), nullable=True)                  # e.g., "field", "report"
    entity_id = Column(String(100), nullable=True)                   # ID of affected entity
    details = Column(Text, nullable=True)                            # Additional context (JSON)
    ip_address = Column(String(45), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<AuditLog(id={self.id}, action='{self.action}')>"

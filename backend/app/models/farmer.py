"""
Farmer Model
=============
Farmer profile linked to a user account.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Farmer(Base):
    """
    Farmer profile information.
    Linked to a User via user_id (one-to-one).
    Linked to a Village for location context.
    """
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    name = Column(String(200), nullable=False)
    name_mr = Column(String(200), nullable=True)            # Marathi name
    village_id = Column(Integer, ForeignKey("villages.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="farmer")
    village = relationship("Village")
    field_ownerships = relationship("FieldOwner", back_populates="farmer", lazy="dynamic")

    def __repr__(self):
        return f"<Farmer(id={self.id}, name='{self.name}')>"

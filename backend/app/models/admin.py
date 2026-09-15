"""
Administrative Hierarchy Models
================================
State → District → Taluka → Village

Supports future expansion to multiple states/districts.
Do not hard-code hierarchy — fetch from database.
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class State(Base):
    """Indian state (e.g., Maharashtra)."""
    __tablename__ = "states"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)
    name_mr = Column(String(100), nullable=True)            # Marathi name
    code = Column(String(10), nullable=True, unique=True)    # State code (e.g., MH)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    districts = relationship("District", back_populates="state", lazy="dynamic")

    def __repr__(self):
        return f"<State(id={self.id}, name='{self.name}')>"


class District(Base):
    """District within a state (e.g., Pune)."""
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    state_id = Column(Integer, ForeignKey("states.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    name_mr = Column(String(100), nullable=True)
    code = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    state = relationship("State", back_populates="districts")
    talukas = relationship("Taluka", back_populates="district", lazy="dynamic")

    def __repr__(self):
        return f"<District(id={self.id}, name='{self.name}')>"


class Taluka(Base):
    """Taluka within a district (e.g., Baramati)."""
    __tablename__ = "talukas"

    id = Column(Integer, primary_key=True, autoincrement=True)
    district_id = Column(Integer, ForeignKey("districts.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    name_mr = Column(String(100), nullable=True)
    code = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    district = relationship("District", back_populates="talukas")
    villages = relationship("Village", back_populates="taluka", lazy="dynamic")

    def __repr__(self):
        return f"<Taluka(id={self.id}, name='{self.name}')>"


class Village(Base):
    """Village within a taluka (e.g., Malegaon)."""
    __tablename__ = "villages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    taluka_id = Column(Integer, ForeignKey("talukas.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    name_mr = Column(String(100), nullable=True)
    census_code = Column(String(20), nullable=True)         # Census village code
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    taluka = relationship("Taluka", back_populates="villages")
    fields = relationship("Field", back_populates="village", lazy="dynamic")

    def __repr__(self):
        return f"<Village(id={self.id}, name='{self.name}')>"

"""
Field & FieldOwner Models
==========================
Agricultural fields with PostGIS geometry (SRID:4326).

Key constraints:
- (village_id, gat_no) UNIQUE — Gat is village-scoped, never globally unique
- (farmer_id, field_id) UNIQUE in field_owners — no duplicate ownership records
- PostGIS geometry with GIST spatial index
- Both area_reported_ha and area_calculated_ha stored
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, UniqueConstraint, Index, func
from geoalchemy2 import Geometry
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class Field(Base):
    """
    Agricultural field identified by Gat/Survey Number within a village.

    Geometry is stored as PostGIS Polygon/MultiPolygon in EPSG:4326.
    Area is stored both as reported (from source data) and calculated (from geometry).
    """
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, autoincrement=True)
    village_id = Column(Integer, ForeignKey("villages.id", ondelete="CASCADE"), nullable=False)
    gat_no = Column(String(50), nullable=False, index=True)

    # Area: do not blindly trust uploaded values
    area_reported_ha = Column(Float, nullable=True)          # Area from source data
    area_calculated_ha = Column(Float, nullable=True)        # Area calculated from PostGIS geometry

    # PostGIS geometry — SRID:4326 (WGS84), supports Polygon and MultiPolygon
    geometry = Column(
        Geometry(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True),
        nullable=True
    )

    # Demo data flag — demo geometry must never look like official cadastral data
    is_demo = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Constraints: Gat number is unique within a village, not globally
    __table_args__ = (
        UniqueConstraint("village_id", "gat_no", name="uq_field_village_gat"),
        Index("ix_field_geometry", "geometry", postgresql_using="gist"),
    )

    # Relationships
    village = relationship("Village", back_populates="fields")
    owners = relationship("FieldOwner", back_populates="field", lazy="dynamic")
    soil_samples = relationship("SoilSample", back_populates="field", lazy="dynamic")
    reports = relationship("Report", back_populates="field", lazy="dynamic")

    def __repr__(self):
        return f"<Field(id={self.id}, gat_no='{self.gat_no}', village_id={self.village_id})>"


class FieldOwner(Base):
    """
    Many-to-many relationship between farmers and fields.

    This is the AUTHORIZATION TABLE:
    A farmer can ONLY access fields they own/are authorized for.
    Backend must check this table before returning field data.

    Constraint: (farmer_id, field_id) is UNIQUE — no duplicate ownership.
    """
    __tablename__ = "field_owners"

    id = Column(Integer, primary_key=True, autoincrement=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    field_id = Column(Integer, ForeignKey("fields.id", ondelete="CASCADE"), nullable=False)
    is_primary = Column(Boolean, default=True)               # Primary owner flag
    authorized_at = Column(DateTime(timezone=True), server_default=func.now())

    # Constraint: each farmer-field pair is unique
    __table_args__ = (
        UniqueConstraint("farmer_id", "field_id", name="uq_field_owner"),
    )

    # Relationships
    farmer = relationship("Farmer", back_populates="field_ownerships")
    field = relationship("Field", back_populates="owners")

    def __repr__(self):
        return f"<FieldOwner(farmer_id={self.farmer_id}, field_id={self.field_id})>"

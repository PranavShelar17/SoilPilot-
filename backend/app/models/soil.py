"""
Soil Models
===========
Soil parameters, samples, observations, and classification rules.

Key design decisions:
1. soil_samples = PHYSICAL sampling events only (LAB_OBSERVATION, IMPORTED_DATA)
   DSM_PREDICTION does NOT create virtual soil_samples records.
2. soil_observations = measured/imported values per parameter per sample
3. dataset_id is a proper FK to dataset_registry.id
4. Unit handling includes original_unit and original_value for conversions
5. soil_parameters.name is UNIQUE — database-driven parameter definitions
6. Classification rules are configurable — never invent thresholds
"""

import enum
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey,
    DateTime, Enum, UniqueConstraint, func, Text
)
from geoalchemy2 import Geometry
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class DataSourceEnum(str, enum.Enum):
    """
    Source of soil data.
    LAB_OBSERVATION = Physical lab analysis of a soil sample
    IMPORTED_DATA = Imported from external dataset (CSV/Excel)
    """
    LAB_OBSERVATION = "LAB_OBSERVATION"
    IMPORTED_DATA = "IMPORTED_DATA"


class SoilParameter(Base):
    """
    Definition of a soil parameter (e.g., pH, EC, Organic Carbon).

    Database-driven: parameters are NOT hard-coded.
    New parameters can be added without code changes.
    """
    __tablename__ = "soil_parameters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False, unique=True)          # e.g., "pH", "Organic Carbon"
    name_mr = Column(String(100), nullable=True)                     # Marathi name
    unit = Column(String(30), nullable=True)                         # e.g., "dS/m", "kg/ha", "%"
    category = Column(String(50), nullable=True)                     # "primary", "secondary", "physical"
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0)                       # UI display ordering
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    observations = relationship("SoilObservation", back_populates="parameter", lazy="dynamic")
    classification_rules = relationship("SoilClassificationRule", back_populates="parameter", lazy="dynamic")

    def __repr__(self):
        return f"<SoilParameter(id={self.id}, name='{self.name}', unit='{self.unit}')>"


class SoilSample(Base):
    """
    A PHYSICAL soil sampling event.

    IMPORTANT: This table represents REAL physical samples only.
    DSM predictions do NOT create records here.
    DSM predictions are served through the DSM/raster architecture.

    data_source must be LAB_OBSERVATION or IMPORTED_DATA (never DSM_PREDICTION).
    """
    __tablename__ = "soil_samples"

    id = Column(Integer, primary_key=True, autoincrement=True)
    field_id = Column(Integer, ForeignKey("fields.id", ondelete="CASCADE"), nullable=False, index=True)

    # Sampling information
    sample_date = Column(DateTime(timezone=True), nullable=True)
    depth_from_cm = Column(Float, nullable=True, default=0)          # V1 primary: 0
    depth_to_cm = Column(Float, nullable=True, default=30)           # V1 primary: 30
    location = Column(
        Geometry(geometry_type="POINT", srid=4326),
        nullable=True                                                # Sampling location point
    )

    # Data source — physical samples only, NOT DSM_PREDICTION
    data_source = Column(
        Enum(DataSourceEnum, name="sample_data_source_enum"),
        nullable=False,
        default=DataSourceEnum.IMPORTED_DATA
    )

    # Dataset lineage — proper FK to dataset_registry
    dataset_id = Column(Integer, ForeignKey("dataset_registry.id", ondelete="SET NULL"), nullable=True)

    # Physical sample metadata
    sample_method = Column(String(100), nullable=True)               # e.g., "Auger", "Core"
    lab_name = Column(String(200), nullable=True)                    # Laboratory name
    lab_report_no = Column(String(100), nullable=True)               # Lab report number

    # Demo flag
    is_demo = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    field = relationship("Field", back_populates="soil_samples")
    observations = relationship("SoilObservation", back_populates="sample", lazy="dynamic")
    dataset = relationship("DatasetRegistry", back_populates="soil_samples")

    def __repr__(self):
        return f"<SoilSample(id={self.id}, field_id={self.field_id}, date={self.sample_date})>"


class SoilObservation(Base):
    """
    Individual soil measurement/observation value.

    Each observation records a single parameter value for a soil sample.
    Includes unit handling with original unit/value for conversions.

    data_source here tracks whether this specific value came from
    lab analysis or was imported from an external source.
    """
    __tablename__ = "soil_observations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sample_id = Column(Integer, ForeignKey("soil_samples.id", ondelete="CASCADE"), nullable=False, index=True)
    parameter_id = Column(Integer, ForeignKey("soil_parameters.id", ondelete="CASCADE"), nullable=False, index=True)

    # Measured value (in standard unit defined by soil_parameters.unit)
    value = Column(Float, nullable=True)
    unit = Column(String(30), nullable=True)                         # Standard unit

    # Original value before any conversion
    original_value = Column(Float, nullable=True)
    original_unit = Column(String(30), nullable=True)

    # Data source for this observation
    data_source = Column(
        Enum(DataSourceEnum, name="obs_data_source_enum", create_type=False),
        nullable=True
    )

    # Dataset lineage — proper FK
    dataset_id = Column(Integer, ForeignKey("dataset_registry.id", ondelete="SET NULL"), nullable=True)
    dataset_version = Column(String(50), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sample = relationship("SoilSample", back_populates="observations")
    parameter = relationship("SoilParameter", back_populates="observations")

    def __repr__(self):
        return f"<SoilObservation(id={self.id}, param_id={self.parameter_id}, value={self.value})>"


class SoilClassificationRule(Base):
    """
    Configurable classification rule for soil parameters.

    IMPORTANT: Do NOT invent scientific thresholds.
    If no validated rule exists for a parameter, the system must display:
    "Not classified / Rule not configured"

    Rules can have different standards and versions.
    """
    __tablename__ = "soil_classification_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    parameter_id = Column(Integer, ForeignKey("soil_parameters.id", ondelete="CASCADE"), nullable=False)

    min_value = Column(Float, nullable=True)                         # Lower bound (inclusive)
    max_value = Column(Float, nullable=True)                         # Upper bound (exclusive)
    status = Column(String(50), nullable=False)                      # "Low", "Medium", "High", "Good", etc.
    status_mr = Column(String(50), nullable=True)                    # Marathi status
    interpretation = Column(Text, nullable=True)                     # Explanation text
    interpretation_mr = Column(Text, nullable=True)                  # Marathi explanation

    # Standard & versioning
    standard = Column(String(100), nullable=True)                    # e.g., "ICAR", "Maharashtra Soil Testing"
    version = Column(String(20), nullable=True)                      # Standard version
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    parameter = relationship("SoilParameter", back_populates="classification_rules")

    def __repr__(self):
        return f"<SoilClassificationRule(param_id={self.parameter_id}, status='{self.status}')>"

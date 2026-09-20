"""
DSM (Digital Soil Mapping) Models
==================================
DSM layer registry and metadata.

Key design:
- DSM layers have a status enum: REGISTERED, PROCESSING, AVAILABLE, DEMO, UNAVAILABLE, ERROR
- (property_name, depth_from_cm, depth_to_cm) is UNIQUE
- DSM predictions are served through raster architecture, NOT as soil_samples
"""

import enum
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey,
    DateTime, Enum, UniqueConstraint, Text, func
)
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class DSMLayerStatusEnum(str, enum.Enum):
    """Status of a DSM raster layer."""
    REGISTERED = "REGISTERED"       # Metadata registered, file not yet processed
    PROCESSING = "PROCESSING"       # Being processed/converted
    AVAILABLE = "AVAILABLE"         # Ready for serving
    DEMO = "DEMO"                   # Demo/placeholder layer
    UNAVAILABLE = "UNAVAILABLE"     # Not available yet
    ERROR = "ERROR"                 # Processing error


class DSMLayer(Base):
    """
    Registry of DSM raster layers.

    Each layer represents a predicted soil property at a specific depth.
    Actual raster files (GeoTIFF/COG) are referenced by file_path.

    If actual DSM data is unavailable, status = UNAVAILABLE and
    the UI shows a clear "DSM data not yet available" state.
    """
    __tablename__ = "dsm_layers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    property_name = Column(String(100), nullable=False)              # e.g., "pH", "Organic Carbon"
    property_name_mr = Column(String(100), nullable=True)            # Marathi name
    depth_from_cm = Column(Float, nullable=False, default=0)
    depth_to_cm = Column(Float, nullable=False, default=30)
    unit = Column(String(30), nullable=True)
    file_path = Column(String(500), nullable=True)                   # Path to GeoTIFF/COG
    status = Column(
        Enum(DSMLayerStatusEnum, name="dsm_layer_status_enum"),
        nullable=False,
        default=DSMLayerStatusEnum.UNAVAILABLE
    )
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Constraint: unique combination of property + depth
    __table_args__ = (
        UniqueConstraint("property_name", "depth_from_cm", "depth_to_cm", name="uq_dsm_layer_property_depth"),
    )

    # Relationships
    metadata_record = relationship("DSMLayerMetadata", back_populates="layer", uselist=False)

    def __repr__(self):
        return f"<DSMLayer(id={self.id}, property='{self.property_name}', status='{self.status}')>"


class DSMLayerMetadata(Base):
    """
    Extended metadata for a DSM layer.

    Includes model information, resolution, uncertainty, and validation stats.
    This metadata is informational and helps users understand the DSM prediction.
    """
    __tablename__ = "dsm_layer_metadata"

    id = Column(Integer, primary_key=True, autoincrement=True)
    layer_id = Column(Integer, ForeignKey("dsm_layers.id", ondelete="CASCADE"), nullable=False, unique=True)

    # Spatial information
    resolution_m = Column(Float, nullable=True)                      # Spatial resolution in meters
    crs = Column(String(20), nullable=True)                          # e.g., "EPSG:4326"
    extent_wkt = Column(Text, nullable=True)                         # Bounding box as WKT

    # Model information
    model_name = Column(String(200), nullable=True)                  # Prediction model name
    model_version = Column(String(50), nullable=True)
    prediction_method = Column(String(200), nullable=True)           # e.g., "Random Forest", "Kriging"

    # Quality metrics
    uncertainty = Column(Float, nullable=True)                       # Prediction uncertainty (RMSE, etc.)
    validation_r2 = Column(Float, nullable=True)                     # R² validation score
    validation_rmse = Column(Float, nullable=True)                   # RMSE
    validation_stats = Column(Text, nullable=True)                   # JSON string of full stats

    # Source information
    source_agency = Column(String(200), nullable=True)
    source_date = Column(DateTime(timezone=True), nullable=True)
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    layer = relationship("DSMLayer", back_populates="metadata_record")

    def __repr__(self):
        return f"<DSMLayerMetadata(layer_id={self.layer_id})>"

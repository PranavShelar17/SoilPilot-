"""
Dataset Registry Model
======================
Dataset lineage tracking for imported data.

Tracks: source, source_file, source_agency, dataset_version,
processing_version, import_date, status, record_count, notes.

soil_samples.dataset_id and soil_observations.dataset_id
are proper FKs referencing this table.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, func
from sqlalchemy.orm import relationship

from backend.app.db.database import Base


class DatasetRegistry(Base):
    """
    Registry of imported datasets for data lineage tracking.

    Every imported dataset (CSV, Excel, KML, GeoJSON, etc.) should
    be registered here with full provenance metadata.
    """
    __tablename__ = "dataset_registry"

    id = Column(Integer, primary_key=True, autoincrement=True)

    # Source information
    source = Column(String(200), nullable=False)                     # e.g., "Lab Report", "Government Survey"
    source_file = Column(String(500), nullable=True)                 # Original filename
    source_agency = Column(String(200), nullable=True)               # e.g., "Maharashtra Soil Testing Lab"

    # Versioning
    dataset_version = Column(String(50), nullable=True)              # Dataset version
    processing_version = Column(String(50), nullable=True)           # Processing/import script version

    # Import metadata
    import_date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="imported")                  # imported, validated, rejected
    record_count = Column(Integer, nullable=True)                    # Number of records in dataset

    # Notes
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships — soil_samples reference this via dataset_id FK
    soil_samples = relationship("SoilSample", back_populates="dataset", lazy="dynamic")

    def __repr__(self):
        return f"<DatasetRegistry(id={self.id}, source='{self.source}')>"

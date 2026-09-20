"""
Models Package
==============
Import all models here so Alembic can discover them for migrations.
"""

from backend.app.models.admin import State, District, Taluka, Village
from backend.app.models.user import User, OTPRecord
from backend.app.models.farmer import Farmer
from backend.app.models.field import Field, FieldOwner
from backend.app.models.soil import SoilParameter, SoilSample, SoilObservation, SoilClassificationRule
from backend.app.models.dsm import DSMLayer, DSMLayerMetadata
from backend.app.models.report import Report, AuditLog
from backend.app.models.dataset import DatasetRegistry

__all__ = [
    "State", "District", "Taluka", "Village",
    "User", "OTPRecord",
    "Farmer",
    "Field", "FieldOwner",
    "SoilParameter", "SoilSample", "SoilObservation", "SoilClassificationRule",
    "DSMLayer", "DSMLayerMetadata",
    "Report", "AuditLog",
    "DatasetRegistry",
]

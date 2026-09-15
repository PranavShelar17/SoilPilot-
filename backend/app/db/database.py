"""
Database Engine & Base
======================
SQLAlchemy engine, session factory, and declarative base.
PostGIS support enabled via GeoAlchemy2.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from backend.app.core.config import settings


# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,       # Test connections before use
    echo=False,               # Set True to log all SQL (noisy)
)

# Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


class Base(DeclarativeBase):
    """
    Declarative base for all SQLAlchemy models.
    All models inherit from this class.
    """
    pass

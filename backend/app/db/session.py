"""
Database Session Dependency
===========================
FastAPI dependency that provides a database session per request.
Automatically closes the session when the request completes.
"""

from typing import Generator
from sqlalchemy.orm import Session

from backend.app.db.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Yield a database session for the duration of a request.

    Usage in FastAPI routes:
        @router.get("/example")
        def example(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

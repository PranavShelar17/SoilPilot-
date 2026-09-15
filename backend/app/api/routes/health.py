"""Health check endpoint."""
from fastapi import APIRouter
from backend.app.core.config import settings

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "demo_mode": settings.DEMO_MODE,
    }

"""
DSM Soil Health Portal — FastAPI Application
=============================================
Main entry point. Assembles middleware, routes, and startup hooks.

Usage:
    uvicorn backend.app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from backend.app.core.config import settings
from backend.app.core.logging import setup_logging, get_logger

# ── Logging ──────────────────────────────────────────────────────
setup_logging(level="DEBUG" if settings.is_development else "INFO")
logger = get_logger(__name__)

# ── FastAPI App ──────────────────────────────────────────────────
app = FastAPI(
    title="DSM Soil Health Portal",
    description="Digital Soil Mapping & Soil Health Card Platform API",
    version="1.0.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# ── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ──────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    """Run startup checks and validations."""
    logger.info("=" * 60)
    logger.info("  DSM Soil Health Portal — Starting")
    logger.info(f"  Environment: {settings.APP_ENV}")
    logger.info(f"  Demo Mode:   {settings.DEMO_MODE}")
    logger.info("=" * 60)

    # Reject insecure defaults in production
    settings.validate_production_security()

    # Ensure storage directories exist
    os.makedirs(settings.STORAGE_PATH, exist_ok=True)
    os.makedirs(settings.REPORTS_PATH, exist_ok=True)

    logger.info("Startup complete.")


# ── Route Registration ───────────────────────────────────────────
from backend.app.api.routes import health, auth, fields, soil, dsm  # noqa: E402
from backend.app.api.routes import reports  # noqa: E402

# Health check (no prefix)
app.include_router(health.router, tags=["Health"])

# API v1 routes
API_PREFIX = "/api/v1"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(fields.router, prefix=API_PREFIX)
app.include_router(soil.router, prefix=API_PREFIX)
app.include_router(dsm.router, prefix=API_PREFIX)
app.include_router(reports.router, prefix=API_PREFIX)


# ── Root ─────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "name": "DSM Soil Health Portal",
        "version": "1.0.0",
        "docs": "/docs" if settings.is_development else None,
        "health": "/health",
    }

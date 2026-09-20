"""
Application Configuration
========================
Loads all settings from environment variables using Pydantic Settings.
Enforces production security rules.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Never hard-code secrets here — use .env file or system env vars.
    """

    # ── Application ──────────────────────────────────────────────
    APP_ENV: str = "development"
    PUBLIC_APP_URL: str = "http://localhost:5173"
    DEMO_MODE: bool = True

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/dsm_soil_health"

    # ── JWT Authentication ───────────────────────────────────────
    JWT_SECRET: str = "change-this-to-a-secure-random-string-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_HOURS: int = 24

    # ── OTP Configuration ────────────────────────────────────────
    OTP_PROVIDER: str = "mock"
    OTP_EXPIRY_SECONDS: int = 300       # 5 minutes
    OTP_MAX_ATTEMPTS: int = 3
    OTP_COOLDOWN_SECONDS: int = 60      # 1 minute between requests

    # ── Storage ──────────────────────────────────────────────────
    STORAGE_PATH: str = "./storage"
    REPORTS_PATH: str = "./storage/reports"

    # ── CORS ─────────────────────────────────────────────────────
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins_list(self) -> List[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def is_development(self) -> bool:
        return self.APP_ENV == "development"

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    def validate_production_security(self) -> None:
        """
        Reject obviously insecure defaults in production mode.
        This must be called during application startup.
        """
        if not self.is_production:
            return

        # Reject default JWT secret in production
        insecure_secrets = [
            "change-this-to-a-secure-random-string-in-production",
            "secret",
            "jwt-secret",
            "",
        ]
        if self.JWT_SECRET in insecure_secrets or len(self.JWT_SECRET) < 32:
            raise ValueError(
                "SECURITY ERROR: JWT_SECRET must be a securely generated "
                "string of at least 32 characters in production mode. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
            )

        # Reject demo database credentials in production
        if "postgres:postgres@" in self.DATABASE_URL:
            raise ValueError(
                "SECURITY ERROR: Default database credentials detected in production. "
                "Set a strong POSTGRES_PASSWORD in your .env file."
            )

        # Reject mock OTP provider in production
        if self.OTP_PROVIDER == "mock":
            raise ValueError(
                "SECURITY ERROR: OTP_PROVIDER=mock is not allowed in production. "
                "Configure a real SMS provider (msg91, twilio, firebase, aws_sns)."
            )

        # Reject DEMO_MODE in production
        if self.DEMO_MODE:
            raise ValueError(
                "SECURITY ERROR: DEMO_MODE must be false in production."
            )

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


# Singleton settings instance
settings = Settings()

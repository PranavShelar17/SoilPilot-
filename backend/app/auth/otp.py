"""
OTP Service
============
Mock OTP for development, provider abstraction for production.

Security:
- 5-minute expiry
- Max 3 verification attempts
- 60-second cooldown between requests
- Dev OTP 123456 ONLY when APP_ENV=development
- OTP invalidated after successful verification
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.logging import get_logger
from backend.app.models.user import User, OTPRecord

logger = get_logger(__name__)


def generate_otp() -> str:
    """Generate a 6-digit OTP. In dev mode, always returns 123456."""
    if settings.is_development and settings.OTP_PROVIDER == "mock":
        return "123456"
    return str(secrets.randbelow(900000) + 100000)


def hash_otp(otp: str) -> str:
    """Hash OTP for storage. Never store plaintext OTP."""
    return hashlib.sha256(otp.encode()).hexdigest()


def send_otp(mobile: str, otp: str) -> bool:
    """
    Send OTP via configured provider.
    V1: Mock provider (dev only). Production: MSG91/Twilio/Firebase/AWS SNS.
    """
    if settings.OTP_PROVIDER == "mock":
        logger.info(f"[MOCK OTP] Mobile: {mobile}, OTP: {otp}")
        return True

    # Future: implement real SMS providers here
    # if settings.OTP_PROVIDER == "twilio": ...
    # if settings.OTP_PROVIDER == "msg91": ...

    logger.error(f"Unknown OTP provider: {settings.OTP_PROVIDER}")
    return False


def request_otp(mobile: str, db: Session) -> dict:
    """
    Request OTP for a mobile number.
    Creates user if not exists, enforces cooldown.
    """
    # Find or create user
    user = db.query(User).filter(User.mobile == mobile).first()
    if not user:
        user = User(mobile=mobile, role="farmer")
        db.add(user)
        db.flush()

    # Check cooldown — prevent rapid requests
    now = datetime.now(timezone.utc)
    recent_otp = db.query(OTPRecord).filter(
        OTPRecord.user_id == user.id,
        OTPRecord.created_at > now - timedelta(seconds=settings.OTP_COOLDOWN_SECONDS),
    ).first()

    if recent_otp:
        wait_seconds = settings.OTP_COOLDOWN_SECONDS
        return {
            "success": False,
            "message": f"Please wait {wait_seconds} seconds before requesting another OTP.",
        }

    # Generate and store OTP
    otp = generate_otp()
    otp_record = OTPRecord(
        user_id=user.id,
        otp_hash=hash_otp(otp),
        expires_at=now + timedelta(seconds=settings.OTP_EXPIRY_SECONDS),
        attempts=0,
        is_used=False,
    )
    db.add(otp_record)
    db.commit()

    # Send OTP
    sent = send_otp(mobile, otp)
    if not sent:
        return {"success": False, "message": "Failed to send OTP. Please try again."}

    return {"success": True, "message": "OTP sent successfully."}


def verify_otp(mobile: str, otp: str, db: Session) -> Optional[User]:
    """
    Verify OTP and return user if valid.
    Enforces: expiry, max attempts, single use.
    """
    user = db.query(User).filter(User.mobile == mobile).first()
    if not user:
        return None

    now = datetime.now(timezone.utc)

    # Find the latest unused, non-expired OTP
    otp_record = db.query(OTPRecord).filter(
        OTPRecord.user_id == user.id,
        OTPRecord.is_used == False,  # noqa: E712
        OTPRecord.expires_at > now,
    ).order_by(OTPRecord.created_at.desc()).first()

    if not otp_record:
        return None

    # Check max attempts
    if otp_record.attempts >= settings.OTP_MAX_ATTEMPTS:
        return None

    # Increment attempt count
    otp_record.attempts += 1

    # Verify OTP hash
    if otp_record.otp_hash != hash_otp(otp):
        db.commit()
        return None

    # Success — invalidate OTP
    otp_record.is_used = True
    db.commit()

    return user

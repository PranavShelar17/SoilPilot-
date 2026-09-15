"""
JWT Security Utilities
======================
Token creation, verification, and password hashing.
"""

import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any

from backend.app.core.config import settings


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Payload data (must include 'sub' with user ID)
        expires_delta: Custom expiry duration (defaults to JWT_EXPIRY_HOURS)

    Returns:
        Encoded JWT string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS)

    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})

    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def verify_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT access token.

    Returns:
        Decoded payload dict, or None if invalid/expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

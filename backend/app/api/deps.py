"""
API Dependencies
=================
Common FastAPI dependencies for authentication and authorization.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.core.security import verify_access_token
from backend.app.models.user import User
from backend.app.models.farmer import Farmer
from backend.app.models.field import FieldOwner

# Bearer token security scheme
security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract and validate the current user from JWT token.
    Returns 401 if token is invalid or expired.
    """
    token = credentials.credentials
    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please login again.",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or inactive.",
        )

    return user


def get_current_farmer(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Farmer:
    """
    Get the farmer profile for the current authenticated user.
    """
    farmer = db.query(Farmer).filter(Farmer.user_id == user.id).first()
    if farmer is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farmer profile not found.",
        )
    return farmer


def verify_field_ownership(farmer_id: int, field_id: int, db: Session) -> bool:
    """
    Verify that a farmer is authorized to access a specific field.

    CRITICAL AUTHORIZATION CHECK:
    A farmer must NEVER access another farmer's field
    by changing URL, field ID, or Gat number.
    """
    ownership = db.query(FieldOwner).filter(
        FieldOwner.farmer_id == farmer_id,
        FieldOwner.field_id == field_id,
    ).first()
    return ownership is not None

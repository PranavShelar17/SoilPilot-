"""Authentication API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.schemas.auth import OTPRequest, OTPVerify, TokenResponse, UserResponse
from backend.app.schemas.common import MessageResponse
from backend.app.auth.otp import request_otp, verify_otp
from backend.app.core.security import create_access_token
from backend.app.api.deps import get_current_user
from backend.app.models.user import User
from backend.app.models.farmer import Farmer

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/request-otp", response_model=MessageResponse)
def api_request_otp(body: OTPRequest, db: Session = Depends(get_db)):
    """Request OTP for mobile number login."""
    result = request_otp(body.mobile, db)
    if not result["success"]:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=result["message"])
    return MessageResponse(message=result["message"])


@router.post("/verify-otp", response_model=TokenResponse)
def api_verify_otp(body: OTPVerify, db: Session = Depends(get_db)):
    """Verify OTP and return JWT token."""
    user = verify_otp(body.mobile, body.otp, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP. Please try again.",
        )

    farmer = db.query(Farmer).filter(Farmer.user_id == user.id).first()
    token = create_access_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=token,
        farmer_name=farmer.name if farmer else None,
    )


@router.get("/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get current authenticated user info."""
    farmer = db.query(Farmer).filter(Farmer.user_id == user.id).first()

    village = farmer.village if farmer else None
    taluka = village.taluka if village else None
    district = taluka.district if taluka else None
    state_obj = district.state if district else None

    return UserResponse(
        id=user.id,
        mobile=user.mobile,
        role=user.role,
        farmer_name=farmer.name if farmer else None,
        farmer_name_mr=farmer.name_mr if farmer else None,
        village=village.name if village else None,
        village_mr=village.name_mr if village else None,
        taluka=taluka.name if taluka else None,
        district=district.name if district else None,
        state=state_obj.name if state_obj else None,
    )


@router.post("/logout", response_model=MessageResponse)
def logout(user: User = Depends(get_current_user)):
    """
    Logout — V1: Client-side session clear.
    Future: Server-side token revocation/blacklist.
    """
    return MessageResponse(message="Logged out successfully.")

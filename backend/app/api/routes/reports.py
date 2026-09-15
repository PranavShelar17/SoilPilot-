"""Reports API routes."""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.api.deps import get_current_farmer
from backend.app.models.farmer import Farmer
from backend.app.schemas.report import ReportCreateRequest
from backend.app.services.report_service import (
    create_report, get_farmer_reports, get_report_pdf_path, get_public_report,
)

router = APIRouter(prefix="/reports", tags=["Reports"])


@router.post("")
def generate_report(
    body: ReportCreateRequest,
    farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Generate a new report (creates PDF)."""
    result = create_report(body.field_id, farmer.id, body.report_type, db)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This field is not associated with your account.",
        )
    return result


@router.get("")
def list_reports(
    farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """List all reports for the current farmer."""
    reports = get_farmer_reports(farmer.id, db)
    return {"reports": reports}


@router.get("/{report_id}/pdf")
def download_report_pdf(
    report_id: str,
    farmer: Farmer = Depends(get_current_farmer),
    db: Session = Depends(get_db),
):
    """Download report PDF with authorization check."""
    pdf_path = get_report_pdf_path(report_id, farmer.id, db)
    if not pdf_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report PDF not found.",
        )
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"soil_health_report_{report_id[:8]}.pdf",
    )


@router.get("/verify/{public_token}")
def verify_report(public_token: str, db: Session = Depends(get_db)):
    """
    Public report verification — NO authentication required.
    Used for QR code verification.
    CRITICAL: No sensitive farmer information exposed.
    """
    report = get_public_report(public_token, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found.",
        )
    return report

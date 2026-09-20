"""
Report Service
===============
Report creation, PDF generation with QR codes, and report retrieval.

Key design:
- PDF generated via ReportLab
- QR code links to {PUBLIC_APP_URL}/report/{public_token}
- Public report endpoint never exposes sensitive farmer info
"""

import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from io import BytesIO

from sqlalchemy.orm import Session
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph,
    Spacer, Image as RLImage, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import qrcode

from backend.app.core.config import settings
from backend.app.core.logging import get_logger
from backend.app.models.report import Report
from backend.app.models.field import Field, FieldOwner
from backend.app.models.farmer import Farmer
from backend.app.models.admin import Village, Taluka, District, State
from backend.app.models.soil import SoilSample, SoilObservation, SoilParameter
from backend.app.services.soil_service import _classify_value

logger = get_logger(__name__)


def create_report(field_id: int, farmer_id: int, report_type: str, db: Session) -> Optional[dict]:
    """
    Create a new report and generate PDF.

    Steps:
    1. Verify farmer owns the field
    2. Create Report record with public_token
    3. Generate PDF with soil data + QR code
    4. Return report metadata
    """
    # Authorization check
    ownership = db.query(FieldOwner).filter(
        FieldOwner.farmer_id == farmer_id,
        FieldOwner.field_id == field_id,
    ).first()
    if not ownership:
        return None

    # Create report record
    public_token = uuid.uuid4()
    report = Report(
        field_id=field_id,
        farmer_id=farmer_id,
        report_type=report_type,
        public_token=public_token,
    )
    db.add(report)
    db.flush()

    # Generate PDF
    try:
        pdf_path = _generate_pdf(report, db)
        report.pdf_path = pdf_path
        db.commit()
    except Exception as e:
        logger.error(f"PDF generation failed: {e}")
        db.commit()  # Still save the report record

    field = db.query(Field).filter(Field.id == field_id).first()

    return {
        "id": str(report.id),
        "field_id": field_id,
        "gat_no": field.gat_no if field else None,
        "report_type": report.report_type,
        "public_token": str(report.public_token),
        "report_version": report.report_version,
        "created_at": report.created_at or datetime.now(timezone.utc),
        "has_pdf": report.pdf_path is not None,
    }


def get_farmer_reports(farmer_id: int, db: Session) -> List[dict]:
    """Get all reports for a farmer."""
    reports = db.query(Report).filter(
        Report.farmer_id == farmer_id
    ).order_by(Report.created_at.desc()).all()

    result = []
    for report in reports:
        field = db.query(Field).filter(Field.id == report.field_id).first()
        result.append({
            "id": str(report.id),
            "field_id": report.field_id,
            "gat_no": field.gat_no if field else None,
            "report_type": report.report_type,
            "public_token": str(report.public_token),
            "report_version": report.report_version,
            "created_at": report.created_at,
            "has_pdf": report.pdf_path is not None,
        })
    return result


def get_report_pdf_path(report_id: str, farmer_id: int, db: Session) -> Optional[str]:
    """Get PDF file path for a report with authorization check."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report or report.farmer_id != farmer_id:
        return None
    if not report.pdf_path or not os.path.exists(report.pdf_path):
        return None
    return report.pdf_path


def get_public_report(public_token: str, db: Session) -> Optional[dict]:
    """
    Get report data by public_token for QR verification.
    CRITICAL: No sensitive farmer information exposed.
    """
    try:
        token_uuid = uuid.UUID(public_token)
    except ValueError:
        return None

    report = db.query(Report).filter(Report.public_token == token_uuid).first()
    if not report:
        return None

    field = db.query(Field).filter(Field.id == report.field_id).first()
    village = db.query(Village).filter(Village.id == field.village_id).first() if field else None
    taluka = db.query(Taluka).filter(Taluka.id == village.taluka_id).first() if village else None
    district = db.query(District).filter(District.id == taluka.district_id).first() if taluka else None

    # Get soil data
    soil_params = []
    latest_sample = db.query(SoilSample).filter(
        SoilSample.field_id == report.field_id
    ).order_by(SoilSample.sample_date.desc()).first()

    if latest_sample:
        observations = db.query(SoilObservation).filter(
            SoilObservation.sample_id == latest_sample.id
        ).all()
        for obs in observations:
            param = db.query(SoilParameter).filter(SoilParameter.id == obs.parameter_id).first()
            if param:
                status, status_mr, interpretation = _classify_value(param.id, obs.value, db)
                soil_params.append({
                    "name": param.name,
                    "value": obs.value,
                    "unit": obs.unit or param.unit,
                    "status": status,
                })

    return {
        "report_id": str(report.id)[:8],  # Shortened for display
        "report_type": report.report_type,
        "report_version": report.report_version,
        "created_at": report.created_at,
        "village": village.name if village else None,
        "gat_no": field.gat_no if field else None,
        "taluka": taluka.name if taluka else None,
        "district": district.name if district else None,
        "is_demo": field.is_demo if field else False,
        "soil_parameters": soil_params,
        "verified": True,
    }


def _generate_pdf(report: Report, db: Session) -> str:
    """Generate a Soil Health Card PDF with QR code."""
    # Ensure reports directory exists
    os.makedirs(settings.REPORTS_PATH, exist_ok=True)

    filename = f"report_{report.public_token}.pdf"
    filepath = os.path.join(settings.REPORTS_PATH, filename)

    # Gather data
    field = db.query(Field).filter(Field.id == report.field_id).first()
    farmer = db.query(Farmer).filter(Farmer.id == report.farmer_id).first()
    village = db.query(Village).filter(Village.id == field.village_id).first() if field else None
    taluka = db.query(Taluka).filter(Taluka.id == village.taluka_id).first() if village else None
    district = db.query(District).filter(District.id == taluka.district_id).first() if taluka else None
    state = db.query(State).filter(State.id == district.state_id).first() if district else None

    latest_sample = db.query(SoilSample).filter(
        SoilSample.field_id == report.field_id
    ).order_by(SoilSample.sample_date.desc()).first()

    # Generate QR code
    qr_url = f"{settings.PUBLIC_APP_URL}/report/{report.public_token}"
    qr_img = qrcode.make(qr_url, box_size=4, border=2)
    qr_buffer = BytesIO()
    qr_img.save(qr_buffer, format="PNG")
    qr_buffer.seek(0)

    # Build PDF
    doc = SimpleDocTemplate(filepath, pagesize=A4, topMargin=1.5*cm, bottomMargin=1.5*cm)
    styles = getSampleStyleSheet()
    story = []

    # Title style
    title_style = ParagraphStyle(
        "ReportTitle", parent=styles["Title"],
        fontSize=16, textColor=colors.HexColor("#2e7d32"),
        spaceAfter=4*mm, alignment=TA_CENTER,
    )
    subtitle_style = ParagraphStyle(
        "Subtitle", parent=styles["Normal"],
        fontSize=10, textColor=colors.grey, alignment=TA_CENTER,
    )
    heading_style = ParagraphStyle(
        "SectionHeading", parent=styles["Heading2"],
        fontSize=12, textColor=colors.HexColor("#1b5e20"),
        spaceBefore=6*mm, spaceAfter=3*mm,
    )

    # Header
    story.append(Paragraph("Soil Health Card / माती आरोग्य कार्ड", title_style))
    story.append(Paragraph("DSM Soil Health Portal — Digital Soil Mapping Platform", subtitle_style))

    if field and field.is_demo:
        demo_style = ParagraphStyle(
            "Demo", parent=styles["Normal"],
            fontSize=9, textColor=colors.HexColor("#b45309"),
            alignment=TA_CENTER, backColor=colors.HexColor("#fef3c7"),
        )
        story.append(Spacer(1, 3*mm))
        story.append(Paragraph("⚠️ DEMO DATA — Not official records", demo_style))

    story.append(Spacer(1, 4*mm))
    story.append(HRFlowable(width="100%", color=colors.HexColor("#2e7d32"), thickness=1))
    story.append(Spacer(1, 4*mm))

    # Farmer & Field Info
    story.append(Paragraph("Farmer & Field Information", heading_style))
    info_data = [
        ["Farmer Name", farmer.name if farmer else "—"],
        ["Gat No.", field.gat_no if field else "—"],
        ["Area (ha)", f"{field.area_reported_ha:.2f}" if field and field.area_reported_ha else "—"],
        ["Village", village.name if village else "—"],
        ["Taluka", taluka.name if taluka else "—"],
        ["District", district.name if district else "—"],
        ["State", state.name if state else "—"],
    ]
    info_table = Table(info_data, colWidths=[5*cm, 12*cm])
    info_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 4*mm))

    # Sampling Info
    if latest_sample:
        story.append(Paragraph("Sampling Information", heading_style))
        sample_data = [
            ["Sampling Date", latest_sample.sample_date.strftime("%d-%m-%Y") if latest_sample.sample_date else "—"],
            ["Depth", f"{int(latest_sample.depth_from_cm or 0)}-{int(latest_sample.depth_to_cm or 30)} cm"],
            ["Data Source", latest_sample.data_source.value if latest_sample.data_source else "—"],
            ["Lab", latest_sample.lab_name or "—"],
        ]
        sample_table = Table(sample_data, colWidths=[5*cm, 12*cm])
        sample_table.setStyle(TableStyle([
            ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(sample_table)
        story.append(Spacer(1, 4*mm))

    # Soil Parameters Table
    story.append(Paragraph("Soil Parameters", heading_style))

    if latest_sample:
        observations = db.query(SoilObservation).filter(
            SoilObservation.sample_id == latest_sample.id
        ).all()

        param_header = ["Parameter", "Value", "Unit", "Status"]
        param_rows = [param_header]

        for obs in observations:
            param = db.query(SoilParameter).filter(SoilParameter.id == obs.parameter_id).first()
            if not param:
                continue
            status, _, _ = _classify_value(param.id, obs.value, db)
            param_rows.append([
                param.name,
                f"{obs.value:.2f}" if obs.value is not None else "—",
                obs.unit or param.unit or "—",
                status or "—",
            ])

        param_table = Table(param_rows, colWidths=[5*cm, 3*cm, 3*cm, 6*cm])
        param_table.setStyle(TableStyle([
            # Header row
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2e7d32")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, 0), 9),
            # Data rows
            ("FONTSIZE", (0, 1), (-1, -1), 8),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f0f9f0")]),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#e0e0e0")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(param_table)
    else:
        story.append(Paragraph("No soil data available for this field.", styles["Normal"]))

    story.append(Spacer(1, 8*mm))

    # QR Code + Verification
    story.append(HRFlowable(width="100%", color=colors.HexColor("#2e7d32"), thickness=1))
    story.append(Spacer(1, 4*mm))

    qr_image = RLImage(qr_buffer, width=3*cm, height=3*cm)
    verification_data = [
        [qr_image, Paragraph(
            f"<b>Report Verification</b><br/>"
            f"<font size=8>Scan QR code or visit:</font><br/>"
            f"<font size=7 color='#2e7d32'>{qr_url}</font><br/>"
            f"<font size=7>Report ID: {str(report.id)[:8]}</font><br/>"
            f"<font size=7>Generated: {datetime.now(timezone.utc).strftime('%d-%m-%Y %H:%M UTC')}</font>",
            styles["Normal"],
        )],
    ]
    verification_table = Table(verification_data, colWidths=[3.5*cm, 13.5*cm])
    verification_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(verification_table)

    # Footer
    story.append(Spacer(1, 4*mm))
    footer_style = ParagraphStyle(
        "Footer", parent=styles["Normal"],
        fontSize=7, textColor=colors.grey, alignment=TA_CENTER,
    )
    story.append(Paragraph(
        "This report was generated by the DSM Soil Health Portal. "
        "For official soil testing, contact your local agricultural office.",
        footer_style,
    ))

    # Build PDF
    doc.build(story)
    logger.info(f"PDF generated: {filepath}")
    return filepath

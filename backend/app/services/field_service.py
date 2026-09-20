"""Field service — business logic with authorization enforcement."""

import json
from typing import Optional, List
from sqlalchemy.orm import Session
from geoalchemy2.shape import to_shape

from backend.app.models.field import Field, FieldOwner
from backend.app.models.admin import Village, Taluka, District
from backend.app.models.soil import SoilSample, SoilObservation
from backend.app.models.farmer import Farmer


def get_farmer_fields(farmer_id: int, db: Session) -> List[dict]:
    """Get all fields authorized for a farmer."""
    ownerships = db.query(FieldOwner).filter(FieldOwner.farmer_id == farmer_id).all()
    result = []
    for ownership in ownerships:
        field = db.query(Field).filter(Field.id == ownership.field_id).first()
        if not field:
            continue
        village = db.query(Village).filter(Village.id == field.village_id).first()
        taluka = db.query(Taluka).filter(Taluka.id == village.taluka_id).first() if village else None
        district = db.query(District).filter(District.id == taluka.district_id).first() if taluka else None

        # Get last soil test date
        last_sample = db.query(SoilSample).filter(
            SoilSample.field_id == field.id
        ).order_by(SoilSample.sample_date.desc()).first()

        result.append({
            "id": field.id,
            "village_id": field.village_id,
            "village_name": village.name if village else None,
            "village_name_mr": village.name_mr if village else None,
            "taluka_name": taluka.name if taluka else None,
            "district_name": district.name if district else None,
            "gat_no": field.gat_no,
            "area_reported_ha": field.area_reported_ha,
            "area_calculated_ha": field.area_calculated_ha,
            "is_demo": field.is_demo,
            "geometry_geojson": _geometry_to_geojson(field.geometry) if field.geometry else None,
            "last_soil_test": last_sample.sample_date.isoformat() if last_sample and last_sample.sample_date else None,
            "soil_health_status": None,  # Not classified without validated rules
        })
    return result


def get_field_by_id(field_id: int, farmer_id: int, db: Session) -> Optional[dict]:
    """Get field by ID with authorization check."""
    # CRITICAL: Verify ownership before returning data
    ownership = db.query(FieldOwner).filter(
        FieldOwner.farmer_id == farmer_id,
        FieldOwner.field_id == field_id,
    ).first()
    if not ownership:
        return None

    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        return None

    village = db.query(Village).filter(Village.id == field.village_id).first()
    taluka = db.query(Taluka).filter(Taluka.id == village.taluka_id).first() if village else None
    district = db.query(District).filter(District.id == taluka.district_id).first() if taluka else None

    return {
        "id": field.id,
        "village_id": field.village_id,
        "village_name": village.name if village else None,
        "village_name_mr": village.name_mr if village else None,
        "taluka_name": taluka.name if taluka else None,
        "district_name": district.name if district else None,
        "gat_no": field.gat_no,
        "area_reported_ha": field.area_reported_ha,
        "area_calculated_ha": field.area_calculated_ha,
        "is_demo": field.is_demo,
        "geometry_geojson": _geometry_to_geojson(field.geometry) if field.geometry else None,
        "soil_health_status": None,
    }


def search_field_by_gat(gat_no: str, village_id: int, farmer_id: int, db: Session) -> Optional[dict]:
    """Search field by Gat number with authorization check."""
    field = db.query(Field).filter(
        Field.gat_no == gat_no,
        Field.village_id == village_id,
    ).first()

    if not field:
        return None

    # CRITICAL AUTHORIZATION: Check farmer owns this field
    ownership = db.query(FieldOwner).filter(
        FieldOwner.farmer_id == farmer_id,
        FieldOwner.field_id == field.id,
    ).first()
    if not ownership:
        return "unauthorized"

    return get_field_by_id(field.id, farmer_id, db)


def _geometry_to_geojson(geometry) -> Optional[dict]:
    """Convert PostGIS geometry to GeoJSON dict."""
    try:
        shape = to_shape(geometry)
        return json.loads(json.dumps({
            "type": shape.geom_type,
            "coordinates": list(shape.geoms[0].exterior.coords) if shape.geom_type == "MultiPolygon"
            else list(shape.exterior.coords),
        }))
    except Exception:
        try:
            shape = to_shape(geometry)
            import shapely.geometry
            return json.loads(shapely.geometry.mapping(shape).__str__().replace("'", '"'))
        except Exception:
            return None

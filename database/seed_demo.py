"""
Demo Data Seed Script
=====================
Creates demo data for development/testing.

ALL DATA HERE IS DEMO DATA — not official cadastral boundaries,
verified soil observations, or scientific predictions.

Usage:
    python -m database.seed_demo

Demo Login:
    Mobile: 9876543210
    OTP: 123456 (development mode only)
"""

import sys
import os
import uuid
from datetime import datetime, timezone, timedelta

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy.orm import Session
from backend.app.db.database import engine, SessionLocal, Base
from backend.app.models import *  # noqa: F403


def seed_admin_hierarchy(db: Session) -> dict:
    """Create administrative hierarchy: Maharashtra → Pune → Baramati → Malegaon."""
    print("📍 Seeding administrative hierarchy...")

    state = State(name="Maharashtra", name_mr="महाराष्ट्र", code="MH")
    db.add(state)
    db.flush()

    district = District(state_id=state.id, name="Pune", name_mr="पुणे", code="PN")
    db.add(district)
    db.flush()

    taluka = Taluka(district_id=district.id, name="Baramati", name_mr="बारामती", code="BRM")
    db.add(taluka)
    db.flush()

    village = Village(taluka_id=taluka.id, name="Malegaon", name_mr="मालेगाव", census_code="DEMO-001")
    db.add(village)
    db.flush()

    print(f"  ✅ {state.name} → {district.name} → {taluka.name} → {village.name}")
    return {"state": state, "district": district, "taluka": taluka, "village": village}


def seed_demo_farmer(db: Session, village: Village) -> dict:
    """Create Demo Farmer with user account."""
    print("👤 Seeding Demo Farmer...")

    user = User(
        id=uuid.uuid4(),
        mobile="9876543210",
        role="farmer",
        is_active=True,
    )
    db.add(user)
    db.flush()

    farmer = Farmer(
        user_id=user.id,
        name="Demo Farmer",
        name_mr="डेमो शेतकरी",
        village_id=village.id,
    )
    db.add(farmer)
    db.flush()

    print(f"  ✅ Farmer: {farmer.name} (Mobile: {user.mobile})")
    return {"user": user, "farmer": farmer}


def seed_demo_fields(db: Session, village: Village, farmer: Farmer) -> list:
    """
    Create 3 demo fields near Malegaon, Baramati, Pune.

    IMPORTANT: These are DEMO geometries — NOT official cadastral boundaries.
    Approximate coordinates near Malegaon (18.15°N, 74.56°E).
    """
    print("🗺️  Seeding demo fields...")

    # Demo field geometries (simple polygons near Malegaon)
    # These are approximate and clearly labelled as DEMO
    demo_fields_data = [
        {
            "gat_no": "101",
            "area_reported_ha": 2.35,
            "wkt": (
                "SRID=4326;MULTIPOLYGON((("
                "74.555 18.152, 74.558 18.152, 74.558 18.149, 74.555 18.149, 74.555 18.152"
                ")))"
            ),
        },
        {
            "gat_no": "102",
            "area_reported_ha": 1.80,
            "wkt": (
                "SRID=4326;MULTIPOLYGON((("
                "74.560 18.152, 74.563 18.152, 74.563 18.150, 74.560 18.150, 74.560 18.152"
                ")))"
            ),
        },
        {
            "gat_no": "103",
            "area_reported_ha": 3.10,
            "wkt": (
                "SRID=4326;MULTIPOLYGON((("
                "74.555 18.148, 74.560 18.148, 74.560 18.145, 74.555 18.145, 74.555 18.148"
                ")))"
            ),
        },
    ]

    fields = []
    for fd in demo_fields_data:
        field = Field(
            village_id=village.id,
            gat_no=fd["gat_no"],
            area_reported_ha=fd["area_reported_ha"],
            geometry=fd["wkt"],
            is_demo=True,
        )
        db.add(field)
        db.flush()

        # Authorize Demo Farmer for this field
        ownership = FieldOwner(
            farmer_id=farmer.id,
            field_id=field.id,
            is_primary=True,
        )
        db.add(ownership)
        fields.append(field)
        print(f"  ✅ Field Gat {fd['gat_no']} ({fd['area_reported_ha']} ha) — DEMO GEOMETRY")

    db.flush()
    return fields


def seed_soil_parameters(db: Session) -> dict:
    """
    Create soil parameter definitions.
    These are parameter definitions, NOT measured values.
    """
    print("🧪 Seeding soil parameter definitions...")

    params_data = [
        {"name": "pH", "name_mr": "पीएच", "unit": None, "category": "chemical", "order": 1},
        {"name": "EC", "name_mr": "विद्युत वाहकता", "unit": "dS/m", "category": "chemical", "order": 2},
        {"name": "Organic Carbon", "name_mr": "सेंद्रिय कार्बन", "unit": "%", "category": "chemical", "order": 3},
        {"name": "Available Nitrogen", "name_mr": "उपलब्ध नत्र", "unit": "kg/ha", "category": "primary", "order": 4},
        {"name": "Available Phosphorus", "name_mr": "उपलब्ध स्फुरद", "unit": "kg/ha", "category": "primary", "order": 5},
        {"name": "Available Potassium", "name_mr": "उपलब्ध पालाश", "unit": "kg/ha", "category": "primary", "order": 6},
        {"name": "Sulphur", "name_mr": "गंधक", "unit": "ppm", "category": "secondary", "order": 7},
        {"name": "Zinc", "name_mr": "जस्त", "unit": "ppm", "category": "micronutrient", "order": 8},
        {"name": "Iron", "name_mr": "लोह", "unit": "ppm", "category": "micronutrient", "order": 9},
        {"name": "Manganese", "name_mr": "मंगल", "unit": "ppm", "category": "micronutrient", "order": 10},
        {"name": "Copper", "name_mr": "तांबे", "unit": "ppm", "category": "micronutrient", "order": 11},
        {"name": "Boron", "name_mr": "बोरॉन", "unit": "ppm", "category": "micronutrient", "order": 12},
        {"name": "Exchangeable Sodium", "name_mr": "विनिमय सोडियम", "unit": "meq/100g", "category": "chemical", "order": 13},
        {"name": "Free CaCO3", "name_mr": "मुक्त कॅल्शियम कार्बोनेट", "unit": "%", "category": "chemical", "order": 14},
        {"name": "Sand", "name_mr": "वाळू", "unit": "%", "category": "physical", "order": 15},
        {"name": "Silt", "name_mr": "गाळ", "unit": "%", "category": "physical", "order": 16},
        {"name": "Clay", "name_mr": "चिकणमाती", "unit": "%", "category": "physical", "order": 17},
        {"name": "CEC", "name_mr": "कॅटायन एक्सचेंज कॅपॅसिटी", "unit": "meq/100g", "category": "chemical", "order": 18},
        {"name": "Bulk Density", "name_mr": "घनता", "unit": "g/cc", "category": "physical", "order": 19},
    ]

    params = {}
    for pd in params_data:
        param = SoilParameter(
            name=pd["name"],
            name_mr=pd["name_mr"],
            unit=pd["unit"],
            category=pd["category"],
            display_order=pd["order"],
        )
        db.add(param)
        db.flush()
        params[pd["name"]] = param

    print(f"  ✅ {len(params)} soil parameters defined")
    return params


def seed_demo_dataset(db: Session) -> DatasetRegistry:
    """Register the demo dataset in the dataset registry."""
    print("📋 Registering demo dataset...")

    dataset = DatasetRegistry(
        source="Demo Data",
        source_file="demo_seed_script",
        source_agency="DSM Soil Health Portal — Demo",
        dataset_version="1.0",
        processing_version="seed_demo.py v1",
        status="imported",
        record_count=0,
        notes="[DEMO DATA] Sample soil values for development. Not verified lab results.",
    )
    db.add(dataset)
    db.flush()
    print(f"  ✅ Dataset registered: {dataset.source}")
    return dataset


def seed_demo_soil_data(db: Session, fields: list, params: dict, dataset: DatasetRegistry):
    """
    Create demo soil observations for each field.

    IMPORTANT: These are DEMO VALUES from reference images.
    They are NOT verified lab results or official data.
    """
    print("🌱 Seeding demo soil data...")

    # Demo soil values per field (from reference images)
    demo_values = {
        "101": {
            "pH": 8.38, "EC": 0.10, "Organic Carbon": 1.02,
            "Available Nitrogen": 163.0, "Available Phosphorus": 14.51,
            "Available Potassium": 313.0, "Sulphur": 16.25,
            "Zinc": 0.18, "Iron": 0.57, "Manganese": 0.41,
            "Copper": 0.27, "Boron": 0.16,
            "Exchangeable Sodium": 9.55, "Free CaCO3": 22.24,
        },
        "102": {
            "pH": 7.80, "EC": 0.15, "Organic Carbon": 0.85,
            "Available Nitrogen": 142.0, "Available Phosphorus": 12.30,
            "Available Potassium": 280.0, "Sulphur": 12.50,
            "Zinc": 0.22, "Iron": 0.65, "Manganese": 0.38,
            "Copper": 0.30, "Boron": 0.14,
        },
        "103": {
            "pH": 6.80, "EC": 0.42, "Organic Carbon": 0.62,
            "Available Nitrogen": 280.0, "Available Phosphorus": 18.0,
            "Available Potassium": 320.0, "Sulphur": 12.0,
            "Zinc": 0.80, "Iron": 0.57, "Manganese": 0.41,
            "Copper": 0.27, "Boron": 0.40,
        },
    }

    # Create samples and observations for each field
    sample_dates = [
        datetime(2026, 9, 10, tzinfo=timezone.utc),    # Latest
        datetime(2024, 2, 12, tzinfo=timezone.utc),     # Previous
        datetime(2022, 1, 15, tzinfo=timezone.utc),     # Oldest
    ]
    record_count = 0

    for field in fields:
        gat = field.gat_no
        if gat not in demo_values:
            continue

        for i, sample_date in enumerate(sample_dates):
            # Create physical soil sample record
            sample = SoilSample(
                field_id=field.id,
                sample_date=sample_date,
                depth_from_cm=0,
                depth_to_cm=30,
                data_source=DataSourceEnum.IMPORTED_DATA,
                dataset_id=dataset.id,
                sample_method="Demo Sample",
                lab_name="Demo Lab — Not Real",
                is_demo=True,
            )
            db.add(sample)
            db.flush()

            # Create observations for this sample
            for param_name, value in demo_values[gat].items():
                if param_name not in params:
                    continue

                param = params[param_name]
                # Vary values slightly for historical records
                adjusted_value = value * (1 + (i * 0.05)) if i > 0 else value

                obs = SoilObservation(
                    sample_id=sample.id,
                    parameter_id=param.id,
                    value=round(adjusted_value, 2),
                    unit=param.unit,
                    data_source=DataSourceEnum.IMPORTED_DATA,
                    dataset_id=dataset.id,
                )
                db.add(obs)
                record_count += 1

    # Update dataset record count
    dataset.record_count = record_count
    db.flush()
    print(f"  ✅ {record_count} demo soil observations created across {len(fields)} fields")


def seed_dsm_layers(db: Session):
    """
    Register DSM layer placeholders.
    Status = UNAVAILABLE because no actual DSM data exists yet.
    """
    print("🗺️  Registering DSM layer placeholders...")

    properties = [
        ("pH", "पीएच", None),
        ("EC", "विद्युत वाहकता", "dS/m"),
        ("Organic Carbon", "सेंद्रिय कार्बन", "%"),
        ("Available Nitrogen", "उपलब्ध नत्र", "kg/ha"),
        ("Available Phosphorus", "उपलब्ध स्फुरद", "kg/ha"),
        ("Available Potassium", "उपलब्ध पालाश", "kg/ha"),
        ("CEC", "कॅटायन एक्सचेंज कॅपॅसिटी", "meq/100g"),
        ("Sand", "वाळू", "%"),
        ("Silt", "गाळ", "%"),
        ("Clay", "चिकणमाती", "%"),
        ("Bulk Density", "घनता", "g/cc"),
    ]

    for prop_name, prop_name_mr, unit in properties:
        layer = DSMLayer(
            property_name=prop_name,
            property_name_mr=prop_name_mr,
            depth_from_cm=0,
            depth_to_cm=30,
            unit=unit,
            status=DSMLayerStatusEnum.UNAVAILABLE,
            is_demo=False,
        )
        db.add(layer)

    db.flush()
    print(f"  ✅ {len(properties)} DSM layer placeholders registered (status: UNAVAILABLE)")


def main():
    """Run the complete demo seed process."""
    print("\n" + "=" * 60)
    print("  DSM Soil Health Portal — Demo Data Seed")
    print("  ⚠️  ALL DATA IS DEMO DATA — NOT OFFICIAL")
    print("=" * 60 + "\n")

    # Create all tables
    print("🔧 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("  ✅ Tables created\n")

    db = SessionLocal()
    try:
        # Check if data already exists
        existing = db.query(State).first()
        if existing:
            print("⚠️  Demo data already exists. Skipping seed.")
            print("   To re-seed, drop the database and run again.")
            return

        # Seed all demo data
        hierarchy = seed_admin_hierarchy(db)
        farmer_data = seed_demo_farmer(db, hierarchy["village"])
        fields = seed_demo_fields(db, hierarchy["village"], farmer_data["farmer"])
        params = seed_soil_parameters(db)
        dataset = seed_demo_dataset(db)
        seed_demo_soil_data(db, fields, params, dataset)
        seed_dsm_layers(db)

        db.commit()

        print("\n" + "=" * 60)
        print("  ✅ Demo data seeded successfully!")
        print("=" * 60)
        print(f"\n  Demo Login:")
        print(f"    Mobile: 9876543210")
        print(f"    OTP:    123456 (development mode only)")
        print(f"\n  Authorized Gats: 101, 102, 103")
        print(f"  Village: Malegaon, Baramati, Pune, Maharashtra\n")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Error seeding demo data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

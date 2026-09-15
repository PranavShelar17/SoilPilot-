# DSM Soil Health Portal

> Digital Soil Mapping & Soil Health Card Platform

A GIS-based digital soil information and Soil Health Card platform that allows farmers to view their field boundaries, access soil health data, explore Digital Soil Maps, and generate PDF reports with QR verification.

---

## ⚠️ Important Notice

**Version 1 — Development Release**

This is a development version. All data included is **DEMO DATA** and does not represent official cadastral boundaries, verified soil observations, scientific DSM predictions, or validated classification thresholds.

Real GIS, soil, and DSM datasets will be integrated in future releases.

---

## 🌾 Features (V1)

- **Farmer Login** — Mobile number + OTP authentication
- **Dashboard** — Welcome screen with Gat search and soil summary
- **My Fields** — View authorized agricultural fields
- **GIS Map** — Interactive field map with MapLibre GL JS
- **Soil Health Card** — Complete soil parameter display with status
- **Digital Soil Maps** — DSM layer architecture (data pending)
- **Soil Analysis** — Parameter charts and comparisons
- **Reports** — PDF generation with QR code verification
- **Bilingual** — English + Marathi (मराठी)
- **Responsive** — Mobile, tablet, laptop, desktop

---

## 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| GIS Map | MapLibre GL JS |
| Charts | Recharts |
| Backend | Python 3.11 + FastAPI |
| ORM | SQLAlchemy 2.0 + Alembic |
| Database | PostgreSQL 16 + PostGIS 3.4 |
| PDF | ReportLab |
| Auth | JWT + OTP |
| Container | Docker + docker-compose |

---

## 📁 Project Structure

```
DSM-Soil-Health-Portal/
├── frontend/          # React + Vite application
├── backend/           # FastAPI application
├── database/          # Seed scripts
├── data/              # Demo and incoming data
│   ├── demo/          # Demo GIS/soil/DSM data
│   └── incoming/      # Real data import directory
├── scripts/           # Import utility scripts
├── docs/              # Architecture documentation
├── reference/         # Design reference images
├── tests/             # Test suites
├── docker/            # Dockerfiles
├── .env.example       # Environment variable template
├── docker-compose.yml # Docker services configuration
└── README.md
```

---

## 🚀 Quick Start (Windows)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- OR for local development:
  - [Node.js 20+](https://nodejs.org/)
  - [Python 3.11+](https://www.python.org/)
  - [PostgreSQL 16](https://www.postgresql.org/) with [PostGIS 3.4](https://postgis.net/)

### Option 1: Docker (Recommended)

```bash
# 1. Clone/navigate to project
cd DSM-Soil-Health-Portal

# 2. Copy environment file
copy .env.example .env

# 3. Start all services
docker compose up

# 4. Open browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

```bash
# 1. Copy environment file
copy .env.example .env

# 2. Start PostgreSQL with PostGIS
# (Ensure PostgreSQL is running with PostGIS extension)

# 3. Backend setup
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m database.seed_demo
uvicorn app.main:app --reload --port 8000

# 4. Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

---

## 🔐 Demo Login

| Field | Value |
|---|---|
| Mobile Number | `9876543210` |
| OTP | `123456` |
| Farmer Name | Demo Farmer |
| Village | Malegaon |
| Authorized Gats | 101, 102, 103 |

> **Note:** The development OTP `123456` only works when `APP_ENV=development`. Production requires a real SMS provider.

---

## 📍 V1 Location

| Level | Name |
|---|---|
| State | Maharashtra |
| District | Pune |
| Taluka | Baramati |
| Village | Malegaon |

---

## 🌐 Language Support

- English (default)
- Marathi (मराठी)

Switch language from the header or profile page.

---

## 📋 Environment Variables

See [`.env.example`](.env.example) for all configuration options.

**Critical for production:**
- `APP_ENV` — Set to `production`
- `JWT_SECRET` — Must be securely generated (≥32 chars)
- `POSTGRES_PASSWORD` — Must not use demo defaults
- `OTP_PROVIDER` — Must use a real SMS provider
- `DEMO_MODE` — Set to `false`

---

## 📊 Data Import

The system supports importing real data via utility scripts:

| Data Type | Script | Format |
|---|---|---|
| Field boundaries | `scripts/import_kml.py` | KML |
| Field boundaries | `scripts/import_kmz.py` | KMZ |
| Field boundaries | `scripts/import_shapefile.py` | SHP |
| Field boundaries | `scripts/import_geojson.py` | GeoJSON |
| Soil observations | `scripts/import_soil_csv.py` | CSV |
| Soil observations | `scripts/import_soil_excel.py` | Excel |
| DSM layers | `scripts/register_dsm_raster.py` | GeoTIFF/COG |

---

## 📖 Documentation

See the [`docs/`](docs/) directory for detailed documentation:

- [Architecture](docs/architecture.md)
- [Frontend](docs/frontend.md)
- [Backend](docs/backend.md)
- [Database](docs/database.md)
- [GIS](docs/gis.md)
- [Soil Data](docs/soil-data.md)
- [DSM](docs/dsm.md)
- [Reports](docs/reports.md)
- [Authentication](docs/authentication.md)
- [Deployment](docs/deployment.md)

---

## 📄 License

Private — All rights reserved.

---

## 📞 Support

For issues or questions, contact the development team.

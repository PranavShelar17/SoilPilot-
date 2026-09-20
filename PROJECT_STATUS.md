# DSM Soil Health Portal — Project Status

> Last updated: 2026-09-12

---

## ✅ Completed

### Stage 1: Project Foundation
- [x] Monorepo directory structure created
- [x] `.env.example` with all configuration variables
- [x] `.gitignore` (Python, Node, Docker, IDE, secrets)
- [x] `docker-compose.yml` (3 services: postgres, backend, frontend)
- [x] `docker/backend.Dockerfile` (Python 3.11 + GDAL/GEOS/PROJ)
- [x] `docker/frontend.Dockerfile` (Node 20 Alpine)
- [x] `docker/postgres/init-postgis.sql` (PostGIS + UUID extensions)
- [x] `README.md` with setup instructions
- [x] `PROJECT_STATUS.md`
- [x] Data directory structure (`data/demo/`, `data/incoming/`)
- [x] Placeholder directories for all modules

---

## 🔄 In Progress

_None_

---

## ⏳ Pending

### Stage 2: Database + PostGIS
- [ ] Backend requirements.txt
- [ ] Core config (Pydantic Settings)
- [ ] Database engine + session
- [ ] SQLAlchemy models (all tables with constraints)
- [ ] Alembic setup + initial migration

### Stage 3: Demo Data
- [ ] Seed admin hierarchy
- [ ] Seed Demo Farmer + fields + soil observations
- [ ] Demo GeoJSON

### Stage 4: FastAPI Backend
- [ ] API routes, schemas, services
- [ ] GIS module
- [ ] Soil module
- [ ] DSM module
- [ ] Reports module

### Stage 5: Authentication
- [ ] OTP service with security (expiry, attempts, cooldown)
- [ ] JWT authentication
- [ ] Protected routes

### Stage 6: React Frontend + Dashboard
- [ ] Vite + React + TypeScript setup
- [ ] Tailwind design system
- [ ] i18n (English + Marathi)
- [ ] All pages and components

### Stage 7: GIS Field Search/Map
- [ ] MapLibre integration
- [ ] Field polygon rendering
- [ ] Gat search → zoom to field

### Stage 8: Soil Health Card
- [ ] Soil parameter display with status badges
- [ ] Classification with "Not classified" fallback
- [ ] Soil history

### Stage 9: DSM Architecture
- [ ] DSM page with unavailable/demo state
- [ ] Raster service abstraction

### Stage 10: Soil Analysis
- [ ] Analysis charts
- [ ] Parameter comparison

### Stage 11: PDF + QR
- [ ] ReportLab PDF generation
- [ ] QR code → public_token URL
- [ ] Public report verification page

### Stage 12: Testing
- [ ] Backend tests
- [ ] Frontend tests
- [ ] Critical flow validation

### Stage 13: Documentation
- [ ] Architecture docs
- [ ] API docs
- [ ] Deployment docs

---

## ⚠️ Known Issues

_None at this stage._

---

## 🔮 Future Improvements

- Real KML/KMZ/SHP data integration
- Real soil lab data import
- Real DSM raster layers
- Validated soil classification standards
- Real SMS OTP provider (MSG91/Twilio)
- Admin Panel
- Multi-village/taluka/district expansion
- Server-side JWT token revocation
- Role-based access (Officer, Scientist, Researcher)
- Production deployment (cloud hosting)

---

## 📋 Architecture Notes

- **No fabricated data**: All demo data explicitly labelled `[DEMO DATA]`
- **No fake cadastral boundaries**: Demo geometry is not official
- **No invented thresholds**: Classification shows "Not classified" without validated rules
- **No overall soil health status**: Without validated rules, no Good/Medium/Poor displayed
- **DSM predictions**: Represented through DSM/raster architecture, NOT as virtual soil_samples
- **Backend authorization**: Enforced at API level — farmers cannot access other farmers' fields
- **Secure reports**: UUID public_token, no database IDs in public URLs
- **Production security**: App rejects insecure default JWT secrets in production mode

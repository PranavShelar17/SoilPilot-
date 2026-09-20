-- ============================================
-- PostGIS Initialization Script
-- ============================================
-- This script runs automatically when the PostgreSQL
-- container is first created. It enables PostGIS extensions.
-- ============================================

-- Enable PostGIS extension for spatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable PostGIS topology (optional, useful for complex geometry)
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable trigram similarity for fuzzy text search (future use)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verify PostGIS is installed
SELECT PostGIS_Version();

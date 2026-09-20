# ============================================
# Backend Dockerfile
# ============================================
FROM python:3.11-slim

# Install system dependencies for GeoPandas, GDAL, PostGIS client
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    libgdal-dev \
    gdal-bin \
    libgeos-dev \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend source
COPY backend/ /app/backend/

# Create storage directories
RUN mkdir -p /app/storage/reports

EXPOSE 8000

# Default command (overridden in docker-compose for dev)
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

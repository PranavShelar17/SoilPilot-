# ============================================
# Frontend Dockerfile
# ============================================
FROM node:20-alpine

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy frontend source
COPY frontend/ ./

EXPOSE 5173

# Default command (overridden in docker-compose for dev)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

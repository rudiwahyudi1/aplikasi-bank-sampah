# Multi-stage Dockerfile for Aplikasi Bank Sampah Terintegrasi
FROM node:20-alpine AS base

# Install curl for healthcheck
RUN apk add --no-cache curl tzdata

ENV TZ=Asia/Jakarta
ENV NODE_ENV=production
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source
COPY bin ./bin
COPY database ./database
COPY public ./public
COPY src ./src
COPY README.md ./

# Ensure uploads directory exists and permissions are correct
RUN mkdir -p /app/public/uploads && chown -R node:node /app

# Switch to non-root user
USER node

# Expose server port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:5000/auth/login || exit 1

# Start the application
CMD ["node", "src/app.js"]

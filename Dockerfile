# ==============================================================================
# Stage 1: Dependencies — Install production & dev dependencies
# ==============================================================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package manifests first for optimal layer caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies for build step)
RUN npm ci --ignore-scripts

# ==============================================================================
# Stage 2: Builder — Build/compile assets
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build frontend assets (Tailwind CSS, minification, etc.)
RUN npm run build --if-present

# Remove devDependencies after build
RUN npm prune --production

# ==============================================================================
# Stage 3: Production — Minimal runtime image
# ==============================================================================
FROM node:20-alpine AS production

# Install security updates and tini for proper PID 1 handling
RUN apk update && apk upgrade --no-cache \
    && apk add --no-cache tini curl \
    && rm -rf /var/cache/apk/*

# Create non-root user and group
RUN addgroup -g 1001 -S appgroup \
    && adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy production dependencies and application directories
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/backend ./backend
COPY --from=builder --chown=appuser:appgroup /app/frontend ./frontend

# Create directories for logs and uploads
RUN mkdir -p /app/logs /app/uploads \
    && chown -R appuser:appgroup /app/logs /app/uploads

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use tini as entrypoint for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application server
CMD ["node", "backend/src/server.js"]

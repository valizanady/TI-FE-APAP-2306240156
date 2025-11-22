# Build stage
FROM node:20 AS build-stage

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# ⚠️ IMPORTANT: ARG must be declared BEFORE usage and AFTER COPY
# This ensures Vite can read the variable during build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Verify environment variable (for debugging)
RUN echo "========================================" && \
    echo "🔧 Build Configuration:" && \
    echo "VITE_API_BASE_URL = $VITE_API_BASE_URL" && \
    echo "========================================" && \
    if [ -z "$VITE_API_BASE_URL" ]; then \
      echo "❌ ERROR: VITE_API_BASE_URL is not set!" && \
      exit 1; \
    fi

# Build the app
RUN npm run build

# Verify build output
RUN ls -lah /app/dist && \
    echo "✅ Build completed successfully"

# Production stage
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

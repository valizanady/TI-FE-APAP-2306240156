# Build stage
FROM node:20 AS build-stage

WORKDIR /app

# Copy everything (including dist/ if exists from CI)
COPY . .

# Build argument untuk API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Only install deps and build if dist doesn't exist
RUN if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then \
      echo "📦 Building from source with VITE_API_BASE_URL=$VITE_API_BASE_URL"; \
      npm ci && npm run build; \
    else \
      echo "✅ Using pre-built dist/ from CI pipeline"; \
    fi

# Production stage
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

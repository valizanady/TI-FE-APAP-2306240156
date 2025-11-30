# Build stage
FROM node:20 AS build-stage

WORKDIR /app

COPY package*.json ./

# Build argument untuk API URL
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm ci

COPY . .

# Verify environment variable
RUN echo "Building with VITE_API_BASE_URL=$VITE_API_BASE_URL"

RUN npm run build

# Production stage
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

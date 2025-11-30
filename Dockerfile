# Production stage - Use pre-built dist from CI
FROM nginx:alpine AS production-stage

RUN rm -rf /usr/share/nginx/html/*

# Copy pre-built dist folder from CI artifact
COPY dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]

# Frontend Deployment Guide - Tour Package

## 🚀 Deployment Overview

**Frontend URL**: `http://2306240156-fe.hafizmuh.site`  
**Backend API URL**: `http://2306240156-be.hafizmuh.site/api`  
**Auth Service (Nabeel)**: `https://acc-fe.beel.my.id`

---

## 📋 Environment Variables

### Required ENV Variables

```env
# Backend API Base URL
VITE_API_BASE_URL=http://2306240156-be.hafizmuh.site/api

# Profile Service Frontend URL (Nabeel's service)
VITE_AUTH_SERVICE_URL=https://acc-fe.beel.my.id

# Backend Auth API URL (Tour Package BE)
VITE_AUTH_BACKEND_URL=http://2306240156-be.hafizmuh.site/api/auth
```

---

## 🔧 GitHub Actions CI/CD Pipeline

### Workflow Trigger

**File**: `.github/workflows/fe-ci.yml`

Triggers on push to:
- `main` branch
- `backlog` branch

### Pipeline Steps

1. **Build**
   - Checkout code
   - Setup Node.js 20
   - Install dependencies (`npm ci`)
   - Build with environment variables
   - Upload `dist/` as artifact

2. **Docker Push**
   - Download build artifacts
   - Login to Docker Hub
   - Build Docker image with tags:
     - `valizanadya/tourpackage-fe:<commit-sha>`
     - `valizanadya/tourpackage-fe:latest`
   - Push to Docker Hub

3. **Deploy**
   - Setup SSH to EC2
   - Replace `REPLACE_ME_TAG` with commit SHA in deployment.yaml
   - Transfer k8s manifests to EC2
   - Apply to k3s cluster

---

## 🐳 Docker Configuration

### Dockerfile

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## ☸️ Kubernetes Configuration

### Deployment

**File**: `k8s/deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tourpackage-fe
  labels:
    app: tourpackage-fe
spec:
  replicas: 1
  selector:
    matchLabels:
      app: tourpackage-fe
  template:
    metadata:
      labels:
        app: tourpackage-fe
    spec:
      containers:
        - name: tourpackage-fe
          image: valizanadya/tourpackage-fe:REPLACE_ME_TAG
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
```

### Service

**File**: `k8s/service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: tourpackage-fe-service
spec:
  selector:
    app: tourpackage-fe
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

### Ingress

**File**: `k8s/ingress.yaml`

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: tourpackage-fe-ingress
  annotations:
    kubernetes.io/ingress.class: traefik
spec:
  rules:
    - host: 2306240156-fe.hafizmuh.site
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: tourpackage-fe-service
                port:
                  number: 80
```

---

## 🔐 GitHub Secrets Required

Configure these in: **GitHub Repository → Settings → Secrets and variables → Actions**

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DOCKER_IMAGE_NAME` | Docker Hub image name | `valizanadya/tourpackage-fe` |
| `DOCKER_USERNAME` | Docker Hub username | `valizanadya` |
| `DOCKER_PASSWORD` | Docker Hub password/token | `dckr_pat_xxx...` |
| `EC2_HOST` | EC2 server hostname/IP | `ec2-xx-xxx-xxx-xx.compute.amazonaws.com` |
| `EC2_USER` | SSH username | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH key | `-----BEGIN RSA PRIVATE KEY-----...` |

---

## 🧪 Testing Deployment

### 1. Check GitHub Actions

```bash
# Go to GitHub repository
# Navigate to: Actions tab
# Check latest workflow run status
```

### 2. Check Docker Image

```bash
# Pull latest image
docker pull valizanadya/tourpackage-fe:latest

# Check image details
docker images | grep tourpackage-fe
```

### 3. Check Kubernetes Deployment

```bash
# SSH to EC2
ssh ubuntu@your-ec2-host

# Check pods
sudo k3s kubectl get pods | grep tourpackage-fe

# Check deployment status
sudo k3s kubectl get deployment tourpackage-fe

# Check service
sudo k3s kubectl get service tourpackage-fe-service

# Check ingress
sudo k3s kubectl get ingress tourpackage-fe-ingress

# Check pod logs
sudo k3s kubectl logs -f deployment/tourpackage-fe
```

### 4. Test Frontend Access

```bash
# Test from local machine
curl -I http://2306240156-fe.hafizmuh.site

# Expected: 200 OK with HTML content

# Test in browser
open http://2306240156-fe.hafizmuh.site
```

---

## 🔄 Manual Deployment (If Needed)

### Build Docker Image Locally

```bash
cd tour-package-2306240156-fe

# Build with environment variables
docker build \
  --build-arg VITE_API_BASE_URL="http://2306240156-be.hafizmuh.site/api" \
  -t valizanadya/tourpackage-fe:manual \
  .

# Push to Docker Hub
docker push valizanadya/tourpackage-fe:manual
```

### Deploy to k3s Manually

```bash
# SSH to EC2
ssh ubuntu@your-ec2-host

# Update deployment image
sudo k3s kubectl set image deployment/tourpackage-fe \
  tourpackage-fe=valizanadya/tourpackage-fe:manual

# Or apply manifests manually
sudo k3s kubectl apply -f ~/app/k8s/deployment.yaml
sudo k3s kubectl apply -f ~/app/k8s/service.yaml
sudo k3s kubectl apply -f ~/app/k8s/ingress.yaml

# Check rollout status
sudo k3s kubectl rollout status deployment/tourpackage-fe
```

---

## 🐛 Troubleshooting

### Issue 1: Pod CrashLoopBackOff

**Check logs:**
```bash
sudo k3s kubectl logs deployment/tourpackage-fe
sudo k3s kubectl describe pod <pod-name>
```

**Common causes:**
- Nginx configuration error
- Missing files in `/usr/share/nginx/html`
- Port 80 already in use

**Solution:**
```bash
# Restart deployment
sudo k3s kubectl rollout restart deployment/tourpackage-fe
```

---

### Issue 2: ImagePullBackOff

**Check:**
```bash
sudo k3s kubectl describe pod <pod-name>
```

**Common causes:**
- Docker image doesn't exist
- Docker Hub credentials issue
- Wrong image tag

**Solution:**
```bash
# Verify image exists
docker pull valizanadya/tourpackage-fe:latest

# Update deployment with correct tag
sudo k3s kubectl edit deployment tourpackage-fe
```

---

### Issue 3: 502 Bad Gateway from Ingress

**Check:**
```bash
# Check service endpoints
sudo k3s kubectl get endpoints tourpackage-fe-service

# Check if pod is ready
sudo k3s kubectl get pods -l app=tourpackage-fe
```

**Solution:**
```bash
# Verify service selector matches pod labels
sudo k3s kubectl get deployment tourpackage-fe -o yaml | grep -A2 labels
sudo k3s kubectl get service tourpackage-fe-service -o yaml | grep -A2 selector
```

---

### Issue 4: CORS Errors in Browser

**Check browser console:**
```
Access to fetch at 'http://2306240156-be.hafizmuh.site/api/...' 
from origin 'http://2306240156-fe.hafizmuh.site' has been blocked by CORS policy
```

**Solution:**
Backend (Tour Package BE) must allow frontend origin in CORS config:

```properties
# Backend .env or k8s ConfigMap
CORS_ALLOWED_ORIGINS=http://2306240156-fe.hafizmuh.site,http://localhost:5173
```

---

### Issue 5: API Calls Return 404

**Check environment variables in build:**

```bash
# Check GitHub Actions logs
# Look for: "Building with VITE_API_BASE_URL=..."

# Verify built files contain correct API URL
docker run --rm valizanadya/tourpackage-fe:latest cat /usr/share/nginx/html/assets/index-*.js | grep -o 'http://[^"]*' | head -5
```

---

## 📊 Monitoring

### Health Checks

```bash
# Frontend health
curl http://2306240156-fe.hafizmuh.site

# Backend health (from frontend perspective)
curl http://2306240156-be.hafizmuh.site/api/actuator/health

# Auth service health
curl https://acc-fe.beel.my.id/health
```

### Log Monitoring

```bash
# Watch frontend logs
sudo k3s kubectl logs -f deployment/tourpackage-fe

# Watch ingress logs
sudo k3s kubectl logs -f -n kube-system deployment/traefik

# Export logs to file
sudo k3s kubectl logs deployment/tourpackage-fe > frontend-logs.txt
```

---

## 🔄 Rollback Deployment

### Rollback to Previous Version

```bash
# Check rollout history
sudo k3s kubectl rollout history deployment/tourpackage-fe

# Rollback to previous version
sudo k3s kubectl rollout undo deployment/tourpackage-fe

# Rollback to specific revision
sudo k3s kubectl rollout undo deployment/tourpackage-fe --to-revision=2

# Check status
sudo k3s kubectl rollout status deployment/tourpackage-fe
```

---

## 📝 Deployment Checklist

Before deploying:

- [ ] Code pushed to `main` or `backlog` branch
- [ ] GitHub Actions secrets configured
- [ ] Environment variables correct in workflow file
- [ ] Backend API accessible from frontend URL
- [ ] CORS configured on backend for frontend origin
- [ ] Profile Service (Nabeel) accessible
- [ ] Docker Hub credentials valid
- [ ] EC2 SSH access working
- [ ] k3s cluster healthy

After deploying:

- [ ] GitHub Actions workflow completed successfully
- [ ] Docker image pushed to Docker Hub
- [ ] Pod running (1/1 Ready)
- [ ] Service endpoints ready
- [ ] Ingress configured correctly
- [ ] Frontend accessible at `http://2306240156-fe.hafizmuh.site`
- [ ] API calls working (check browser console)
- [ ] Login/Authentication working
- [ ] No CORS errors in browser console

---

## 🔗 Related Documentation

- **Backend Deployment**: `tour-package-2306240156-be/DEPLOYMENT-CHECKLIST.md`
- **Environment Variables**: `tour-package-2306240156-be/DEPLOYMENT-ENV-VARIABLES.md`
- **JWT/Auth Integration**: `tour-package-2306240156-be/DEBUG-JWT-PROFILE-SERVICE.md`
- **Profile Service Coordination**: `tour-package-2306240156-be/KOORDINASI-NABEEL-PROFILE-SERVICE.md`

---

**Created**: November 30, 2025  
**Frontend URL**: http://2306240156-fe.hafizmuh.site  
**Status**: ✅ Ready for Deployment

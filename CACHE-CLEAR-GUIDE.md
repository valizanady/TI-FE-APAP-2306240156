# Frontend Assets 404 - Cache Clear Guide

## Problem
❌ Error: `Failed to load resource: the server responded with a status of 404 (Not Found)`
```
http://2306240156-fe.hafizmuh.site/assets/ActivityListView-D6JT5dhm.js
http://2306240156-fe.hafizmuh.site/assets/TopUpView-B-4bu9zQ.css
```

## Root Cause
**Browser cache** masih menyimpan `index.html` lama yang reference ke file assets dengan hash lama (yang sudah tidak ada setelah rebuild).

## Quick Fix - Clear Browser Cache

### Option 1: Hard Refresh (Recommended) ⚡
**Mac:**
- Chrome/Edge: `Cmd + Shift + R`
- Safari: `Cmd + Option + R`

**Windows:**
- Chrome/Edge: `Ctrl + Shift + R` atau `Ctrl + F5`

### Option 2: Clear Cache via DevTools 🔧
1. Open DevTools (`F12` atau `Cmd+Option+I`)
2. Right-click pada **Refresh button** di address bar
3. Select **"Empty Cache and Hard Reload"**

### Option 3: Clear All Browsing Data 🧹
**Chrome/Edge:**
1. `Cmd+Shift+Delete` (Mac) atau `Ctrl+Shift+Delete` (Windows)
2. Time range: **Last hour** atau **All time**
3. Check: ✅ **Cached images and files**
4. Click **Clear data**

**Safari:**
1. Safari → Preferences → Privacy
2. Click **Manage Website Data**
3. Search: `2306240156-fe.hafizmuh.site`
4. Click **Remove** → **Done**

### Option 4: Incognito/Private Window 🕵️
Open in new incognito window:
- Chrome: `Cmd+Shift+N` (Mac) atau `Ctrl+Shift+N` (Windows)
- Safari: `Cmd+Shift+N`

Visit: `http://2306240156-fe.hafizmuh.site`

## Verify Pipeline Completed

Check GitHub Actions:
```
https://github.com/your-username/tour-package-2306240156-fe/actions
```

Make sure:
- ✅ Latest commit has green checkmark
- ✅ All 3 jobs completed: `build` → `docker-push` → `deploy`
- ✅ Deployment finished ~2-3 minutes ago

## Verify New Build Deployed

### Check Docker Image Tag
```bash
ssh ec2-user@your-ec2-host "sudo k3s kubectl get pods -n default -o wide"
```

Look for `tourpackage-fe` pod with recent **AGE** (e.g., `2m`, `5m`)

### Check Pod Logs
```bash
ssh ec2-user@your-ec2-host "sudo k3s kubectl logs deployment/tourpackage-fe -n default --tail=20"
```

Should show nginx starting up

### Check Assets in Browser
After clearing cache, open DevTools Network tab and reload:

**Expected:**
```
✅ index.html          200 OK
✅ assets/index-*.js   200 OK  (NEW hash)
✅ assets/index-*.css  200 OK  (NEW hash)
```

**Old (cached):**
```
❌ assets/ActivityListView-D6JT5dhm.js  404 Not Found
❌ assets/TopUpView-B-4bu9zQ.css        404 Not Found
```

## Still Getting 404 After Cache Clear?

### 1. Check nginx serving correct files

SSH to EC2:
```bash
ssh ec2-user@your-ec2-host

# Get pod name
POD_NAME=$(sudo k3s kubectl get pods -n default -l app=tourpackage-fe -o jsonpath='{.items[0].metadata.name}')

# List files in nginx html dir
sudo k3s kubectl exec $POD_NAME -n default -- ls -la /usr/share/nginx/html/assets/

# Check index.html
sudo k3s kubectl exec $POD_NAME -n default -- cat /usr/share/nginx/html/index.html | grep -o 'assets/[^"]*\.js' | head -5
```

This shows the **actual** asset filenames in the deployed container.

### 2. Force redeploy

```bash
ssh ec2-user@your-ec2-host "sudo k3s kubectl rollout restart deployment/tourpackage-fe -n default"
```

Wait 30 seconds, then clear browser cache again.

### 3. Check nginx.conf

Verify cache headers in nginx config:
```bash
ssh ec2-user@your-ec2-host "sudo k3s kubectl exec deployment/tourpackage-fe -n default -- cat /etc/nginx/conf.d/default.conf"
```

Should have:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

But `index.html` should NOT be cached:
```nginx
location = /index.html {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

## Prevention - Add Cache Busting Headers

Update `nginx.conf` to prevent index.html caching:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Disable caching for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri $uri/ /index.html;
    }

    # Cache assets aggressively (they have content hash)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Fallback for SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Summary

**The issue:** Browser cached old `index.html` that references old asset hashes

**The fix:** 
1. ✅ Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. ✅ Or use Incognito/Private window
3. ✅ Verify pipeline completed and new pods are running

**Expected result:** 
- ✅ All assets load with 200 OK
- ✅ API calls use correct URLs: `http://2306240156-be.hafizmuh.site/api/activities`
- ✅ UI renders correctly

---

**Date:** 2025-11-30
**Issue:** Browser cache serving old index.html with stale asset references

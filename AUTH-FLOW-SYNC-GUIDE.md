# Authentication Flow - Frontend & Backend Synchronized

**Last Updated:** 2025-01-27  
**Status:** ✅ Synchronized with backend documentation

---

## Overview

This document describes the **complete authentication flow** between Frontend, Backend, and Nabeel's SSO service.

### Services Involved

| Service | URL | Purpose |
|---------|-----|---------|
| **Our Frontend** | `http://localhost:5173` | Vue 3 SPA |
| **Our Backend** | `http://localhost:8080/api` | Spring Boot REST API |
| **SSO Frontend** | `https://acc-fe.beel.my.id` | Nabeel's login page |
| **SSO Backend** | `https://acc-be.beel.my.id/api` | Nabeel's auth service |

---

## Complete Authentication Flow (13 Steps)

### Visual Flow Diagram

```
┌──────────────┐         ┌────────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser    │         │  Our Frontend  │         │ Our Backend  │         │ Nabeel SSO  │
│   (User)     │         │   (Vue 3)      │         │ (Spring Boot)│         │   Service   │
└──────────────┘         └────────────────┘         └──────────────┘         └─────────────┘
       │                         │                          │                         │
       │ 1. Click "Login"        │                          │                         │
       ├────────────────────────>│                          │                         │
       │                         │                          │                         │
       │                         │ 2. Redirect to SSO       │                         │
       │                         ├─────────────────────────────────────────────────>│
       │                         │ URL: acc-fe.beel.my.id   │                         │
       │                         │ ?redirect=localhost:5173 │                         │
       │                         │                          │                         │
       │ 3. Show login page      │                          │                         │
       │<─────────────────────────────────────────────────────────────────────────────┤
       │                         │                          │                         │
       │ 4. Enter credentials    │                          │                         │
       ├─────────────────────────────────────────────────────────────────────────────>│
       │                         │                          │                         │
       │ 5. Redirect with OTT    │                          │                         │
       │<─────────────────────────────────────────────────────────────────────────────┤
       │ localhost:5173/login-success?ott=XXXXX            │                         │
       │                         │                          │                         │
       │                         │ 6. Parse OTT from URL    │                         │
       │                         │    (LoginSuccessView)    │                         │
       │                         │                          │                         │
       │                         │ 7. POST /auth/exchange   │                         │
       │                         ├─────────────────────────>│                         │
       │                         │ Body: { ott: "XXXXX" }   │                         │
       │                         │                          │                         │
       │                         │                          │ 8. Validate OTT         │
       │                         │                          ├────────────────────────>│
       │                         │                          │ POST /auth/exchange     │
       │                         │                          │                         │
       │                         │                          │ 9. Return JWT           │
       │                         │                          │<────────────────────────┤
       │                         │                          │ { jwt: "eyJ..." }       │
       │                         │                          │                         │
       │                         │ 10. Return JWT           │                         │
       │                         │<─────────────────────────┤                         │
       │                         │ { data: { jwt: "eyJ..." }}                         │
       │                         │                          │                         │
       │                         │ 11. Store in localStorage│                         │
       │                         │     key: "token"         │                         │
       │                         │                          │                         │
       │                         │ 12. Parse JWT payload    │                         │
       │                         │     Extract user info    │                         │
       │                         │                          │                         │
       │ 13. Show user in navbar │                          │                         │
       │<────────────────────────┤                          │                         │
       │ "Logged in as: nadya"   │                          │                         │
```

### Detailed Step-by-Step Explanation

#### **Step 1-2: User Initiates Login**
- User clicks "🔐 Login" button in navbar
- Frontend redirects to SSO with callback URL:
  ```
  https://acc-fe.beel.my.id/auth/login?redirect=http://localhost:5173/login-success
  ```
- **Important:** `redirect` parameter points to **FRONTEND**, not backend

#### **Step 3-4: SSO Authentication**
- Nabeel's SSO shows login page
- User enters credentials
- SSO validates credentials

#### **Step 5: SSO Returns OTT**
- SSO redirects browser to:
  ```
  http://localhost:5173/login-success?ott=2U9ZTI
  ```
- **OTT (One-Time Token)** is short-lived, single-use token
- Valid for ~30 seconds

#### **Step 6: Frontend Receives OTT**
- `LoginSuccessView.vue` component mounts
- Extracts OTT from URL query parameter:
  ```typescript
  const route = useRoute();
  const ott = route.query.ott as string;
  ```

#### **Step 7: Frontend Calls Backend**
- Frontend sends POST request to our backend:
  ```typescript
  POST http://localhost:8080/api/auth/exchange
  Body: { "ott": "2U9ZTI" }
  ```
- Uses environment variable: `VITE_AUTH_BACKEND_URL`

#### **Step 8-9: Backend Validates OTT**
- Backend calls Nabeel's SSO service:
  ```java
  POST https://acc-be.beel.my.id/api/auth/exchange
  Body: { "ott": "2U9ZTI" }
  ```
- SSO validates OTT and returns JWT
- JWT contains user information (username, role, email, balance)

#### **Step 10: Backend Returns JWT**
- Backend responds to frontend:
  ```json
  {
    "status": 200,
    "data": {
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hZHlhLnZhbGl6YSIsInJvbGUiOiJDdXN0b21lciIsImVtYWlsIjoibmFkeWEudmFsaXphQHVpLmFjLmlkIiwidXNlcklkIjoyMSwiYmFsYW5jZSI6MC4wfQ..."
    }
  }
  ```
- **Important:** Field name is `jwt`, not `token`

#### **Step 11: Store JWT**
- Frontend stores JWT in localStorage:
  ```typescript
  localStorage.setItem('token', response.data.jwt);
  ```
- **Key:** `"token"` (for consistency with existing code)
- **Value:** The JWT string

#### **Step 12: Parse JWT**
- Frontend decodes JWT to extract user info:
  ```typescript
  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };
  ```
- Extracts: `username`, `role`, `email`, `userId`, `balance`

#### **Step 13: Update UI**
- Navbar updates to show user info
- User sees: "Logged in as: nadya.valiza"
- Role badge appears: "Customer" / "Travel Agent" / "Superadmin"

---

## JWT Payload Structure

```json
{
  "username": "nadya.valiza",
  "role": "Customer",
  "email": "nadya.valiza@ui.ac.id",
  "userId": 21,
  "balance": 0.0,
  "iat": 1234567890,
  "exp": 1234571490
}
```

| Field | Type | Description |
|-------|------|-------------|
| `username` | string | User's login name |
| `role` | string | User role: "Customer", "Travel Agent", "Superadmin" |
| `email` | string | User's email address |
| `userId` | number | Unique user ID |
| `balance` | number | User's account balance |
| `iat` | number | Issued at timestamp (Unix) |
| `exp` | number | Expiration timestamp (Unix) |

---

## API Reference

### POST `/api/auth/exchange`

**Purpose:** Exchange OTT for JWT

**Request:**
```json
{
  "ott": "2U9ZTI"
}
```

**Success Response (200 OK):**
```json
{
  "status": 200,
  "data": {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

| Status | Message | Cause |
|--------|---------|-------|
| 400 | OTT is required | Missing OTT in request body |
| 401 | Invalid or expired OTT | OTT used/expired/invalid |
| 503 | Authentication service unavailable | Nabeel's SSO down |

---

## Environment Configuration

### Frontend `.env`

```env
# API Base URL (for all API calls)
VITE_API_BASE_URL=http://localhost:8080/api/

# SSO Login Page
VITE_AUTH_SERVICE_URL=https://acc-fe.beel.my.id

# Backend Auth Endpoint (MUST include /api/auth path!)
VITE_AUTH_BACKEND_URL=http://localhost:8080/api/auth
```

### Backend `application.yaml`

```yaml
cors:
  allowed-origins: "http://localhost:5173"
  
auth:
  service:
    url: "https://acc-be.beel.my.id/api"
```

---

## Security Features

### Why OTT Exchange Pattern?

✅ **Single-Use Tokens**
- Each OTT can only be exchanged once
- Prevents replay attacks

✅ **Short-Lived OTT**
- Valid for only ~30 seconds
- Minimizes exposure window

✅ **Server-Side Validation**
- Backend validates OTT with SSO
- Frontend never validates tokens

✅ **JWT in Authorization Header**
- Not in URL (no browser history leaks)
- Standard Bearer token pattern
- Sent with every API request

✅ **Separate Auth Service**
- User credentials never touch our backend
- SSO handles authentication
- We only handle authorization

### Axios Interceptor

All API requests automatically include JWT:

```typescript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Testing Guide

### Manual Testing

1. **Start Services:**
   ```bash
   # Terminal 1: Backend
   cd tour-package-2306240156-be
   ./gradlew bootRun
   
   # Terminal 2: Frontend
   cd tour-package-2306240156-fe
   npm run dev
   ```

2. **Test Login:**
   - Visit: `http://localhost:5173`
   - Click "🔐 Login"
   - Login at SSO
   - Should redirect back with OTT
   - Should exchange OTT automatically
   - Should show username in navbar

3. **Verify localStorage:**
   - Open DevTools → Application → Local Storage
   - Should have key: `token`
   - Value: JWT starting with `eyJ...`

4. **Verify Console Logs:**
   ```
   🔐 Redirecting to login: https://acc-fe.beel.my.id/auth/login?redirect=...
   🎫 OTT received, exchanging for JWT token...
   📦 Backend response: { status: 200, data: { jwt: "..." } }
   👤 User info set: { id: 21, username: "nadya.valiza", ... }
   ✅ Login successful! Token saved.
   ```

### Testing with Bruno

1. **Get Fresh OTT:**
   - Login via browser
   - Copy OTT from URL

2. **Test Exchange:**
   - Open: `bruno-tests/Auth/POST-Exchange-OTT-for-JWT.bru`
   - Replace OTT value
   - Send request
   - Should receive JWT

3. **Use JWT:**
   - Copy JWT from response
   - Add to other API requests:
     ```
     Authorization: Bearer eyJ...
     ```

---

## Troubleshooting

### Issue 1: "404 Not Found" on `/api/auth/exchange`

**Cause:** Wrong `VITE_AUTH_BACKEND_URL` in `.env`

**Fix:**
```env
# ❌ Wrong
VITE_AUTH_BACKEND_URL=http://localhost:8080/

# ✅ Correct
VITE_AUTH_BACKEND_URL=http://localhost:8080/api/auth
```

**Important:** Restart dev server after changing `.env`!

### Issue 2: "401 Unauthorized" on exchange

**Cause:** OTT expired or already used

**Fix:** Get fresh OTT by logging in again (OTT valid ~30 seconds)

### Issue 3: Token not saving

**Cause:** Frontend reading wrong field

**Check:**
```typescript
// ❌ Wrong
if (data && data.token) {
  
// ✅ Correct
if (data && data.jwt) {
```

### Issue 4: User info not displaying

**Cause:** Token not stored properly

**Debug:**
1. Check localStorage has `token` key
2. Check `parseJwt()` function works
3. Check `initialize()` called in `App.vue`

### Issue 5: Extra `/auth` in URL

**Problem:** `http://localhost:5173/login-success/auth?ott=XXX`

**Cause:** SSO redirect URL misconfigured

**Fix:** Ensure redirect parameter is:
```
http://localhost:5173/login-success
```
(without `/auth` suffix)

---

## Code References

### Frontend Files

- **Auth Store:** `src/stores/auth.ts`
  - `exchangeToken()` - Calls backend exchange endpoint
  - `parseJwt()` - Decodes JWT payload
  - `initialize()` - Restores user from localStorage
  
- **Login Success:** `src/views/LoginSuccessView.vue`
  - Receives OTT from URL
  - Calls `exchangeToken()`
  - Redirects to home after success
  
- **Navbar:** `src/layout/AppLayout.vue`
  - Displays user info from auth store
  - Shows role badge
  - Login/Logout buttons

### Backend Files

- **Auth Controller:** `src/main/java/.../controller/AuthController.java`
  - `POST /api/auth/exchange` endpoint
  - Calls profile service client
  
- **Profile Client:** `src/main/java/.../service/ProfileServiceClient.java`
  - Calls Nabeel's SSO
  - Returns JWT to controller

### Documentation Files

- **Backend:** `bruno-tests/Auth/README.md`
- **Frontend:** This file + `LOGIN-TEST-GUIDE.md`

---

## Comparison: Old vs New Pattern

### ❌ Old Pattern (Insecure)

```
SSO → Backend with token → Backend redirects to Frontend with token in URL
URL: http://localhost:5173/?token=eyJ...
```

**Problems:**
- Token in browser history
- Token logged by proxies
- Long-lived token exposed
- No server validation before use

### ✅ New Pattern (Secure - OTT Exchange)

```
SSO → Frontend with OTT → Frontend exchanges OTT with Backend → Backend validates with SSO → Frontend stores JWT
URL: http://localhost:5173/login-success?ott=2U9ZTI
```

**Benefits:**
- OTT is single-use
- OTT short-lived (~30 seconds)
- Server validates before giving JWT
- JWT never in URL

---

## Summary Checklist

Before deployment, ensure:

- [ ] `.env` has correct `VITE_AUTH_BACKEND_URL` (include `/api/auth`)
- [ ] Backend `application.yaml` has correct CORS origins
- [ ] Frontend `auth.ts` reads `data.jwt` not `data.token`
- [ ] SSO redirect URL points to frontend, not backend
- [ ] Axios interceptor adds `Authorization` header
- [ ] JWT parsing function handles base64 correctly
- [ ] localStorage key is consistent (`"token"`)
- [ ] Error handling for expired/invalid OTT
- [ ] Console logs removed in production

---

**Documentation synchronized between:**
- Frontend: `tour-package-2306240156-fe/AUTH-FLOW-SYNC-GUIDE.md` (this file)
- Backend: `tour-package-2306240156-be/bruno-tests/Auth/README.md`

Last verified working: 2025-01-27

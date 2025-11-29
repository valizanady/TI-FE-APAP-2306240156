# Login Test Guide - Step by Step

## Prerequisites
1. ✅ Backend running di `http://localhost:8080`
2. ✅ Frontend running di `http://localhost:5173`
3. ✅ Browser Developer Console terbuka (F12)

## Environment Variables Check
File `.env` harus berisi:
```env
VITE_API_BASE_URL=http://localhost:8080/api/
VITE_AUTH_SERVICE_URL=https://acc-fe.beel.my.id
VITE_AUTH_BACKEND_URL=http://localhost:8080/api/auth
```

⚠️ **PENTING**: Setelah edit `.env`, HARUS restart Vite dev server!
```bash
# Stop server (Ctrl+C)
npm run dev
```

## Step-by-Step Login Test

### Step 1: Start dari Homepage
1. Buka browser: `http://localhost:5173`
2. Navbar seharusnya show: **"🔐 Login"** button
3. Username **TIDAK** muncul (karena belum login)

### Step 2: Click Login Button
1. Click button **"🔐 Login"** di navbar
2. Browser akan redirect ke: `https://acc-fe.beel.my.id/auth/login?redirect=http://localhost:5173/login-success`
3. Cek console log: `🔐 Redirecting to login: ...`

### Step 3: Login di SSO Nabeel
1. Masukkan credentials SSO
2. Login berhasil
3. SSO akan redirect ke: `http://localhost:5173/login-success?ott=XXXXXX`
   - Contoh: `http://localhost:5173/login-success?ott=M0GP12`
   - ⚠️ Jika ada `/auth` extra → `http://localhost:5173/login-success/auth?ott=XXX` → Ini SALAH! Cek redirect URL di SSO config

### Step 4: Token Exchange (LoginSuccessView)
Cek Console Browser, seharusnya muncul logs:

```
🎫 OTT received, exchanging for JWT token...
🔄 Exchanging OTT for JWT token...
[Request] POST http://localhost:8080/api/auth/exchange
📦 Backend response: { status: 200, data: { jwt: "eyJ..." } }
🔍 Parsed JWT payload: { userId: "...", username: "...", role: "...", ... }
👤 User info set: { id: "...", username: "...", email: "...", role: "...", balance: 0 }
✅ Login successful! Token saved.
✅ Login successful, redirecting...
```

### Step 5: Verify Token Saved
1. Buka Browser DevTools → Application/Storage → Local Storage → `http://localhost:5173`
2. Seharusnya ada key: **`token`**
3. Value: JWT token (panjang, format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 6: Verify Navbar Updates
Setelah redirect ke home (`/`):
1. Navbar seharusnya show: **"👤 username"**
2. Badge muncul: **"Customer"** atau **"SUPERADMIN"**
3. Button **"Logout"** muncul
4. Button **"🔐 Login"** HILANG

Contoh tampilan:
```
👤 john_doe [Customer] [Logout]
```

atau untuk Superadmin:
```
👤 admin_user [SUPERADMIN] [Logout]
```

### Step 7: Menu Visibility Check
- **Customer**: Menu **"💳 Top-Up"** muncul
- **Superadmin**: Menu **"💳 Top-Up"** dan **"💰 Payment Methods"** muncul

### Step 8: Test Refresh Page
1. Refresh browser (F5)
2. Username dan role TETAP muncul (tidak logout)
3. Cek console: `✅ User restored from token: ...`
4. Token tetap ada di localStorage

### Step 9: Test API Request with Token
1. Navigate ke `/topup` (jika logged in)
2. Cek Network tab di DevTools
3. Request ke `http://localhost:8080/api/transactions`
4. Headers seharusnya ada: `Authorization: Bearer eyJ...`
5. Console log: `🔑 Token attached to request: ...`

### Step 10: Test Logout
1. Click button **"Logout"**
2. Confirm logout
3. Username hilang dari navbar
4. Button **"🔐 Login"** muncul kembali
5. LocalStorage key `token` terhapus
6. Redirect ke home

---

## Common Issues & Debugging

### Issue 1: OTT Not Found Error
**Symptoms**: 
- Console: `❌ Login failed: No OTT found in URL`
- Stuck di LoginSuccessView dengan error

**Cause**: URL redirect salah dari SSO
**Solution**: 
1. Cek URL di browser address bar
2. Seharusnya: `http://localhost:5173/login-success?ott=XXXXX`
3. Jika berbeda, cek SSO redirect config di Nabeel's service

### Issue 2: JWT Not Found in Response
**Symptoms**:
- Console: `❌ JWT not found in response data`
- Console: `📦 Backend response: { data: null }` atau `{ data: {} }`

**Cause**: Backend tidak return JWT atau OTT invalid
**Solution**:
1. Cek backend logs: Apakah `/api/auth/exchange` dipanggil?
2. Cek backend response format: Harus `{ data: { jwt: "..." } }`
3. Test backend langsung dengan Postman/Bruno:
   ```
   POST http://localhost:8080/api/auth/exchange
   Body: { "ott": "VALID_OTT_FROM_SSO" }
   ```

### Issue 3: Username Tidak Muncul di Navbar
**Symptoms**:
- Token tersimpan di localStorage
- Tapi navbar tetap show "Login" button
- Username tidak muncul

**Cause**: JWT payload tidak contain username field, atau initialize() tidak dipanggil
**Debug Steps**:
1. Cek console: Apakah ada log `✅ User restored from token`?
2. Cek JWT payload di console: `🔍 Parsed JWT payload: ...`
3. Decode JWT manual di https://jwt.io - Cek fields: `username`, `name`, `sub`
4. Update auth store line 126 untuk handle field yang beda:
   ```typescript
   username: tokenPayload.username || tokenPayload.name || tokenPayload.sub
   ```

### Issue 4: CORS Error
**Symptoms**:
- Console: `Access to XMLHttpRequest at 'http://localhost:8080/api/auth/exchange' from origin 'http://localhost:5173' has been blocked by CORS`

**Solution**: Backend harus allow origin `http://localhost:5173`
```java
// In WebConfig or similar
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
```

### Issue 5: 404 Not Found - /api/auth/exchange
**Symptoms**:
- Console: `POST http://localhost:8080/api/auth/exchange 404 (Not Found)`

**Cause**: Backend endpoint belum exist atau path salah
**Solution**:
1. Cek `AuthController.java` ada `@PostMapping("/exchange")`
2. Cek `@RequestMapping("/api/auth")` di class level
3. Test manual di browser: `http://localhost:8080/api/auth/test` (buat endpoint test)

### Issue 6: Token Expires / 401 Unauthorized
**Symptoms**:
- Setelah beberapa waktu, API request return 401
- Auto logout

**Cause**: JWT expired (TTL habis)
**Solution**: Normal behavior, user perlu login ulang. TTL diatur di backend saat generate JWT.

---

## Backend Requirements Checklist

### AuthController.java Must Have:
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/exchange")
    public ResponseEntity<BaseResponseDTO<TokenExchangeResponseDTO>> exchangeToken(
        @RequestBody TokenExchangeRequestDTO request
    ) {
        String jwt = profileServiceClient.exchangeToken(request.getOtt());
        
        TokenExchangeResponseDTO data = TokenExchangeResponseDTO.builder()
            .jwt(jwt)  // ⚠️ Field name MUST be "jwt"
            .build();
            
        return ResponseEntity.ok(new BaseResponseDTO<>(200, "Success", new Date(), data));
    }
}
```

### JWT Payload Must Contain:
```json
{
  "sub": "user-id-123",           // Required
  "userId": "user-id-123",        // Optional
  "username": "john_doe",         // Required for navbar display
  "name": "John Doe",             // Alternative to username
  "email": "john@example.com",    // Required
  "role": "Customer",             // Required (Customer or SUPERADMIN)
  "balance": 0,                   // Optional
  "exp": 1234567890               // Required (expiration timestamp)
}
```

---

## Quick Debug Commands

### Check LocalStorage Token
```javascript
// Di browser console
localStorage.getItem('token')
```

### Decode JWT Token
```javascript
// Di browser console
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));
  return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token');
if (token) console.log(parseJwt(token));
```

### Check Auth Store State
```javascript
// Di browser console (jika Vue Devtools installed)
// Vue Devtools → Pinia → auth store
// Atau manual:
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
console.log('User:', authStore.user)
console.log('Token:', authStore.token)
console.log('IsLoggedIn:', authStore.isLoggedIn)
```

---

## Expected Success Flow Summary

```
1. User clicks Login
   → Redirect to SSO (https://acc-fe.beel.my.id)
   
2. User logs in at SSO
   → SSO redirects: http://localhost:5173/login-success?ott=XXXXX
   
3. LoginSuccessView receives OTT
   → Calls: POST http://localhost:8080/api/auth/exchange { ott: "XXXXX" }
   
4. Backend validates OTT with Nabeel's service
   → Returns: { data: { jwt: "eyJ..." } }
   
5. Frontend saves JWT to localStorage
   → Parses JWT payload
   → Sets user state: { id, username, email, role, balance }
   
6. Frontend redirects to home
   → App.vue onMounted calls authStore.initialize()
   → Navbar displays: 👤 username [Role]
   
7. User navigates to /topup
   → Axios interceptor attaches: Authorization: Bearer {jwt}
   → Backend validates JWT
   → Returns data
   
8. User clicks Logout
   → Clears localStorage
   → Resets auth state
   → Redirects to home
   → Navbar shows Login button again
```

---

## Testing dengan Postman/Bruno

### Test Backend Exchange Endpoint
```
POST http://localhost:8080/api/auth/exchange
Content-Type: application/json

Body:
{
  "ott": "COPY_FROM_SSO_REDIRECT"
}

Expected Response:
{
  "status": 200,
  "message": "Token exchange successful",
  "timestamp": "2025-11-27T...",
  "data": {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test Authenticated API Call
```
GET http://localhost:8080/api/transactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Expected Response:
{
  "status": 200,
  "message": "Success",
  "data": [...]
}
```

---

## Final Checklist ✅

- [ ] `.env` file correct (VITE_AUTH_BACKEND_URL = http://localhost:8080/api/auth)
- [ ] Vite dev server restarted after `.env` change
- [ ] Backend running on port 8080
- [ ] AuthController returns field `jwt` not `token`
- [ ] JWT payload contains `username` or `name` field
- [ ] CORS enabled for http://localhost:5173
- [ ] Browser DevTools console open for debugging
- [ ] LocalStorage cleared before test (fresh start)

**If all checks pass and still not working, share console logs and network tab screenshots!** 🚀

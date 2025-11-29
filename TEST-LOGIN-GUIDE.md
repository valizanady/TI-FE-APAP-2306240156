# 🔐 Login Testing Guide - OTT Expired Issue

## ⚠️ Problem: OTT Expired

**Symptoms:**
```
❌ HTTP Error: 400 BAD_REQUEST - Invalid or expired OTT
❌ Token exchange failed: Invalid response
```

**Root Cause:** OTT (One-Time Token) is **single-use** and **expires in ~30 seconds**.

---

## ✅ How to Fix

### Step 1: Clear Everything
```javascript
// Open Browser Console (F12)
localStorage.clear()
sessionStorage.clear()
// Then refresh page
```

### Step 2: Close All Tabs
- **IMPORTANT:** SSO Nabeel's OTT is single-use
- If you have multiple tabs open, OTT will be consumed by first tab
- Close all tabs except one

### Step 3: Test Login Flow (Fast!)

1. **Click Login** button
2. **Login at SSO immediately** (don't wait!)
3. **Let auto-redirect happen** (don't refresh!)
4. **Check console logs** within 30 seconds

---

## 🧪 Testing Checklist

### Before Login:
- [ ] Only 1 browser tab open
- [ ] localStorage cleared
- [ ] Backend running (`http://localhost:8080`)
- [ ] Frontend running (`http://localhost:5174`)
- [ ] Console open (F12) to see logs

### During Login:
- [ ] Click Login → redirects to SSO
- [ ] Enter credentials **immediately**
- [ ] Don't refresh, don't open new tabs
- [ ] Watch console logs

### Expected Console Output:
```
🌐 Current URL: http://localhost:5174/login-success/auth?ott=XXXXXX
📍 Current Path: /login-success/auth
🔍 Query params: { ott: "XXXXXX" }
🎫 OTT value: XXXXXX
🔄 [AUTH] Starting token exchange...
🎫 [AUTH] OTT: XXXXXX
🌐 [AUTH] Backend URL: http://localhost:8080/api/auth
📤 [AUTH] Sending request to: http://localhost:8080/api/auth/exchange
📥 [AUTH] Response status: 200
📥 [AUTH] Response data: { status: 200, data: { jwt: "eyJ..." } }
✅ [AUTH] JWT received from backend
💾 [AUTH] Token saved to localStorage
👤 [AUTH] User info saved: { username: "...", role: "..." }
✅ Login Berhasil! (toast)
```

### After Login:
- [ ] Check localStorage has `token` key
- [ ] Check navbar shows username
- [ ] Check role badge appears
- [ ] No errors in console

---

## 🚨 Common Mistakes

### ❌ Mistake 1: Waiting Too Long
**Problem:** OTT expires after 30 seconds
**Solution:** Login and submit credentials immediately after clicking Login button

### ❌ Mistake 2: Multiple Tabs
**Problem:** OTT is single-use, first tab consumes it
**Solution:** Close all tabs except one before testing

### ❌ Mistake 3: Refreshing Page
**Problem:** New OTT generated but old one in URL
**Solution:** Don't refresh, let auto-redirect complete

### ❌ Mistake 4: Backend Not Running
**Problem:** Frontend can't reach `http://localhost:8080/api/auth/exchange`
**Solution:** Start backend with `./gradlew bootRun`

### ❌ Mistake 5: Old Token in localStorage
**Problem:** Initialize() loads old user, new login conflicts
**Solution:** Clear localStorage before each test

---

## 🔍 Debug Steps

### If "Invalid or expired OTT":
1. Check timestamp between redirect and exchange
2. If > 30 seconds → OTT expired
3. Try again faster

### If "Invalid response":
1. Check backend logs for actual error
2. Check network tab for response body
3. Verify backend URL is correct

### If Token Not Saving:
1. Check console for `💾 [AUTH] Token saved to localStorage`
2. Manually check: `localStorage.getItem('token')`
3. Verify no errors during parseJwt

### If User Not Showing:
1. Check console for `👤 [AUTH] User info saved`
2. Check auth store: `authStore.user`
3. Verify JWT payload has correct fields

---

## 📋 Environment Variables

**Check `.env` file:**
```env
VITE_API_BASE_URL=http://localhost:8080/
VITE_AUTH_SERVICE_URL=https://acc-fe.beel.my.id
VITE_AUTH_BACKEND_URL=http://localhost:8080/api/auth
```

**⚠️ CRITICAL:** 
- `VITE_AUTH_BACKEND_URL` must include `/api/auth`
- Must restart dev server after changing `.env`

---

## 🎯 Quick Test (30 seconds max)

```
1. Clear localStorage             (5 sec)
2. Click Login                    (2 sec)
3. Enter credentials + submit     (10 sec)
4. Wait for redirect              (3 sec)
5. Watch exchange happen          (5 sec)
6. Redirect to home               (1 sec)
---
TOTAL: ~25 seconds ✅
```

---

## 💡 Pro Tips

1. **Use Incognito Mode** - Clean slate every time
2. **Keep Console Open** - See errors immediately  
3. **Test in Sequence** - Don't click Login multiple times
4. **Use Fresh OTT** - Each login attempt gets new OTT
5. **Check Backend Logs** - See what backend receives

---

## 🆘 Still Not Working?

Share these logs:
1. **Frontend console** - All logs from login click to completion
2. **Backend logs** - Lines with 🔐, 📞, ✅, ❌ emojis
3. **Network tab** - Request/response for `/api/auth/exchange`
4. **localStorage** - `localStorage.getItem('token')`

---

## ✅ Success Criteria

- [x] Login button redirects to SSO
- [x] SSO redirects back with OTT in URL
- [x] Frontend exchanges OTT within 30 seconds
- [x] Backend validates OTT with Nabeel's SSO
- [x] Backend returns JWT
- [x] Frontend saves JWT to localStorage
- [x] Frontend parses user info from JWT
- [x] Navbar shows username and role
- [x] Subsequent API calls include Authorization header

---

**Last Updated:** 2025-11-27  
**Status:** OTT expiration debugging

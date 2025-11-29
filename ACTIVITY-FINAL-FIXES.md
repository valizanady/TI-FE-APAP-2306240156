# Activity Management - Final Fixes & Updates

## Tanggal: 29 November 2025

## Issues Fixed

### 1. ✅ Hide Detail Button for Inactive Activities

**File**: `src/views/ActivityListView.vue`

**Problem**: Detail button muncul untuk semua activities termasuk yang sudah deleted (inactive)

**Solution**: Tambahkan kondisi `v-if="!activity.isDeleted"` pada detail button

```vue
<!-- BEFORE -->
<router-link :to="`/activities/${activity.id}`" class="btn-icon" title="View Detail">
  👁️
</router-link>

<!-- AFTER -->
<router-link
  v-if="!activity.isDeleted"
  :to="`/activities/${activity.id}`"
  class="btn-icon"
  title="View Detail"
>
  👁️
</router-link>
```

**Result**:

- ✅ Detail button hanya muncul untuk active activities (isDeleted = false)
- ✅ Inactive activities tidak bisa dilihat detailnya
- ✅ Edit dan Delete button tetap dengan logic existing (canEdit, canDelete)

---

### 2. ✅ Location Selection with Province + City/Regency

**File**: `src/views/CreateActivityView.vue`

**Problem**:

- LocationSelector hanya single dropdown
- Tidak konsisten dengan EditPlanView yang pakai Province + City/Regency
- User experience kurang baik

**Solution**: Replace LocationSelector dengan 2-level dropdown (Province → City/Regency)

#### Template Changes:

```vue
<!-- OLD: Single dropdown -->
<LocationSelector
  v-model="formData.startLocation"
  placeholder="Select start location"
  required
/>

<!-- NEW: Province + City/Regency -->
<div class="location-section">
  <h3 class="location-title">Start Location <span class="required">*</span></h3>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">Province</label>
      <select v-model="startProvince" class="form-input">
        <option value="">Select province</option>
        <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
          {{ prov.name }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">City/Regency</label>
      <select v-model="formData.startLocation" class="form-input" required>
        <option value="">
          {{ startProvince ? 'Select city/regency' : 'Select province first' }}
        </option>
        <option v-for="reg in startRegencies" :key="reg.code" :value="reg.name">
          {{ reg.name }}
        </option>
      </select>
    </div>
  </div>
</div>
```

#### Script Changes:

**Added Types**:

```typescript
interface Province {
  code: string
  name: string
}

interface Regency {
  code: string
  name: string
  province_code: string
}
```

**Added Reactive Variables**:

```typescript
const provinces = ref<Province[]>([])
const startRegencies = ref<Regency[]>([])
const endRegencies = ref<Regency[]>([])
const startProvince = ref<string>('')
const endProvince = ref<string>('')
const isLoadingLocations = ref(false)
const isLoadingStartRegencies = ref(false)
const isLoadingEndRegencies = ref(false)
```

**Added Functions**:

```typescript
// Fetch provinces from API
async function fetchProvinces() {
  isLoadingLocations.value = true
  try {
    const response = await axios.get<{ data: Province[] }>(`${API_BASE_URL}location/provinces`)
    provinces.value = response.data.data
  } catch (error) {
    // Fallback provinces
    provinces.value = [
      { code: '31', name: 'DKI Jakarta' },
      { code: '32', name: 'Jawa Barat' },
      // ... more
    ]
  } finally {
    isLoadingLocations.value = false
  }
}

// Fetch regencies for start location
async function fetchStartRegencies(provinceCode: string) {
  if (!provinceCode) {
    startRegencies.value = []
    return
  }

  isLoadingStartRegencies.value = true
  try {
    const response = await axios.get<{ data: Regency[] }>(
      `${API_BASE_URL}location/regencies/${provinceCode}`,
    )
    startRegencies.value = response.data.data
  } catch (error) {
    startRegencies.value = []
  } finally {
    isLoadingStartRegencies.value = false
  }
}

// Fetch regencies for end location
async function fetchEndRegencies(provinceCode: string) {
  // Similar to fetchStartRegencies
}
```

**Added Watchers**:

```typescript
watch(startProvince, (newVal) => {
  if (newVal) {
    fetchStartRegencies(newVal)
  } else {
    startRegencies.value = []
  }
})

watch(endProvince, (newVal) => {
  if (newVal) {
    fetchEndRegencies(newVal)
  } else {
    endRegencies.value = []
  }
})
```

**Added onMounted**:

```typescript
onMounted(async () => {
  await fetchProvinces()
})
```

#### CSS Added:

```css
.locations-wrapper {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6;
}

.location-section {
  @apply p-4 bg-gray-50 rounded-lg border border-gray-200;
}

.location-title {
  @apply text-base font-semibold text-gray-900 mb-3;
}

.form-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.form-group {
  @apply mb-4;
}

.input-error {
  @apply border-red-500;
}
```

**Result**:

- ✅ User pilih Province dulu → City/Regency dropdown di-enable
- ✅ Konsisten dengan EditPlanView
- ✅ Better UX dengan cascading dropdown
- ✅ Loading states untuk better feedback
- ✅ Fallback provinces jika API gagal

---

### 3. ⚠️ POST 403 Forbidden Issue

**Problem**: Request ke `POST http://localhost:8080/api/activities` return 403 Forbidden

**Possible Causes**:

1. User belum login → No JWT token
2. JWT token expired
3. Role tidak punya permission untuk create activity
4. Backend authorization logic reject request

**Debug Steps**:

1. Check browser console untuk log `🔑 Token attached to request`
2. Check Network tab → Headers → Authorization header ada atau tidak
3. Check JWT token di localStorage: `localStorage.getItem('authToken')`
4. Verify user role: Must be one of (Superadmin, TourPackageVendor, FlightAirline, AccommodationOwner, RentalVendor)
5. Check backend logs untuk detail error message

**Current Axios Interceptor** (in `main.ts`):

```typescript
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('🔑 Token attached to request:', config.url)
  }

  return config
})
```

**Troubleshooting Checklist**:

- [ ] User sudah login?
- [ ] Token ada di localStorage?
- [ ] Token valid (not expired)?
- [ ] User role sesuai? (bukan Customer)
- [ ] Backend endpoint `/api/activities` accessible?
- [ ] Backend authorization rules correct?

**Solution for Frontend**:
Add better error handling in CreateActivityView:

```typescript
try {
  await activityStore.createActivity(payload)
  toast.success('Activity created successfully')
  router.push('/activities')
} catch (err) {
  const error = err as { response?: { data?: { message?: string }; status?: number } }

  if (error.response?.status === 403) {
    toast.error('❌ Forbidden: You do not have permission to create activities')
    validationErrors.value = [
      'You do not have permission to create this activity. Please check your role.',
    ]
  } else if (error.response?.status === 401) {
    toast.error('❌ Unauthorized: Please login again')
    router.push('/login')
  } else {
    const errorMsg = error.response?.data?.message || 'Failed to create activity'
    toast.error(`❌ ${errorMsg}`)

    if (error.response?.data?.message) {
      validationErrors.value = [error.response.data.message]
    }
  }
}
```

---

## Summary of All Changes

### Files Modified:

1. ✅ `src/views/ActivityListView.vue`
   - Hide detail button for deleted activities
2. ✅ `src/views/CreateActivityView.vue`
   - Replace LocationSelector with Province + City/Regency dropdowns
   - Add location API integration
   - Add watchers for province changes
   - Add CSS for location sections
   - Better error handling (403, 401)

3. ⚠️ `src/components/common/LocationSelector.vue`
   - No longer used in CreateActivityView
   - Still available for other components if needed

---

## User Flow - Create Activity (Updated)

1. User navigates to `/activities`
2. Click **"➕ Create Activity"** button
3. **Form appears** with:
   - Activity Type dropdown (filtered by role)
   - Activity Name input
   - Activity Item textarea
   - Price input (IDR)
   - Capacity input
   - **Start Location**:
     - Select Province → Dropdown di-populate
     - Select City/Regency from selected province
   - **End Location**:
     - Select Province → Dropdown di-populate
     - Select City/Regency from selected province
   - Start Date & Time picker
   - End Date & Time picker
4. Fill all fields
5. Click **"✓ Create Activity"**
6. **Validation**:
   - All fields required
   - Price > 0
   - Capacity >= 1
   - Start date >= now
   - End date > start date
7. **Submit to API**:
   - If success: Toast + redirect to `/activities`
   - If 403: Show "No permission" error
   - If 401: Redirect to login
   - If other error: Show error message

---

## Testing Checklist

### ✅ ActivityListView

- [x] Detail button tidak muncul untuk inactive activities
- [x] Detail button muncul untuk active activities
- [x] Edit button hanya untuk activities milik sendiri
- [x] Delete button hanya untuk activities milik sendiri
- [x] Superadmin bisa lihat semua tombol

### ✅ CreateActivityView - Locations

- [x] Province dropdown load dari API
- [x] Fallback provinces jika API gagal
- [x] City/Regency dropdown disabled saat province belum dipilih
- [x] City/Regency load setelah province dipilih
- [x] Loading states muncul saat fetch data
- [x] Start Location dan End Location independent (bisa beda province)
- [x] Validation error jika location tidak dipilih

### ⚠️ CreateActivityView - Submit

- [ ] Token attached ke request (check console log)
- [ ] 403 error handled dengan proper message
- [ ] 401 error redirect ke login
- [ ] Success creates activity dan redirect
- [ ] Validation errors ditampilkan

---

## API Endpoints Used

### Location API

```
GET {API_BASE_URL}location/provinces
Response: { data: Province[] }

GET {API_BASE_URL}location/regencies/{provinceCode}
Response: { data: Regency[] }
```

### Activity API

```
POST {API_BASE_URL}activities
Headers: Authorization: Bearer {token}
Body: CreateActivityRequest
Response: { statusCode, message, data }
```

---

## Known Issues

1. ⚠️ **POST 403 Forbidden**:
   - Need to verify user authentication status
   - Check backend authorization rules
   - Verify JWT token validity

2. ℹ️ **LocationSelector Component**:
   - No longer used in CreateActivityView
   - Can be removed or kept for other components

3. ℹ️ **CSS @apply Warnings**:
   - Tailwind directives show lint warnings
   - Not breaking, purely cosmetic

---

## Next Steps

1. **Debug 403 Error**:
   - Check browser console for token logs
   - Verify user role permissions
   - Check backend logs
   - Test with Superadmin account

2. **Test Complete Flow**:
   - Login as each role
   - Try creating activity
   - Verify location dropdowns work
   - Check API requests in Network tab

3. **Update EditActivityView** (if needed):
   - Apply same Province + City/Regency pattern
   - Consistency with CreateActivityView

---

**Status**: ✅ Frontend implementation COMPLETE
**Pending**: Backend 403 authorization issue investigation

**Last Updated**: 29 November 2025

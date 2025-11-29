# Activity Management - Create & Edit Form Update

## Tanggal Update: 29 November 2025

## Update Summary

### 1. LocationSelector Component

**File**: `src/components/common/LocationSelector.vue`

**Fitur**:

- ✅ Dropdown component untuk memilih lokasi
- ✅ Auto-load data provinsi dari wilayah.id API
- ✅ Fallback ke list kota populer jika API gagal
- ✅ Support v-model untuk two-way binding
- ✅ Props: `modelValue`, `placeholder`, `required`, `disabled`

**Locations Available**:

- Dari API: Semua provinsi Indonesia
- Fallback: Jakarta, Bali, Yogyakarta, Bandung, Surabaya, Medan, Makassar, Semarang, Palembang, Lombok, Manado, Batam

---

### 2. Create Activity Form Updates

**File**: `src/views/CreateActivityView.vue`

#### Perbaikan yang Dilakukan:

##### a. Activity Type Selection

**BEFORE**:

- Default value: `'Flight'` (hardcoded)
- TourPackageVendor hanya bisa pilih 'Tour Activity'
- Type tidak muncul di dropdown untuk beberapa role

**AFTER**:

```typescript
activityType: '' // Empty string, no default
```

- ✅ Tidak ada default value, user harus pilih
- ✅ **TourPackageVendor dapat memilih SEMUA tipe** (Flight, Accommodation, Vehicle Rental, Tour Activity)
- ✅ FlightAirline: Hanya Flight
- ✅ AccommodationOwner: Hanya Accommodation
- ✅ RentalVendor: Hanya Vehicle Rental
- ✅ Superadmin: Semua tipe

##### b. Location Fields

**BEFORE**:

```vue
<input type="text" v-model="formData.startLocation" />
```

**AFTER**:

```vue
<LocationSelector v-model="formData.startLocation" required />
```

- ✅ Dropdown dengan list provinsi Indonesia
- ✅ Required validation
- ✅ Consistent location names

##### c. Validation - Start Date

**NEW**: Validasi startDate >= now

```typescript
if (start < now) {
  validationErrors.value.push('Start date must be now or in the future')
}
```

- ✅ Tidak bisa membuat activity dengan tanggal di masa lalu

##### d. Error Feedback from API

**NEW**: Display API validation errors

```typescript
if (error.response?.data?.message) {
  validationErrors.value = [error.response.data.message]
}
```

- ✅ Tampilkan pesan error dari backend di form
- ✅ Toast notification untuk error umum

##### e. Success Message

**BEFORE**: `'✅ Activity created successfully!'`
**AFTER**: `'Activity created successfully'`

- ✅ Sesuai requirement (tanpa emoji)

---

### 3. Edit Activity Form Updates

**File**: `src/views/EditActivityView.vue`

#### Perbaikan:

- ✅ LocationSelector untuk startLocation dan endLocation (sama seperti create)
- ✅ Import LocationSelector component

---

## Form Validation Summary

### Client-Side Validation:

1. ✅ **Activity Type**: Required (tidak boleh kosong)
2. ✅ **Activity Name**: Required (tidak boleh kosong)
3. ✅ **Activity Item**: Required (tidak boleh kosong)
4. ✅ **Price**: Required, must be > 0
5. ✅ **Capacity**: Required, must be >= 1
6. ✅ **Start Location**: Required (dari dropdown)
7. ✅ **End Location**: Required (dari dropdown)
8. ✅ **Start Date**: Required, must be >= now (untuk create)
9. ✅ **End Date**: Required, must be > startDate

### Server-Side Validation:

- ✅ Ditangani oleh backend API
- ✅ Error message ditampilkan di form
- ✅ Toast notification untuk feedback

---

## Role-Based Activity Type Access

| Role                   | Allowed Activity Types                                  |
| ---------------------- | ------------------------------------------------------- |
| **Superadmin**         | Flight, Accommodation, Vehicle Rental, Tour Activity    |
| **TourPackageVendor**  | Flight, Accommodation, Vehicle Rental, Tour Activity ⭐ |
| **FlightAirline**      | Flight                                                  |
| **AccommodationOwner** | Accommodation                                           |
| **RentalVendor**       | Vehicle Rental                                          |

⭐ **IMPORTANT**: TourPackageVendor sekarang dapat membuat SEMUA tipe activity, bukan hanya Tour Activity.

---

## User Flow

### Create Activity:

1. User klik **"➕ Create Activity"** di halaman Activity List
2. Form muncul dengan semua field kosong
3. User pilih **Activity Type** dari dropdown (sesuai role)
4. User isi **Activity Name**, **Activity Item**
5. User isi **Price** (>0) dan **Capacity** (>=1)
6. User pilih **Start Location** dari dropdown provinsi
7. User pilih **End Location** dari dropdown provinsi
8. User pilih **Start Date** (>= now) dan **End Date** (> start date)
9. Klik **"✓ Create Activity"**
10. Validasi client-side berjalan
11. Jika valid, submit ke API
12. Jika sukses: Toast "Activity created successfully" + redirect ke /activities
13. Jika error: Tampilkan error message di form

### Edit Activity:

1. User klik **"✏️ Edit"** di detail atau list page
2. Form muncul dengan data existing
3. **Activity Type READONLY** (tidak bisa diubah)
4. User edit field lain (sama seperti create)
5. Validasi dan submit (sama seperti create)

---

## Testing Checklist

### ✅ Activity Type Dropdown

- [x] Superadmin: Tampil 4 tipe
- [x] TourPackageVendor: Tampil 4 tipe (Flight, Accommodation, Vehicle Rental, Tour Activity)
- [x] FlightAirline: Tampil 1 tipe (Flight)
- [x] AccommodationOwner: Tampil 1 tipe (Accommodation)
- [x] RentalVendor: Tampil 1 tipe (Vehicle Rental)
- [x] Default value kosong, user harus pilih

### ✅ LocationSelector

- [x] Load provinsi dari API
- [x] Tampil dropdown dengan list provinsi
- [x] Bisa select start location
- [x] Bisa select end location
- [x] Fallback ke list kota jika API gagal

### ✅ Validations

- [x] Activity type required
- [x] All fields required
- [x] Price > 0
- [x] Capacity >= 1
- [x] Start date >= now (create only)
- [x] End date > start date
- [x] Tampil error message jika ada yang tidak valid

### ✅ Submit & Feedback

- [x] Loading state saat submit
- [x] Success toast message
- [x] Error toast message
- [x] API error ditampilkan di form
- [x] Redirect ke /activities setelah sukses

---

## Known Issues / Notes

1. ⚠️ **CSS @apply warnings**: Tailwind directives show lint warnings (cosmetic, tidak breaking)
2. ℹ️ **LocationSelector API**: Menggunakan wilayah.id public API, ada fallback jika gagal
3. ℹ️ **Edit form**: startDate validation (>= now) tidak digunakan karena bisa edit activity yang sudah lewat

---

## Files Modified

```
src/
├── components/
│   └── common/
│       └── LocationSelector.vue      # NEW - Dropdown lokasi
├── views/
│   ├── CreateActivityView.vue        # UPDATED - Fix type dropdown, validation, LocationSelector
│   └── EditActivityView.vue          # UPDATED - LocationSelector
```

---

## Migration Notes untuk Developer

Jika Anda sudah punya CreateActivityView.vue atau EditActivityView.vue di environment lain:

1. **Import LocationSelector**:

```typescript
import LocationSelector from '@/components/common/LocationSelector.vue'
```

2. **Replace location input dengan LocationSelector**:

```vue
<!-- OLD -->
<input v-model="formData.startLocation" type="text" />

<!-- NEW -->
<LocationSelector v-model="formData.startLocation" required />
```

3. **Update TourPackageVendor types**:

```typescript
// OLD
TourPackageVendor: ['Tour Activity']

// NEW
TourPackageVendor: ['Flight', 'Accommodation', 'Vehicle Rental', 'Tour Activity']
```

4. **Add startDate >= now validation**:

```typescript
if (start < now) {
  validationErrors.value.push('Start date must be now or in the future')
}
```

---

**Status**: ✅ COMPLETED
**Last Updated**: 29 November 2025

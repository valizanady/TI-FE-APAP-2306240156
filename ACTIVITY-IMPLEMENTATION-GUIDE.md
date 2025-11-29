# 🏃 Activity Management Implementation Guide

## ✅ What Has Been Implemented

### 1. TypeScript Interfaces ✅

**File:** `src/interfaces/activity.interface.ts`

Includes:

- `Activity` interface with all fields including `isDeleted` and `vendorId`
- `CreateActivityRequest` DTO
- `UpdateActivityRequest` DTO (without activityType)
- `ActivityFilters` for search and filtering
- Updated `OrderedActivity` interface

### 2. Activity Service ✅

**File:** `src/services/activity.service.ts`

Methods:

- `getAllActivities(filters?)` - Get all activities with optional filters
- `getActivityById(id)` - Get activity detail
- `createActivity(data)` - Create new activity
- `updateActivity(id, data)` - Update activity
- `deleteActivity(id)` - Soft delete activity

### 3. Activity Store ✅

**File:** `src/stores/activity.ts`

State management with Pinia:

- State: activities list, current activity, loading, error
- Getters: filtered activities, locations, types
- Actions: CRUD operations with auto-refresh

---

## 📋 Next Steps - What You Need to Implement

### Step 1: Create Activity List View

**File to create:** `src/views/ActivityListView.vue`

**Key features needed:**

1. Table with columns: Activity Name, Type, Location, Price, Capacity, Dates, Status, Actions
2. Filters:
   - Activity Type dropdown
   - Search bar (name/item)
   - Show deleted checkbox
3. Action buttons:
   - View Detail (all users)
   - Edit (own activities or Superadmin)
   - Delete (own activities or Superadmin)
4. Create Activity button (for vendors)
5. Role-based access control:
   - Show only appropriate buttons based on user role
   - Check `vendorId` matches current user ID

**Role permissions:**

```typescript
const userRole = computed(() => authStore.getUserRole)
const userId = computed(() => authStore.getUserId)

const canCreate = computed(() => {
  return [
    'Superadmin',
    'TourPackageVendor',
    'FlightAirline',
    'AccommodationOwner',
    'RentalVendor',
  ].includes(userRole.value)
})

const canEdit = (activity: Activity) => {
  if (activity.isDeleted) return false
  if (userRole.value === 'Superadmin') return true
  return activity.vendorId === userId.value
}

const canDelete = (activity: Activity) => {
  if (activity.isDeleted) return false
  if (userRole.value === 'Superadmin') return true
  return activity.vendorId === userId.value
}
```

### Step 2: Create Activity Detail View

**File to create:** `src/views/ActivityDetailView.vue`

**Features:**

1. Display all activity information:
   - Activity ID, Name, Type, Item
   - Price, Capacity
   - Start Date/Time, End Date/Time
   - Start Location, End Location
   - Status (Active/Inactive based on isDeleted)
2. Action buttons:
   - Edit Activity (if user is owner or Superadmin)
   - Delete Activity (if user is owner or Superadmin)
   - Back to List button
3. Show warning if activity has ordered activities

**Example structure:**

```vue
<template>
  <div class="activity-detail">
    <div class="header">
      <h1>{{ activity?.activityName }}</h1>
      <div class="actions">
        <button v-if="canEdit" @click="editActivity">✏️ Edit</button>
        <button v-if="canDelete" @click="confirmDelete">🗑️ Delete</button>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <label>Activity ID</label>
        <span>{{ activity?.id }}</span>
      </div>
      <!-- More info items -->
    </div>
  </div>
</template>
```

### Step 3: Create Location Selector Component

**File to create:** `src/components/activity/LocationSelector.vue`

**Purpose:** Reusable dropdown component for selecting locations

**Features:**

1. Fetch locations from Location Service API
2. Dropdown with search/filter
3. Props: `modelValue`, `label`, `placeholder`, `required`
4. Emit: `update:modelValue`

**Location Service API:**

```typescript
// Add to src/services/location.service.ts (already exists)
async getAllLocations(): Promise<string[]> {
  const url = `${BASE_URL}location`
  const res = await axios.get(url)
  return res.data.data.map((loc: any) => loc.locationName)
}
```

### Step 4: Create Activity Form View

**File to create:** `src/views/CreateActivityView.vue` and `src/views/EditActivityView.vue`

**Create Activity Form fields:**

1. Activity Type (dropdown) - filtered by user role
2. Activity Name (text input)
3. Activity Item (text input)
4. Price (number input, min=1)
5. Capacity (number input, min=1)
6. Start Date & Time (datetime-local)
7. End Date & Time (datetime-local)
8. Start Location (LocationSelector component)
9. End Location (LocationSelector component)

**Role-based Activity Type filter:**

```typescript
const availableTypes = computed(() => {
  const role = authStore.user?.role

  if (role === 'Superadmin' || role === 'TourPackageVendor') {
    return ['Flight', 'Accommodation', 'Vehicle Rental', 'Tour Activity']
  }

  if (role === 'FlightAirline') return ['Flight']
  if (role === 'AccommodationOwner') return ['Accommodation']
  if (role === 'RentalVendor') return ['Vehicle Rental']

  return []
})
```

**Validations:**

```typescript
const validateForm = () => {
  // All fields required
  if (!form.activityName || !form.activityType || /* ... */) {
    error.value = 'All fields are required'
    return false
  }

  // Price > 0
  if (form.price <= 0) {
    error.value = 'Price must be greater than 0'
    return false
  }

  // Capacity > 0
  if (form.capacity <= 0) {
    error.value = 'Capacity must be greater than 0'
    return false
  }

  // Start date < End date
  if (new Date(form.startDate) >= new Date(form.endDate)) {
    error.value = 'Start date must be before end date'
    return false
  }

  // Start date >= now
  if (new Date(form.startDate) < new Date()) {
    error.value = 'Start date cannot be in the past'
    return false
  }

  return true
}
```

**Edit Activity differences:**

1. Activity Type field is **disabled/readonly**
2. Show message: "⚠️ Activity type cannot be changed after creation"
3. Form is pre-filled with activity data
4. Use `updateActivity` instead of `createActivity`

### Step 5: Add Routes

**File to modify:** `src/router/index.ts`

Add these routes:

```typescript
{
  path: '/activities',
  name: 'activities',
  component: () => import('@/views/ActivityListView.vue'),
  meta: {
    title: 'Activities',
    requiresAuth: true,
  },
},
{
  path: '/activities/create',
  name: 'activities-create',
  component: () => import('@/views/CreateActivityView.vue'),
  meta: {
    title: 'Create Activity',
    requiresAuth: true,
    requiresRole: ['Superadmin', 'TourPackageVendor', 'FlightAirline', 'AccommodationOwner', 'RentalVendor'],
  },
},
{
  path: '/activities/:id',
  name: 'activities-detail',
  component: () => import('@/views/ActivityDetailView.vue'),
  meta: {
    title: 'Activity Detail',
    requiresAuth: true,
  },
},
{
  path: '/activities/:id/edit',
  name: 'activities-edit',
  component: () => import('@/views/EditActivityView.vue'),
  meta: {
    title: 'Edit Activity',
    requiresAuth: true,
    requiresRole: ['Superadmin', 'TourPackageVendor', 'FlightAirline', 'AccommodationOwner', 'RentalVendor'],
  },
},
```

### Step 6: Add Navbar Link

**File to modify:** `src/layout/VNavbar.vue`

Add this link:

```vue
<RouterLink to="/activities" class="nav-link" :class="{ active: route.name === 'activities' }">
  🏃 Activities
</RouterLink>
```

---

## 🎨 Design Guidelines

### Color Scheme for Activity Types

```css
.badge-flight {
  background: #e3f2fd;
  color: #1976d2;
}
.badge-accommodation {
  background: #e8f5e9;
  color: #388e3c;
}
.badge-rental {
  background: #fff3e0;
  color: #f57c00;
}
.badge-tour {
  background: #f3e5f5;
  color: #7b1fa2;
}
```

### Status Badges

```css
.status-active {
  background: #e8f5e9;
  color: #388e3c;
}
.status-inactive {
  background: #ffebee;
  color: #c62828;
}
```

### Responsive Breakpoints

```css
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  .activity-table {
    font-size: 0.875rem;
  }
}
```

---

## 🧪 Testing Checklist

### Create Activity

- [ ] Form validation works for all fields
- [ ] Cannot select activity type if vendor doesn't have permission
- [ ] Cannot set start date in the past
- [ ] Cannot set end date before start date
- [ ] Price and capacity must be > 0
- [ ] Success message shows after creation
- [ ] Activity appears in list after creation
- [ ] LocationSelector loads locations properly

### Update Activity

- [ ] Activity type field is disabled/read-only
- [ ] Only vendor who created can edit (except Superadmin)
- [ ] Cannot edit deleted activities
- [ ] Validations work same as create
- [ ] Success message shows after update
- [ ] Changes reflect in list and detail view

### Delete Activity

- [ ] Confirmation modal appears
- [ ] Only vendor who created can delete (except Superadmin)
- [ ] Cannot delete if has unfulfilled orders (show error)
- [ ] Activity marked as inactive after delete
- [ ] Deleted activity doesn't appear in list (if filter active)

### List View

- [ ] Shows all active activities by default
- [ ] Filter by activity type works
- [ ] Search by name/item works
- [ ] Show deleted checkbox works
- [ ] Edit/Delete buttons only show for authorized users
- [ ] Deleted activities are grayed out when shown
- [ ] Create button only shows for vendors

### Detail View

- [ ] All information displayed correctly
- [ ] Edit/Delete buttons only show for authorized users
- [ ] Cannot view deleted activities (404)
- [ ] Back to list button works

---

## 🚨 Error Handling

### Common API Errors

**403 Forbidden - Wrong Vendor Type**

```json
{
  "status": 403,
  "message": "Flight vendor can only create Flight activities"
}
```

**Solution:** Check user role and filter activity types accordingly

**400 Bad Request - Validation Error**

```json
{
  "status": 400,
  "message": "Start date must be before end date"
}
```

**Solution:** Validate form before submission

**400 Bad Request - Cannot Delete**

```json
{
  "status": 400,
  "message": "Cannot delete activity that has unfulfilled orderedActivities"
}
```

**Solution:** Show clear error message to user

---

## 📝 Implementation Priority

1. ✅ **DONE**: Interfaces, Service, Store
2. **HIGH**: Activity List View (most used page)
3. **HIGH**: Create Activity Form
4. **MEDIUM**: Activity Detail View
5. **MEDIUM**: Edit Activity Form
6. **MEDIUM**: Location Selector Component
7. **LOW**: Router & Navbar updates
8. **LOW**: Testing & Polish

---

## 💡 Tips

1. **Reuse Components**: Use the same form component for Create and Edit, just pass an `isEdit` prop
2. **Loading States**: Always show loading spinner during API calls
3. **Error Messages**: Display clear, user-friendly error messages
4. **Confirmation Modals**: Use for destructive actions (delete)
5. **Toast Notifications**: Use vue-sonner for success/error messages
6. **Date Formatting**: Use Intl.DateTimeFormat for consistent date display
7. **Currency Formatting**: Use Intl.NumberFormat for price display

---

## 🔗 Useful Links

- Backend API Documentation: (in the guide you provided)
- Location Service: `src/services/location.service.ts` (already exists)
- Auth Store: `src/stores/auth.ts` (for user role and ID)
- Common Response Interface: `src/interfaces/common.response.interface.ts`

---

**Status:** Interfaces, Service, and Store completed ✅  
**Next:** Implement the Vue components and views  
**Last Updated:** November 29, 2025

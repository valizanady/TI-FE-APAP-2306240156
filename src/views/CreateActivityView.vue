<template>
  <div class="activity-create-container">
    <div class="activity-create-wrapper">
      <!-- Gradient Header -->
      <div class="activity-header-gradient">
        <div class="header-content">
          <div class="header-text">
            <h1 class="activity-title">➕ Create New Activity</h1>
            <p class="activity-subtitle">Fill in the details to create a new activity</p>
          </div>
          <router-link to="/activities" class="btn-back-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Activities
          </router-link>
        </div>
      </div>

  <!-- Form Card -->
  <form @submit.prevent="submitForm" class="form-card">
        <!-- Activity Type -->
        <div class="form-group">
          <label class="form-label required">Activity Type</label>
          <div class="input-icon-group">
            <select v-model="formData.activityType" class="form-input" required>
              <option value="">Select Activity Type</option>
              <option v-for="type in allowedActivityTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <span v-if="formData.activityType" class="type-icon">{{ getTypeIcon(formData.activityType) }}</span>
          </div>
          <p class="form-hint">Select the type of activity you want to create</p>
        </div>

        <!-- Activity Name -->
        <div class="form-group">
          <label class="form-label required">Activity Name</label>
          <input
            v-model="formData.activityName"
            type="text"
            class="form-input"
            placeholder="e.g., Garuda Indonesia Flight, Hilton Hotel, Toyota Rental"
            required
            maxlength="100"
          />
          <p class="form-hint">Enter a descriptive name for this activity</p>
        </div>

        <!-- Activity Item/Description -->
        <div class="form-group">
          <label class="form-label required">Item/Description</label>
          <textarea
            v-model="formData.activityItem"
            class="form-input"
            rows="3"
            placeholder="e.g., Jakarta to Bali direct flight, Deluxe room with breakfast"
            required
            maxlength="500"
          ></textarea>
          <p class="form-hint">Provide detailed description of the activity</p>
        </div>

        <!-- Price & Capacity -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">Price (IDR)</label>
            <div class="input-icon-group">
              <input
                v-model.number="formData.price"
                type="number"
                class="form-input"
                placeholder="100000"
                required
                min="0"
                step="1000"
              />
              <span class="input-icon">💰</span>
            </div>
            <p class="form-hint">Price per person in Indonesian Rupiah</p>
          </div>
          <div class="form-group">
            <label class="form-label required">Capacity</label>
            <div class="input-icon-group">
              <input
                v-model.number="formData.capacity"
                type="number"
                class="form-input"
                placeholder="50"
                required
                min="1"
              />
              <span class="input-icon">👥</span>
            </div>
            <p class="form-hint">Maximum number of people</p>
          </div>
        </div>

  <!-- Locations -->
  <div class="locations-wrapper">
          <!-- Start Location Section -->
          <div class="location-section">
            <h3 class="location-title">Start Location <span class="required">*</span></h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Province</label>
                <select
                  v-model="startProvince"
                  class="form-input"
                  :disabled="isLoadingLocations"
                  @change="handleStartProvinceChange"
                >
                  <option value="">
                    {{ isLoadingLocations ? 'Loading provinces...' : 'Select province' }}
                  </option>
                  <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
                    {{ prov.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">City/Regency</label>
                <select
                  v-model="formData.startLocation"
                  class="form-input"
                  :class="{
                    'input-error': validationErrors.includes('Start location is required'),
                  }"
                  :disabled="!startProvince || isLoadingStartRegencies"
                  required
                >
                  <option value="">
                    {{
                      isLoadingStartRegencies
                        ? 'Loading cities...'
                        : startProvince
                          ? 'Select city/regency'
                          : 'Select province first'
                    }}
                  </option>
                  <option v-for="reg in startRegencies" :key="reg.code" :value="reg.name">
                    {{ reg.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- End Location Section -->
          <div class="location-section">
            <h3 class="location-title">End Location <span class="required">*</span></h3>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Province</label>
                <select
                  v-model="endProvince"
                  class="form-input"
                  :disabled="isLoadingLocations"
                  @change="handleEndProvinceChange"
                >
                  <option value="">
                    {{ isLoadingLocations ? 'Loading provinces...' : 'Select province' }}
                  </option>
                  <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
                    {{ prov.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">City/Regency</label>
                <select
                  v-model="formData.endLocation"
                  class="form-input"
                  :class="{ 'input-error': validationErrors.includes('End location is required') }"
                  :disabled="!endProvince || isLoadingEndRegencies"
                  required
                >
                  <option value="">
                    {{
                      isLoadingEndRegencies
                        ? 'Loading cities...'
                        : endProvince
                          ? 'Select city/regency'
                          : 'Select province first'
                    }}
                  </option>
                  <option v-for="reg in endRegencies" :key="reg.code" :value="reg.name">
                    {{ reg.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Date & Time -->
        <div class="form-row">
          <div class="form-group">
            <label class="form-label required">Start Date & Time</label>
            <div class="input-icon-group">
              <input v-model="formData.startDate" type="datetime-local" class="form-input" required />
              <span class="input-icon">🕒</span>
            </div>
            <p class="form-hint">When does the activity start?</p>
          </div>
          <div class="form-group">
            <label class="form-label required">End Date & Time</label>
            <div class="input-icon-group">
              <input
                v-model="formData.endDate"
                type="datetime-local"
                class="form-input"
                required
                :min="formData.startDate"
              />
              <span class="input-icon">🕒</span>
            </div>
            <p class="form-hint">When does the activity end?</p>
          </div>
        </div>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length > 0" class="error-card">
          <h4 class="error-title">⚠️ Please fix the following errors:</h4>
          <ul class="error-list">
            <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="form-actions">
          <button type="submit" :disabled="activityStore.isLoading" class="btn-primary">
            <span v-if="activityStore.isLoading">Creating...</span>
            <span v-else>✓ Create Activity</span>
          </button>
          <router-link to="/activities" class="btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Icon helper for activity type
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    Flight: '✈️',
    Accommodation: '🏨',
    'Vehicle Rental': '🚗',
    'Tour Activity': '🎯',
  }
  return icons[type] || '📋'
}
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import axios from 'axios'
import type { CreateActivityRequest } from '@/interfaces/activity.interface'

// Types for location API
interface Province {
  code: string
  name: string
}

interface Regency {
  code: string
  name: string
  province_code: string
}

const router = useRouter()
const activityStore = useActivityStore()
const authStore = useAuthStore()

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Location API states
const provinces = ref<Province[]>([])
const startRegencies = ref<Regency[]>([])
const endRegencies = ref<Regency[]>([])
const startProvince = ref<string>('')
const endProvince = ref<string>('')
const isLoadingLocations = ref(false)
const isLoadingStartRegencies = ref(false)
const isLoadingEndRegencies = ref(false)

// Form data
const formData = ref<CreateActivityRequest>({
  activityName: '',
  activityItem: '',
  activityType: '' as 'Flight' | 'Accommodation' | 'Vehicle Rental' | 'Tour Activity',
  capacity: 1,
  price: 0,
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: '',
})

const validationErrors = ref<string[]>([])

// Role-based activity type filtering
const allowedActivityTypes = computed(() => {
  const role = authStore.user?.role

  const typeMapping: Record<string, string[]> = {
    Superadmin: ['Flight', 'Accommodation', 'Vehicle Rental', 'Tour Activity'],
    FlightAirline: ['Flight'],
    AccommodationOwner: ['Accommodation'],
    RentalVendor: ['Vehicle Rental'],
    TourPackageVendor: ['Flight', 'Accommodation', 'Vehicle Rental', 'Tour Activity'], // Can create all types
  }

  return role ? typeMapping[role] || [] : []
})

// Fetch provinces
async function fetchProvinces() {
  isLoadingLocations.value = true
  try {
    const response = await axios.get<{ data: Province[] }>(`${API_BASE_URL}location/provinces`)
    provinces.value = response.data.data
    console.log('✅ Provinces loaded:', provinces.value.length)
  } catch (error) {
    console.error('❌ Failed to load provinces:', error)
    // Fallback provinces
    provinces.value = [
      { code: '31', name: 'DKI Jakarta' },
      { code: '32', name: 'Jawa Barat' },
      { code: '33', name: 'Jawa Tengah' },
      { code: '35', name: 'Jawa Timur' },
      { code: '51', name: 'Bali' },
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
    console.log('✅ Start regencies loaded:', startRegencies.value.length)
  } catch (error) {
    console.error('❌ Failed to load start regencies:', error)
    startRegencies.value = []
  } finally {
    isLoadingStartRegencies.value = false
  }
}

// Fetch regencies for end location
async function fetchEndRegencies(provinceCode: string) {
  if (!provinceCode) {
    endRegencies.value = []
    return
  }

  isLoadingEndRegencies.value = true
  try {
    const response = await axios.get<{ data: Regency[] }>(
      `${API_BASE_URL}location/regencies/${provinceCode}`,
    )
    endRegencies.value = response.data.data
    console.log('✅ End regencies loaded:', endRegencies.value.length)
  } catch (error) {
    console.error('❌ Failed to load end regencies:', error)
    endRegencies.value = []
  } finally {
    isLoadingEndRegencies.value = false
  }
}

// Watch province changes
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

// Handler methods for province changes
const handleStartProvinceChange = () => {
  startRegencies.value = []
  formData.value.startLocation = ''
}

const handleEndProvinceChange = () => {
  endRegencies.value = []
  formData.value.endLocation = ''
}

// Load provinces on mount
onMounted(async () => {
  await fetchProvinces()
})

// Validate form
const validateForm = (): boolean => {
  validationErrors.value = []

  if (!formData.value.activityType) {
    validationErrors.value.push('Activity type is required')
  }

  if (!formData.value.activityName.trim()) {
    validationErrors.value.push('Activity name is required')
  }

  if (!formData.value.activityItem.trim()) {
    validationErrors.value.push('Activity item/description is required')
  }

  if (formData.value.price <= 0) {
    validationErrors.value.push('Price must be greater than 0')
  }

  if (formData.value.capacity < 1) {
    validationErrors.value.push('Capacity must be at least 1')
  }

  if (!formData.value.startLocation.trim()) {
    validationErrors.value.push('Start location is required')
  }

  if (!formData.value.endLocation.trim()) {
    validationErrors.value.push('End location is required')
  }

  if (!formData.value.startDate) {
    validationErrors.value.push('Start date is required')
  }

  if (!formData.value.endDate) {
    validationErrors.value.push('End date is required')
  }

  // Validate date range
  if (formData.value.startDate && formData.value.endDate) {
    const start = new Date(formData.value.startDate)
    const end = new Date(formData.value.endDate)
    const now = new Date()

    // Check if start date is in the past
    if (start < now) {
      validationErrors.value.push('Start date must be now or in the future')
    }

    if (end <= start) {
      validationErrors.value.push('End date must be after start date')
    }
  }

  return validationErrors.value.length === 0
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  try {
    // Convert datetime-local to ISO format
    const payload: CreateActivityRequest = {
      ...formData.value,
      startDate: new Date(formData.value.startDate).toISOString(),
      endDate: new Date(formData.value.endDate).toISOString(),
    }

    await activityStore.createActivity(payload)
    toast.success('Activity created successfully')
    router.push('/activities')
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const errorMsg = error.response?.data?.message || 'Failed to create activity'
    toast.error(`❌ ${errorMsg}`)

    // Display API validation errors if available
    if (error.response?.data?.message) {
      validationErrors.value = [error.response.data.message]
    }
  }
}
</script>

<style scoped>
/* Gradient Header */
.activity-create-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  padding: 2rem;
}

.activity-create-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.activity-header-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.activity-title {
  font-size: 2.25rem;
  font-weight: 800;
  margin: 0;
}

.activity-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.btn-back-white {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #6366f1;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-back-white:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}
.btn-icon {
  width: 20px;
  height: 20px;
}

/* Form Card */
.form-card {
  background-color: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.input-icon-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.input-icon {
  font-size: 1.25rem;
  color: #6366f1;
  background: #f3f4f6;
  border-radius: 0.375rem;
  padding: 0.25rem 0.5rem;
}
.type-icon {
  font-size: 1.5rem;
  margin-left: 0.5rem;
}

/* Error Card */
.error-card {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
}
.error-title {
  color: #991b1b;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.error-list {
  color: #dc2626;
  font-size: 0.95rem;
  margin: 0;
  padding-left: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .activity-create-container {
    padding: 1rem;
  }
  .activity-header-gradient {
    padding: 1.25rem;
  }
  .form-card {
    padding: 1rem;
  }
  .form-actions {
    flex-direction: column-reverse;
  }
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-label.required::after {
  content: ' *';
  @apply text-red-500;
}

.form-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors;
}

.form-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed;
}

.input-error {
  @apply border-red-500;
}

.form-hint {
  @apply text-xs text-gray-500 mt-1;
}

.form-group {
  @apply mb-4;
}

.form-row {
  @apply grid grid-cols-1 md:grid-cols-2 gap-4;
}

.locations-wrapper {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6;
}

.location-section {
  @apply p-4 bg-gray-50 rounded-lg border border-gray-200;
}

.location-title {
  @apply text-base font-semibold text-gray-900 mb-3;
}

.location-title .required {
  @apply text-red-500;
}

.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center;
}
</style>

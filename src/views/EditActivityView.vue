<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="activityStore.isLoading && !activity" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
        <p class="text-gray-600 mt-4">Loading activity...</p>
      </div>

      <!-- Activity not found or error -->
      <div v-else-if="!activity" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-red-800 font-semibold mb-2">⚠️ Activity Not Found</h3>
        <p class="text-red-600">
          The activity you're trying to edit doesn't exist or has been deleted.
        </p>
        <router-link to="/activities" class="btn-secondary mt-4 inline-block">
          ← Back to Activities
        </router-link>
      </div>

      <!-- Edit Form -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-2">
            <router-link
              :to="`/activities/${activity.id}`"
              class="text-gray-600 hover:text-gray-900"
            >
              ← Back
            </router-link>
            <h1 class="text-3xl font-bold text-gray-900">✏️ Edit Activity</h1>
          </div>
          <p class="text-gray-600">Update the activity details</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <!-- Activity Type (Readonly) -->
          <div>
            <label class="form-label">Activity Type</label>
            <div class="readonly-field">
              <span :class="typeColorClass(activity.activityType)" class="type-badge">
                {{ activity.activityType }}
              </span>
              <span class="text-sm text-gray-500 ml-2"> (Activity type cannot be changed) </span>
            </div>
            <p class="form-hint">Activity type is set at creation and cannot be modified</p>
          </div>

          <!-- Activity Name -->
          <div>
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
          <div>
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Price -->
            <div>
              <label class="form-label required">Price (IDR)</label>
              <input
                v-model.number="formData.price"
                type="number"
                class="form-input"
                placeholder="100000"
                required
                min="0"
                step="1000"
              />
              <p class="form-hint">Price per person in Indonesian Rupiah</p>
            </div>

            <!-- Capacity -->
            <div>
              <label class="form-label required">Capacity</label>
              <input
                v-model.number="formData.capacity"
                type="number"
                class="form-input"
                placeholder="50"
                required
                min="1"
              />
              <p class="form-hint">Maximum number of people</p>
            </div>
          </div>

          <!-- Locations -->
          <div class="locations-wrapper">
            <!-- Start Location Section -->
            <div class="location-section">
              <h3 class="location-title">Start Location <span class="text-red-500">*</span></h3>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Province</label>
                  <select
                    v-model="startProvince"
                    class="form-input"
                    :disabled="isLoadingLocations"
                  >
                    <option value="">
                      {{ isLoadingLocations ? 'Loading provinces...' : 'Select province' }}
                    </option>
                    <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
                      {{ prov.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="form-label">City/Regency</label>
                  <select
                    v-model="formData.startLocation"
                    class="form-input"
                    :class="{ 'border-red-500': startLocationError }"
                    :disabled="!startProvince || isLoadingStartRegencies"
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
                  <p v-if="startLocationError" class="text-red-600 text-xs mt-1">
                    {{ startLocationError }}
                  </p>
                </div>
              </div>
            </div>

            <!-- End Location Section -->
            <div class="location-section">
              <h3 class="location-title">End Location <span class="text-red-500">*</span></h3>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Province</label>
                  <select
                    v-model="endProvince"
                    class="form-input"
                    :disabled="isLoadingLocations"
                  >
                    <option value="">
                      {{ isLoadingLocations ? 'Loading provinces...' : 'Select province' }}
                    </option>
                    <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
                      {{ prov.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="form-label">City/Regency</label>
                  <select
                    v-model="formData.endLocation"
                    class="form-input"
                    :class="{ 'border-red-500': endLocationError }"
                    :disabled="!endProvince || isLoadingEndRegencies"
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
                  <p v-if="endLocationError" class="text-red-600 text-xs mt-1">
                    {{ endLocationError }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Date & Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Start Date -->
            <div>
              <label class="form-label required">Start Date & Time</label>
              <input
                v-model="formData.startDate"
                type="datetime-local"
                class="form-input"
                required
              />
              <p class="form-hint">When does the activity start?</p>
            </div>

            <!-- End Date -->
            <div>
              <label class="form-label required">End Date & Time</label>
              <input
                v-model="formData.endDate"
                type="datetime-local"
                class="form-input"
                required
                :min="formData.startDate"
              />
              <p class="form-hint">When does the activity end?</p>
            </div>
          </div>

          <!-- Validation Errors -->
          <div
            v-if="validationErrors.length > 0"
            class="bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <h4 class="text-red-800 font-semibold mb-2">⚠️ Please fix the following errors:</h4>
            <ul class="list-disc list-inside text-red-600 text-sm space-y-1">
              <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 pt-4">
            <button type="submit" :disabled="activityStore.isLoading" class="btn-primary flex-1">
              <span v-if="activityStore.isLoading">Updating...</span>
              <span v-else>✓ Update Activity</span>
            </button>
            <router-link :to="`/activities/${activity.id}`" class="btn-secondary">
              Cancel
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import { toast } from 'vue-sonner'
import type { UpdateActivityRequest } from '@/interfaces/activity.interface'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const activityStore = useActivityStore()

const BASE_URL = import.meta.env.VITE_API_BASE_URL

// Types
interface Province {
  code: string
  name: string
}

interface Regency {
  code: string
  name: string
  province_code: string
}

// Get activity from store
const activity = computed(() => activityStore.currentActivity)

// Form data
const formData = ref<UpdateActivityRequest>({
  activityName: '',
  activityItem: '',
  capacity: 1,
  price: 0,
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: '',
})

const validationErrors = ref<string[]>([])

// Location API states
const provinces = ref<Province[]>([])
const startRegencies = ref<Regency[]>([])
const endRegencies = ref<Regency[]>([])
const startProvince = ref<string>('')
const endProvince = ref<string>('')
const isLoadingLocations = ref(false)
const isLoadingStartRegencies = ref(false)
const isLoadingEndRegencies = ref(false)
const startLocationError = ref<string>('')
const endLocationError = ref<string>('')

// Type badge color
const typeColorClass = (type: string) => {
  const colors: Record<string, string> = {
    Flight: 'bg-blue-100 text-blue-700',
    Accommodation: 'bg-purple-100 text-purple-700',
    'Vehicle Rental': 'bg-green-100 text-green-700',
    'Tour Activity': 'bg-orange-100 text-orange-700',
  }
  return colors[type] || 'bg-gray-100 text-gray-700'
}

// Convert ISO date to datetime-local format
const formatDateForInput = (isoDate: string): string => {
  const date = new Date(isoDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Fetch provinces
async function fetchProvinces() {
  isLoadingLocations.value = true
  try {
    const response = await axios.get<{ data: Array<{ code: string; name: string }> }>(
      `${BASE_URL}location/provinces`,
    )
    provinces.value = response.data.data
    console.log('✅ Provinces loaded:', provinces.value.length)
  } catch (error) {
    console.error('❌ Failed to load provinces:', error)
    // Fallback to some provinces if API fails
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
    const response = await axios.get<{
      data: Array<{ code: string; name: string; province_code: string }>
    }>(`${BASE_URL}location/regencies/${provinceCode}`)
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
    const response = await axios.get<{
      data: Array<{ code: string; name: string; province_code: string }>
    }>(`${BASE_URL}location/regencies/${provinceCode}`)
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
    formData.value.startLocation = ''
  }
})

watch(endProvince, (newVal) => {
  if (newVal) {
    fetchEndRegencies(newVal)
  } else {
    endRegencies.value = []
    formData.value.endLocation = ''
  }
})

// Watch activity changes and populate form
watch(
  activity,
  (newActivity) => {
    if (newActivity) {
      formData.value = {
        activityName: newActivity.activityName,
        activityItem: newActivity.activityItem,
        capacity: newActivity.capacity,
        price: newActivity.price,
        startDate: formatDateForInput(newActivity.startDate),
        endDate: formatDateForInput(newActivity.endDate),
        startLocation: newActivity.startLocation,
        endLocation: newActivity.endLocation,
      }
    }
  },
  { immediate: true },
)

// Validate form
const validateForm = (): boolean => {
  validationErrors.value = []

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

    if (end <= start) {
      validationErrors.value.push('End date must be after start date')
    }
  }

  return validationErrors.value.length === 0
}

// Submit form
const submitForm = async () => {
  if (!validateForm() || !activity.value) {
    return
  }

  try {
    // Convert datetime-local to ISO format
    const payload: UpdateActivityRequest = {
      ...formData.value,
      startDate: new Date(formData.value.startDate).toISOString(),
      endDate: new Date(formData.value.endDate).toISOString(),
    }

    await activityStore.updateActivity(activity.value.id, payload)
    toast.success('✅ Activity updated successfully!')
    router.push(`/activities/${activity.value.id}`)
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const errorMsg = error.response?.data?.message || 'Failed to update activity'
    toast.error(`❌ ${errorMsg}`)
  }
}

// Load activity on mount
onMounted(async () => {
  const activityId = route.params.id as string
  if (activityId) {
    // Fetch provinces first
    await fetchProvinces()

    // Then fetch activity data
    await activityStore.fetchActivityById(activityId)
  }
})
</script>

<style scoped>
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

.form-hint {
  @apply text-xs text-gray-500 mt-1;
}

.readonly-field {
  @apply px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 flex items-center;
}

.type-badge {
  @apply px-3 py-1 rounded-full text-xs font-semibold inline-block;
}

.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-center;
}

.locations-wrapper {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6 my-6;
}

.location-section {
  @apply p-6 bg-gray-50 rounded-lg border border-gray-200;
}

.location-title {
  @apply text-base font-semibold text-gray-800 mb-4;
}
</style>

<template>
  <div class="edit-plan-container">
    <div class="edit-plan-wrapper">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading plan data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error && !plan" class="error-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="error-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="error-text">{{ error }}</p>
        <button class="btn-back-error" @click="$router.back()">Go Back</button>
      </div>

      <!-- Edit Form -->
      <div v-else-if="plan">
        <!-- Back Button -->
        <button class="btn-back" @click="$router.back()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="back-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Edit Plan</h1>
        </div>

        <!-- Plan Information Form -->
        <div class="form-card">
          <div class="card-header">
            <h2 class="card-title">Plan Information</h2>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <!-- Plan Name -->
              <div class="form-group">
                <label class="form-label" for="planName">
                  Plan Name <span class="required">*</span>
                </label>
                <input
                  id="planName"
                  v-model="formData.planName"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.planName }"
                  placeholder="Enter plan name"
                  :disabled="!canEdit"
                />
                <p v-if="errors.planName" class="error-message">{{ errors.planName }}</p>
              </div>

              <!-- Activity Type (Read-only) -->
              <div class="form-group">
                <label class="form-label">Activity Type</label>
                <input v-model="plan.activityType" type="text" class="form-input" disabled />
              </div>

              <!-- Plan Status (Read-only) -->
              <div class="form-group">
                <label class="form-label">Plan Status</label>
                <div>
                  <span :class="statusBadgeClass(plan.status)">
                    {{ plan.status }}
                  </span>
                  <p class="status-note">
                    {{
                      plan.orderedQuantities?.length > 0
                        ? 'Has ordered activities'
                        : 'No ordered activities yet'
                    }}
                  </p>
                </div>
              </div>

              <!-- Total Price (Read-only) -->
              <div class="form-group">
                <label class="form-label">Total Price</label>
                <input
                  :value="'Rp ' + plan.price.toLocaleString('id-ID')"
                  type="text"
                  class="form-input"
                  disabled
                />
              </div>

              <!-- Date Range -->
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="startDate">
                    Start Date <span class="required">*</span>
                  </label>
                  <input
                    id="startDate"
                    v-model="formData.startDate"
                    type="datetime-local"
                    class="form-input"
                    :class="{ 'input-error': errors.startDate }"
                    :disabled="!canEdit"
                  />
                  <p v-if="errors.startDate" class="error-message">{{ errors.startDate }}</p>
                </div>

                <div class="form-group">
                  <label class="form-label" for="endDate">
                    End Date <span class="required">*</span>
                  </label>
                  <input
                    id="endDate"
                    v-model="formData.endDate"
                    type="datetime-local"
                    class="form-input"
                    :class="{ 'input-error': errors.endDate }"
                    :disabled="!canEdit"
                  />
                  <p v-if="errors.endDate" class="error-message">{{ errors.endDate }}</p>
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
                        :disabled="!canEdit || isLoadingLocations"
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
                        :class="{ 'input-error': errors.startLocation }"
                        :disabled="!canEdit || !startProvince || isLoadingStartRegencies"
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
                      <p v-if="errors.startLocation" class="error-message">
                        {{ errors.startLocation }}
                      </p>
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
                        :disabled="!canEdit || isLoadingLocations"
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
                        :class="{ 'input-error': errors.endLocation }"
                        :disabled="!canEdit || !endProvince || isLoadingEndRegencies"
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
                      <p v-if="errors.endLocation" class="error-message">
                        {{ errors.endLocation }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Alert -->
              <div v-if="submitError" class="alert alert-error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="alert-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ submitError }}</span>
              </div>

              <!-- Cannot Edit Warning -->
              <div v-if="!canEdit" class="alert alert-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="alert-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Cannot edit: {{ cannotEditReason }}</span>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn btn-primary" :disabled="submitting || !canEdit">
                <span v-if="submitting">Updating...</span>
                <span v-else>Update Plan</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Ordered Activities Section -->
        <div class="activities-card">
          <div class="card-header">
            <h2 class="card-title">Ordered Activities</h2>
            <button class="btn btn-sm btn-white">Add Activity</button>
          </div>
          <div class="card-body">
            <div
              v-if="!plan.orderedQuantities || plan.orderedQuantities.length === 0"
              class="empty-state"
            >
              <p>No activities added to this plan yet.</p>
            </div>
            <div v-else class="table-container">
              <table class="activities-table">
                <thead>
                  <tr>
                    <th>Activity Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Price</th>
                    <th>Quota</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in plan.orderedQuantities" :key="activity.id">
                    <td>{{ activity.activityName }}</td>
                    <td>{{ formatDateTime(activity.startDate) }}</td>
                    <td>{{ formatDateTime(activity.endDate) }}</td>
                    <td>Rp {{ activity.price.toLocaleString('id-ID') }}</td>
                    <td>{{ activity.orderedQuota }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/plan'
import { storeToRefs } from 'pinia'
import axios from 'axios'
import type { UpdatePlanRequest, PlanDetail } from '@/interfaces/plan.interface'
import type { Province, Regency } from '@/interfaces/plan.interface'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()

const { currentPlan, loading, error } = storeToRefs(planStore)
const plan = computed(() => currentPlan.value as PlanDetail | null)

const formData = ref<UpdatePlanRequest>({
  planName: '',
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: '',
})

const errors = ref<Record<string, string>>({})
const submitError = ref<string | null>(null)
const submitting = ref(false)

// Location API states
const provinces = ref<Province[]>([])
const startRegencies = ref<Regency[]>([])
const endRegencies = ref<Regency[]>([])
const startProvince = ref<string>('')
const endProvince = ref<string>('')
const isLoadingLocations = ref(false)
const isLoadingStartRegencies = ref(false)
const isLoadingEndRegencies = ref(false)

// Check if plan can be edited
const canEdit = computed(() => {
  if (!plan.value) {
    console.log('❌ canEdit: plan is null')
    return false
  }

  const hasOrderedQuantities = plan.value.orderedQuantities?.length > 0
  const packageStatus = plan.value.packageStatus ?? 'Unknown'
  const isPending = packageStatus === 'Pending'

  console.log('🔍 canEdit check:', {
    hasOrderedQuantities,
    packageStatus,
    isPending,
    canEdit: !hasOrderedQuantities && isPending,
  })

  return !hasOrderedQuantities && isPending
})

const cannotEditReason = computed(() => {
  if (!plan.value) return 'Plan data not loaded'

  const hasOrderedQuantities = plan.value.orderedQuantities?.length > 0
  const packageStatus = plan.value.packageStatus ?? 'Unknown'
  const isPending = packageStatus === 'Pending'

  if (hasOrderedQuantities) return 'Plan has ordered activities'
  if (!isPending) {
    return packageStatus === 'Unknown'
      ? 'Package status not available'
      : `Package status is ${packageStatus}, must be Pending`
  }
  return ''
})

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Fetch provinces
async function fetchProvinces() {
  isLoadingLocations.value = true
  try {
    const response = await axios.get<{ data: Array<{ code: string; name: string }> }>(
      `${API_BASE_URL}location/provinces`
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
    const response = await axios.get<{ data: Array<{ code: string; name: string; province_code: string }> }>(
      `${API_BASE_URL}location/regencies/${provinceCode}`
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
    const response = await axios.get<{ data: Array<{ code: string; name: string; province_code: string }> }>(
      `${API_BASE_URL}location/regencies/${provinceCode}`
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

onMounted(async () => {
  const planId = route.params.id as string
  console.log('🔍 Fetching plan for edit, ID:', planId)

  // Fetch provinces first
  await fetchProvinces()

  // Then fetch plan data
  await planStore.getPlanDetail(planId)

  if (plan.value) {
    console.log('📋 Plan data loaded:', {
      id: plan.value.id,
      name: plan.value.planName,
      packageStatus: plan.value.packageStatus,
      hasOrderedQuantities: plan.value.orderedQuantities?.length > 0,
      startLocation: plan.value.startLocation,
      endLocation: plan.value.endLocation,
    })

    // Populate form with current data
    formData.value = {
      planName: plan.value.planName,
      startDate: formatDateForInput(plan.value.startDate),
      endDate: formatDateForInput(plan.value.endDate),
      startLocation: plan.value.startLocation,
      endLocation: plan.value.endLocation,
    }

    // Try to find and set province codes based on existing locations
    // This is a simplified approach - you might need to enhance this
    // by storing province codes in the database or using a more sophisticated lookup
    await findAndSetProvinces()
  } else {
    console.error('❌ Plan data is null after loading')
  }
})

async function findAndSetProvinces() {
  // Try to match existing locations to provinces
  // This is a helper to pre-select the dropdowns

  // For now, we'll just log the current locations
  // You might want to implement a more sophisticated matching algorithm
  console.log('📍 Current locations:', {
    start: formData.value.startLocation,
    end: formData.value.endLocation,
  })

  // If you want to pre-populate, you'll need to search through all provinces
  // and their regencies to find matches. This can be complex.
  // For simplicity, user can re-select from dropdowns.
}

function formatDateForInput(dateStr?: string) {
  if (!dateStr) return ''
  return dateStr.slice(0, 16)
}

function formatDateTime(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function statusBadgeClass(status?: string) {
  if (status === 'Unfulfilled') return 'badge badge-green'
  if (status === 'Fulfilled') return 'badge badge-blue'
  return 'badge badge-gray'
}

function validateForm(): boolean {
  errors.value = {}

  if (!formData.value.planName.trim()) {
    errors.value.planName = 'Plan name is required'
  }

  if (!formData.value.startDate) {
    errors.value.startDate = 'Start date is required'
  }

  if (!formData.value.endDate) {
    errors.value.endDate = 'End date is required'
  }

  if (!formData.value.startLocation) {
    errors.value.startLocation = 'Start location is required'
  }

  if (!formData.value.endLocation) {
    errors.value.endLocation = 'End location is required'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  if (!plan.value || !canEdit.value) {
    submitError.value = 'Cannot edit this plan'
    return
  }

  submitting.value = true
  submitError.value = null

  try {
    console.log('📤 Submitting update:', formData.value)

    await planStore.updatePlan(plan.value.id, formData.value)

    console.log('✅ Plan updated successfully')

    // Navigate back to view plan
    router.push(`/plans/${plan.value.id}`)
  } catch (e) {
    console.error('❌ Failed to update plan:', e)
    const err = e as { response?: { data?: { message?: string } } }
    submitError.value = err.response?.data?.message || 'Failed to update plan'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Container */
.edit-plan-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

.edit-plan-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
}

.error-text {
  font-size: 1.125rem;
  color: #6b7280;
}

/* Back Button */
.btn-back,
.btn-back-error {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 1.5rem;
}

.btn-back:hover,
.btn-back-error:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

/* Cards */
.form-card,
.activities-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header-with-button {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.card-body {
  padding: 1.5rem;
}

/* Form */
.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #ef4444;
}

/* Locations */
.locations-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.location-section {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.location-title {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.alert-warning {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-white {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-white:hover {
  background-color: #f9fafb;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.badge-green {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-note {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Empty State */
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.activities-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.activities-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.activities-table tbody tr:hover {
  background-color: #f9fafb;
}
</style>

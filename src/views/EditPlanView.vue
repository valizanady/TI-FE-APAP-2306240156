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
                <input
                  v-model="plan.activityType"
                  type="text"
                  class="form-input"
                  disabled
                />
              </div>

              <!-- Plan Status (Read-only) -->
              <div class="form-group">
                <label class="form-label">Plan Status</label>
                <div>
                  <span :class="statusBadgeClass(plan.status)">
                    {{ plan.status }}
                  </span>
                  <p class="status-note">
                    {{ plan.orderedQuantities?.length > 0
                      ? 'Has ordered activities'
                      : 'No ordered activities yet' }}
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
                      <p v-if="errors.startLocation" class="error-message">{{ errors.startLocation }}</p>
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
                      <p v-if="errors.endLocation" class="error-message">{{ errors.endLocation }}</p>
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
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="submitting || !canEdit"
              >
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
import type { UpdatePlanRequest } from '@/interfaces/plan.interface'
import type { Province, Regency } from '@/interfaces/plan.interface'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()

const { currentPlan: plan, loading, error } = storeToRefs(planStore)

const formData = ref<UpdatePlanRequest>({
  planName: '',
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: ''
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
    canEdit: !hasOrderedQuantities && isPending
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

// Fetch provinces
async function fetchProvinces() {
  isLoadingLocations.value = true
  try {
    const response = await axios.get<Array<{ id: string; name: string }>>('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
    provinces.value = response.data.map((p) => ({
      code: p.id,
      name: p.name
    }))
    console.log('✅ Provinces loaded:', provinces.value.length)
  } catch (error) {
    console.error('❌ Failed to load provinces:', error)
    submitError.value = 'Failed to load location data'
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
    const response = await axios.get<Array<{ id: string; name: string }>>(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
    )
    startRegencies.value = response.data.map((r) => ({
      code: r.id,
      name: r.name,
      province_code: provinceCode
    }))
    console.log('✅ Start regencies loaded:', startRegencies.value.length)
  } catch (error) {
    console.error('❌ Failed to load start regencies:', error)
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
    const response = await axios.get<Array<{ id: string; name: string }>>(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceCode}.json`
    )
    endRegencies.value = response.data.map((r) => ({
      code: r.id,
      name: r.name,
      province_code: provinceCode
    }))
    console.log('✅ End regencies loaded:', endRegencies.value.length)
  } catch (error) {
    console.error('❌ Failed to load end regencies:', error)
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
  await planStore.getPlanForEdit(planId)

  if (plan.value) {
    console.log('📋 Plan data loaded:', {
      id: plan.value.id,
      name: plan.value.planName,
      packageStatus: plan.value.packageStatus,
      hasOrderedQuantities: plan.value.orderedQuantities?.length > 0,
      startLocation: plan.value.startLocation,
      endLocation: plan.value.endLocation
    })

    // Populate form with current data
    formData.value = {
      planName: plan.value.planName,
      startDate: formatDateForInput(plan.value.startDate),
      endDate: formatDateForInput(plan.value.endDate),
      startLocation: plan.value.startLocation,
      endLocation: plan.value.endLocation
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
    end: formData.value.endLocation
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
    year: 'numeric'
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
  if (!validateForm()) return
  if (!canEdit.value) {
    submitError.value = cannotEditReason.value
    return
  }

  submitting.value = true
  submitError.value = null

  try {
    const planId = route.params.id as string
    await planStore.updatePlan(planId, {
      ...formData.value,
      startDate: formData.value.startDate + ':00',
      endDate: formData.value.endDate + ':00'
    })

    // Success - redirect to plan detail
    router.push(`/plans/${planId}`)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to update plan'
    submitError.value = planStore.error || errorMessage
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
  max-width: 1024px;
  margin: 0 auto;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e5e7eb;
  border-top-color: #6b46c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-text {
  color: #374151;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.btn-back-error {
  padding: 0.625rem 1.25rem;
  background-color: #6b46c1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

/* Back Button */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.5rem 0;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;
}

.btn-back:hover {
  color: #6b46c1;
}

.back-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Header */
.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Card */
.form-card, .activities-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.card-header {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem 0.75rem 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

/* Form */
.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
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
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Locations */
.locations-wrapper {
  margin: 1.5rem 0;
}

.location-section {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  margin-bottom: 1rem;
}

.location-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-green {
  background-color: #dcfce7;
  color: #15803d;
}

.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
}

.status-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Button */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
}

.btn-white {
  background-color: #ffffff;
  color: #6b46c1;
  border: 1px solid #ffffff;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem;
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

.activities-table thead {
  background-color: #f9fafb;
}

.activities-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.75rem;
  text-transform: uppercase;
}

.activities-table td {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  color: #1f2937;
}

/* Responsive */
@media (max-width: 768px) {
  .edit-plan-container {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>

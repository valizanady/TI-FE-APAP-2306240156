<template>
  <div class="plan-edit-container">
    <!-- Header -->
    <div class="page-header">
      <h1>Edit Plan</h1>
      <button @click="router.back()" class="btn btn-secondary">
        ← Back
      </button>
    </div>

    <!-- Error State -->
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading plan data...</p>
    </div>

    <!-- Edit Form -->
    <form v-if="plan && !loading" @submit.prevent="handleSubmit" class="plan-form">

      <!-- Readonly Fields -->
      <div class="form-section">
        <h3>📦 Package Information (Cannot be changed)</h3>

        <div class="form-group">
          <label>Package Name</label>
          <input
            type="text"
            :value="plan.packageName"
            disabled
            class="form-input readonly"
          />
        </div>

        <div class="form-group">
          <label>Activity Type</label>
          <input
            type="text"
            :value="plan.activityType"
            disabled
            class="form-input readonly"
          />
          <p class="field-note">This field cannot be changed after plan creation</p>
        </div>

        <div class="form-group">
          <label>Package Status</label>
          <span :class="['status-badge', `status-${plan.packageStatus?.toLowerCase()}`]">
            {{ plan.packageStatus }}
          </span>
        </div>
      </div>

      <!-- Editable Fields -->
      <div class="form-section">
        <h3>✏️ Plan Details</h3>

        <div class="form-group" :class="{ 'has-error': errors.planName }">
          <label>Plan Name <span class="required">*</span></label>
          <input
            v-model="formData.planName"
            type="text"
            class="form-input"
            placeholder="Enter plan name"
            required
            @blur="validateField('planName')"
          />
          <span v-if="errors.planName" class="error-text">{{ errors.planName }}</span>
        </div>

        <div class="form-row">
          <div class="form-group" :class="{ 'has-error': errors.startDate }">
            <label>Start Date <span class="required">*</span></label>
            <input
              v-model="formData.startDate"
              type="datetime-local"
              class="form-input"
              required
              @blur="validateField('startDate')"
            />
            <span v-if="errors.startDate" class="error-text">{{ errors.startDate }}</span>
          </div>

          <div class="form-group" :class="{ 'has-error': errors.endDate }">
            <label>End Date <span class="required">*</span></label>
            <input
              v-model="formData.endDate"
              type="datetime-local"
              class="form-input"
              required
              @blur="validateField('endDate')"
            />
            <span v-if="errors.endDate" class="error-text">{{ errors.endDate }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Start Location</label>
            <input
              v-model="formData.startLocation"
              type="text"
              class="form-input"
              placeholder="e.g., Jakarta"
            />
          </div>

          <div class="form-group">
            <label>End Location</label>
            <input
              v-model="formData.endLocation"
              type="text"
              class="form-input"
              placeholder="e.g., Bali"
            />
          </div>
        </div>

        <div class="form-group" :class="{ 'has-error': errors.price }">
          <label>Price (Rp) <span class="required">*</span></label>
          <input
            v-model.number="formData.price"
            type="number"
            class="form-input"
            placeholder="Enter price"
            required
            min="1"
            step="1000"
            @blur="validateField('price')"
          />
          <span v-if="errors.price" class="error-text">{{ errors.price }}</span>
          <p v-else class="field-note">Price must be greater than 0</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="button" @click="router.back()" class="btn btn-secondary" :disabled="submitting">
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!canSubmit || submitting"
        >
          <span v-if="submitting">
            <span class="spinner-small"></span> Updating...
          </span>
          <span v-else>Update Plan</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/plan'
import { useAuthStore } from '@/stores/auth'
import type { PlanDetail } from '@/interfaces/plan.interface'

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()
const authStore = useAuthStore()

// State
const plan = ref<PlanDetail | null>(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

// Form Data
const formData = ref({
  planName: '',
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: '',
  price: 0,
})

// Validation Errors
const errors = ref<Record<string, string>>({})

// Computed
const canSubmit = computed(() => {
  if (!plan.value) return false

  // Package must be Pending
  if (plan.value.packageStatus !== 'Pending') return false

  // No validation errors
  if (Object.keys(errors.value).length > 0) return false

  // All required fields filled
  return formData.value.planName &&
         formData.value.startDate &&
         formData.value.endDate &&
         formData.value.price > 0
})

// Methods
async function loadPlan() {
  try {
    loading.value = true
    error.value = ''

    const planId = route.params.id as string
    const fetchedPlan = await planStore.getPlanDetail(planId)

    if (!fetchedPlan) {
      throw new Error('Plan not found')
    }

    // Authorization check
    const userId = authStore.user?.id
    const userRole = authStore.user?.role

    // Customer can only edit own package's plans
    // If packageUserId is available in response, use it directly
    // Otherwise, the authorization will be checked on the backend
    if (userRole === 'Customer' && fetchedPlan.packageUserId && fetchedPlan.packageUserId !== userId) {
      error.value = '🚫 Access denied: You can only edit plans from your own packages'
      return
    }

    // Check if package is Pending
    if (fetchedPlan.packageStatus !== 'Pending') {
      error.value = `⚠️ Cannot edit plan: Package status is "${fetchedPlan.packageStatus}". Only plans in Pending packages can be edited.`
      return
    }

    plan.value = fetchedPlan

    // Populate form
    formData.value = {
      planName: fetchedPlan.planName,
      startDate: formatDateForInput(fetchedPlan.startDate),
      endDate: formatDateForInput(fetchedPlan.endDate),
      startLocation: fetchedPlan.startLocation || '',
      endLocation: fetchedPlan.endLocation || '',
      price: fetchedPlan.planPrice || fetchedPlan.price || 0, // ✅ Use planPrice for edit
    }

  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load plan'
    console.error('Error loading plan:', err)
  } finally {
    loading.value = false
  }
}

function formatDateForInput(dateString: string): string {
  // Format: 2025-01-15T10:30
  return dateString.substring(0, 16)
}

function validateField(fieldName: string) {
  delete errors.value[fieldName]

  switch (fieldName) {
    case 'planName':
      if (!formData.value.planName.trim()) {
        errors.value.planName = 'Plan name is required'
      }
      break

    case 'startDate':
      if (!formData.value.startDate) {
        errors.value.startDate = 'Start date is required'
      } else if (formData.value.endDate &&
                 new Date(formData.value.startDate) >= new Date(formData.value.endDate)) {
        errors.value.startDate = 'Start date must be before end date'
        delete errors.value.endDate // Clear endDate error if it was the issue
      } else {
        // If startDate is now valid, revalidate endDate
        if (errors.value.endDate) {
          validateField('endDate')
        }
      }
      break

    case 'endDate':
      if (!formData.value.endDate) {
        errors.value.endDate = 'End date is required'
      } else if (formData.value.startDate &&
                 new Date(formData.value.endDate) <= new Date(formData.value.startDate)) {
        errors.value.endDate = 'End date must be after start date'
      }
      break

    case 'price':
      if (formData.value.price <= 0) {
        errors.value.price = 'Price must be greater than 0'
      }
      break
  }
}

function validateAllFields(): boolean {
  errors.value = {}

  validateField('planName')
  validateField('startDate')
  validateField('endDate')
  validateField('price')

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateAllFields()) {
    alert('⚠️ Please fix all validation errors before submitting')
    return
  }

  try {
    submitting.value = true

    const planId = route.params.id as string

    const updateData = {
      planName: formData.value.planName,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      startLocation: formData.value.startLocation,
      endLocation: formData.value.endLocation,
      price: formData.value.price,
    }

    console.log('📤 Sending update request:', updateData)

    await planStore.updatePlan(planId, updateData)

    alert('✅ Plan updated successfully!')
    router.push(`/plans/${planId}`)

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update plan'
    alert(`❌ ${errorMessage}`)
    console.error('Update error:', err)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadPlan()
})
</script>

<style scoped>
.plan-edit-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.alert {
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.alert-error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.plan-form {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-of-type {
  margin-bottom: 0;
}

.form-section h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
  color: #2d3748;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #4a5568;
  font-size: 14px;
}

.required {
  color: #e53e3e;
}

.form-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-input.readonly {
  background-color: #f7fafc;
  color: #718096;
  cursor: not-allowed;
}

.has-error .form-input {
  border-color: #e53e3e;
}

.has-error .form-input:focus {
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.error-text {
  display: block;
  color: #e53e3e;
  font-size: 13px;
  margin-top: 6px;
  font-weight: 500;
}

.field-note {
  font-size: 12px;
  color: #718096;
  margin-top: 6px;
  font-style: italic;
}

.status-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-accepted {
  background-color: #d1fae5;
  color: #065f46;
}

.status-processed {
  background-color: #dbeafe;
  color: #1e40af;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 12px 28px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.btn-secondary {
  background-color: #f7fafc;
  color: #4a5568;
  border: 1px solid #cbd5e0;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #edf2f7;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner-small {
  display: inline-block;
  border: 2px solid #ffffff66;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: spin 0.8s linear infinite;
}
</style>

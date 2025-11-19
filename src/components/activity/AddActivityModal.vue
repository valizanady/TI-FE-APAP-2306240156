<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- src/components/AddActivityModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="modal-overlay"
      @click.self="handleClose"
    >
      <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title">Add Activity to Plan</h3>
          <button
            class="close-button"
            @click="handleClose"
            type="button"
          >
            <svg
              class="close-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading activities...</p>
          </div>

          <template v-else>
            <!-- Activity Selector -->
            <div class="form-group">
              <label class="form-label">
                Activity *
                <span class="filter-info">(Filtered by: {{ activityType }} + start & end dates)</span>
              </label>
              <select
                v-model="selectedActivityId"
                @change="handleActivitySelect"
                class="form-select"
              >
                <option value="">Select an activity</option>
                <option
                  v-for="activity in eligibleActivities"
                  :key="activity.id"
                  :value="activity.id"
                >
                  {{ activity.activityName }} - {{ activity.activityType }} ({{ formatCurrency(activity.price) }})
                </option>
              </select>
            </div>

            <!-- Selected Activity Details -->
            <div
              v-if="selectedActivity"
              class="activity-details"
            >
              <h4 class="details-title">Selected Activity Details:</h4>

              <div class="details-grid">
                <div class="detail-item">
                  <p class="detail-label">Name:</p>
                  <p class="detail-value">{{ selectedActivity.activityName }}</p>
                </div>

                <div class="detail-item">
                  <p class="detail-label">Type:</p>
                  <p class="detail-value">{{ selectedActivity.activityType }}</p>
                </div>

                <div class="detail-item">
                  <p class="detail-label">Price:</p>
                  <p class="detail-value">{{ formatCurrency(selectedActivity.price) }}</p>
                </div>

                <div class="detail-item">
                  <p class="detail-label">Capacity:</p>
                  <p class="detail-value">{{ selectedActivity.capacity }}</p>
                </div>

                <div class="detail-item">
                  <p class="detail-label">Start Date:</p>
                  <p class="detail-value">{{ formatDateTime(selectedActivity.startDate) }}</p>
                </div>

                <div class="detail-item">
                  <p class="detail-label">End Date:</p>
                  <p class="detail-value">{{ formatDateTime(selectedActivity.endDate) }}</p>
                </div>
              </div>
            </div>

            <!-- Ordered Quantity -->
            <div class="form-group">
              <label class="form-label">Ordered Quantity *</label>
              <input
                v-model.number="orderedQuantity"
                type="number"
                min="1"
                :max="selectedActivity?.capacity || 999"
                :disabled="!selectedActivity"
                class="form-input"
                placeholder="Enter quantity"
                @input="validateQuantity"
              />
              <p
                v-if="selectedActivity"
                class="help-text"
              >
                Maximum: {{ selectedActivity.capacity }} (activity capacity)
              </p>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="error-message"
            >
              <svg
                class="error-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="error-text">{{ errorMessage }}</p>
            </div>

            <!-- Total Price -->
            <div
              v-if="selectedActivity && !errorMessage"
              class="total-price"
            >
              <span class="total-label">Total Price:</span>
              <span class="total-amount">{{ formatCurrency(calculateTotal()) }}</span>
            </div>
          </template>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            @click="handleClose"
            type="button"
            class="btn-cancel"
          >
            Cancel
          </button>
          <button
            @click="handleSubmit"
            :disabled="!selectedActivity || !!errorMessage || submitting"
            type="button"
            class="btn-submit"
          >
            <span v-if="submitting">Adding...</span>
            <span v-else>Add Activity</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderedActivityStore } from '@/stores/orderedActivity.ts'
import { storeToRefs } from 'pinia'
import type { Activity } from '@/interfaces/activity.interface'

// Props
const props = defineProps<{
  isOpen: boolean
  planId: string
  activityType: string
  packageQuota: number
  currentTotalOrdered: number
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'success'): void
}>()

// Store
const orderedActivityStore = useOrderedActivityStore()
const { eligibleActivities, loading } = storeToRefs(orderedActivityStore)

// Local state
const selectedActivityId = ref<string>('')
const orderedQuantity = ref<number>(1)
const errorMessage = ref<string>('')
const submitting = ref<boolean>(false)

// Computed
const selectedActivity = computed<Activity | null>(() => {
  if (!selectedActivityId.value) return null
  return eligibleActivities.value.find(a => a.id === selectedActivityId.value) || null
})

// Watch for modal open
watch(() => props.isOpen, async (newValue) => {
  if (newValue) {
    // Reset form
    selectedActivityId.value = ''
    orderedQuantity.value = 1
    errorMessage.value = ''
    submitting.value = false

    // Fetch eligible activities
    await orderedActivityStore.fetchEligibleActivities(props.planId)
  }
})

// Methods
function handleActivitySelect() {
  orderedQuantity.value = 1
  errorMessage.value = ''
}

function validateQuantity() {
  errorMessage.value = ''

  if (orderedQuantity.value < 1) {
    errorMessage.value = 'Quantity must be at least 1'
    return
  }

  if (selectedActivity.value && orderedQuantity.value > selectedActivity.value.capacity) {
    errorMessage.value = `Maximum quantity is ${selectedActivity.value.capacity}`
    return
  }

  // Check against package quota
  const newTotal = props.currentTotalOrdered + orderedQuantity.value
  if (newTotal > props.packageQuota) {
    errorMessage.value = `Total would exceed package quota (${props.packageQuota})`
    return
  }
}

function calculateTotal(): number {
  if (!selectedActivity.value) return 0
  return selectedActivity.value.price * orderedQuantity.value
}

async function handleSubmit() {
  if (!selectedActivity.value) {
    errorMessage.value = 'Please select an activity'
    return
  }

  validateQuantity()
  if (errorMessage.value) return

  submitting.value = true

  try {
    await orderedActivityStore.addActivityToPlan(props.planId, {
      activityId: selectedActivity.value.id,
      orderedQuantity: orderedQuantity.value
    })

    emit('success')
    handleClose()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to add activity'
  } finally {
    submitting.value = false
  }
}

function handleClose() {
  emit('close')
}

function formatCurrency(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Container */
.modal-container {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 42rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(2rem);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.75rem 0.75rem 0 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
}

.close-button {
  color: white;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #e5e7eb;
  border-top-color: #6b46c1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Form Group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.filter-info {
  color: #6b7280;
  font-weight: 400;
}

.form-select,
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.form-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Activity Details */
.activity-details {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.details-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* Error Message */
.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #991b1b;
  flex-shrink: 0;
}

.error-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #991b1b;
  margin: 0;
}

/* Total Price */
.total-price {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.total-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #166534;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #166534;
}

/* Modal Footer */
.modal-footer {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 0.75rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel,
.btn-submit {
  padding: 0.625rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  background-color: #d1d5db;
}

.btn-submit {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-container {
    max-height: 95vh;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }
}
</style>

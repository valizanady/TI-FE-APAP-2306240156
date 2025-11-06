<!-- src/components/EditActivityModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen && orderedActivity"
      class="modal-overlay"
      @click.self="handleClose"
    >
      <div class="modal-container">
        <!-- Modal Header -->
        <div class="modal-header">
          <h3 class="modal-title">Edit Ordered Activity</h3>
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
          <!-- Activity Info (Read-only) -->
          <div class="activity-info">
            <h4 class="info-title">Activity Information:</h4>

            <div class="info-grid">
              <div class="info-item">
                <p class="info-label">Name:</p>
                <p class="info-value">{{ orderedActivity.activityName }}</p>
              </div>

              <div class="info-item">
                <p class="info-label">Activity ID:</p>
                <p class="info-value">
                  <code class="activity-id">{{ orderedActivity.activityId }}</code>
                </p>
              </div>

              <div class="info-item">
                <p class="info-label">Price per unit:</p>
                <p class="info-value">{{ formatCurrency(orderedActivity.price) }}</p>
              </div>

              <div class="info-item">
                <p class="info-label">Capacity:</p>
                <p class="info-value">{{ orderedActivity.quota }}</p>
              </div>

              <div class="info-item">
                <p class="info-label">Start Date:</p>
                <p class="info-value">{{ formatDateTime(orderedActivity.startDate) }}</p>
              </div>

              <div class="info-item">
                <p class="info-label">End Date:</p>
                <p class="info-value">{{ formatDateTime(orderedActivity.endDate) }}</p>
              </div>
            </div>
          </div>

          <!-- Editable Quantity -->
          <div class="form-group">
            <label class="form-label">
              Ordered Quantity *
              <span class="current-qty">(Current: {{ orderedActivity.orderedQuota }})</span>
            </label>
            <input
              v-model.number="newQuantity"
              type="number"
              min="1"
              :max="orderedActivity.quota"
              class="form-input"
              placeholder="Enter new quantity"
              @input="validateQuantity"
            />
            <p class="help-text">
              Maximum: {{ orderedActivity.quota }} (activity capacity)
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

          <!-- Price Comparison -->
          <div v-if="!errorMessage" class="price-comparison">
            <div class="comparison-row">
              <span class="comparison-label">Previous Total:</span>
              <span class="comparison-value old">{{ formatCurrency(orderedActivity.total) }}</span>
            </div>
            <div class="comparison-row">
              <span class="comparison-label">New Total:</span>
              <span class="comparison-value new">{{ formatCurrency(calculateNewTotal()) }}</span>
            </div>
            <div class="comparison-row difference">
              <span class="comparison-label">Difference:</span>
              <span :class="['comparison-value', getDifferenceClass()]">
                {{ formatDifference() }}
              </span>
            </div>
          </div>
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
            :disabled="!!errorMessage || submitting || newQuantity === orderedActivity.orderedQuota"
            type="button"
            class="btn-submit"
          >
            <span v-if="submitting">Updating...</span>
            <span v-else>Update Activity</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOrderedActivityStore } from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/stores/orderedActivity.ts'

// Props
const props = defineProps<{
  isOpen: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderedActivity: any | null
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

// Local state
const newQuantity = ref<number>(1)
const errorMessage = ref<string>('')
const submitting = ref<boolean>(false)

// Watch for modal open
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.orderedActivity) {
    // Initialize with current quantity
    newQuantity.value = props.orderedActivity.orderedQuota
    errorMessage.value = ''
    submitting.value = false
  }
})

// Methods
function validateQuantity() {
  errorMessage.value = ''

  if (newQuantity.value < 1) {
    errorMessage.value = 'Quantity must be at least 1'
    return
  }

  if (props.orderedActivity && newQuantity.value > props.orderedActivity.quota) {
    errorMessage.value = `Maximum quantity is ${props.orderedActivity.quota}`
    return
  }

  // Check against package quota
  const quantityDiff = newQuantity.value - props.orderedActivity.orderedQuota
  const newTotal = props.currentTotalOrdered + quantityDiff
  if (newTotal > props.packageQuota) {
    errorMessage.value = `Total would exceed package quota (${props.packageQuota})`
    return
  }
}

function calculateNewTotal(): number {
  if (!props.orderedActivity) return 0
  return props.orderedActivity.price * newQuantity.value
}

function formatDifference(): string {
  if (!props.orderedActivity) return 'Rp 0'
  const diff = calculateNewTotal() - props.orderedActivity.total
  const absValue = Math.abs(diff)
  const formatted = `Rp ${absValue.toLocaleString('id-ID')}`
  return diff > 0 ? `+${formatted}` : diff < 0 ? `-${formatted}` : formatted
}

function getDifferenceClass(): string {
  if (!props.orderedActivity) return ''
  const diff = calculateNewTotal() - props.orderedActivity.total
  return diff > 0 ? 'positive' : diff < 0 ? 'negative' : 'neutral'
}

async function handleSubmit() {
  if (!props.orderedActivity) return

  validateQuantity()
  if (errorMessage.value) return

  if (newQuantity.value === props.orderedActivity.orderedQuota) {
    errorMessage.value = 'No changes to save'
    return
  }

  submitting.value = true

  try {
    await orderedActivityStore.updateOrderedActivity(
      props.orderedActivity.id,
      newQuantity.value
    )

    emit('success')
    handleClose()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to update activity'
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
  max-width: 40rem;
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
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
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

/* Activity Info */
.activity-info {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.info-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.activity-id {
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #4b5563;
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

.current-qty {
  color: #6b7280;
  font-weight: 400;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #d97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
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

/* Price Comparison */
.price-comparison {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comparison-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
}

.comparison-row:not(:last-child) {
  border-bottom: 1px solid #fde68a;
}

.comparison-row.difference {
  border-top: 2px solid #d97706;
  padding-top: 0.75rem;
  border-bottom: none;
  padding-bottom: 0;
}

.comparison-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #78350f;
}

.comparison-value {
  font-size: 1rem;
  font-weight: 700;
}

.comparison-value.old {
  color: #6b7280;
  text-decoration: line-through;
}

.comparison-value.new {
  color: #d97706;
}

.comparison-value.positive {
  color: #15803d;
}

.comparison-value.negative {
  color: #dc2626;
}

.comparison-value.neutral {
  color: #6b7280;
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
  background: linear-gradient(135deg, #d97706 0%, #f59e0b 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
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

  .info-grid {
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

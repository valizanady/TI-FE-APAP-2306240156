<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="view-plan-container">
    <div class="view-plan-wrapper">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading plan details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
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

      <!-- Content -->
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
          <h1 class="page-title">View Plan</h1>
        </div>

        <!-- Plan Information Card -->
        <div class="info-card">
          <div class="card-header">
            <h2 class="card-title">Plan Information</h2>
          </div>
          <div class="card-body">
            <div class="info-grid">
              <!-- Plan Name -->
              <div class="info-item">
                <p class="info-label">Plan Name:</p>
                <p class="info-value">{{ plan.planName }}</p>
              </div>

              <!-- Activity Type -->
              <div class="info-item">
                <p class="info-label">Activity Type:</p>
                <p class="info-value">{{ plan.activityType }}</p>
              </div>

              <!-- Plan Status -->
              <div class="info-item">
                <p class="info-label">Plan Status:</p>
                <span :class="statusBadgeClass(plan.status)">
                  {{ plan.status }}
                </span>
                <p class="info-note">
                  {{
                    plan.status === 'Fulfilled'
                      ? 'All requirements met'
                      : 'Not enough ordered quantities'
                  }}
                </p>
              </div>

              <!-- Total Price -->
              <div class="info-item">
                <p class="info-label">Total Price:</p>
                <p class="info-value">Rp {{ plan.price.toLocaleString('id-ID') }}</p>
              </div>

              <!-- Start Date -->
              <div class="info-item">
                <p class="info-label">Start Date:</p>
                <p class="info-value">{{ formatDateTime(plan.startDate) }}</p>
              </div>

              <!-- End Date -->
              <div class="info-item">
                <p class="info-label">End Date:</p>
                <p class="info-value">{{ formatDateTime(plan.endDate) }}</p>
              </div>

              <!-- Start Location -->
              <div class="info-item">
                <p class="info-label">Start Location:</p>
                <p class="info-value">{{ plan.startLocation }}</p>
              </div>

              <!-- End Location -->
              <div class="info-item">
                <p class="info-label">End Location:</p>
                <p class="info-value">{{ plan.endLocation }}</p>
              </div>

              <!-- Package -->
              <div class="info-item full-width">
                <p class="info-label">Package:</p>
                <a
                  :href="`/package/${plan.packageId}`"
                  class="package-link text-blue-600 hover:underline"
                >
                  {{ plan.packageName }}
                </a>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <button
                  class="btn btn-secondary"
                  @click="$router.push(`/package/${plan.packageId}`)"
                >
                  View Package
                </button>
                <button class="btn btn-primary" @click="$router.push(`/plans/${plan.id}/edit`)">
                  Edit Plan
                </button>
                <button class="btn btn-danger" @click="confirmDeletePlan">Delete Plan</button>
              </div>
            </div>
          </div>

          <!-- Ordered Activities Table -->
          <div class="activities-card">
            <div class="card-header-with-button">
              <h2 class="card-title">Ordered Activities</h2>
              <button
                v-if="plan.packageStatus === 'Pending'"
                @click="showAddActivityModal = true"
                class="btn-add-activity"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="btn-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Activity
              </button>
            </div>
            <div class="card-body">
              <!-- Empty State -->
              <div
                v-if="!plan.orderedQuantities || plan.orderedQuantities.length === 0"
                class="empty-state"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="empty-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <p class="empty-text">No ordered activities yet</p>
                <button
                  v-if="plan.packageStatus === 'Pending'"
                  @click="showAddActivityModal = true"
                  class="btn-add-empty"
                >
                  Add First Activity
                </button>
              </div>

              <!-- Table -->
              <div v-else class="table-container">
                <table class="activities-table">
                  <thead>
                    <tr>
                      <th>Activity Name</th>
                      <th>Activity ID</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Price</th>
                      <th>Quota</th>
                      <th>Ordered Quota</th>
                      <th>Total</th>
                      <th v-if="plan.packageStatus === 'Pending'">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="activity in plan.orderedQuantities" :key="activity.id">
                      <td>{{ activity.activityName }}</td>
                      <td>
                        <code class="activity-id">{{ activity.activityId }}</code>
                      </td>
                      <td>{{ formatDateTime(activity.startDate) }}</td>
                      <td>{{ formatDateTime(activity.endDate) }}</td>
                      <td class="price-cell">Rp {{ activity.price.toLocaleString('id-ID') }}</td>
                      <td class="quota-cell">
                        <span class="capacity-badge">{{ activity.quota }}</span>
                        <span v-if="plan.packageStatus === 'Processed'" class="capacity-note">
                          (Updated after processing)
                        </span>
                      </td>
                      <td class="quota-cell">{{ activity.orderedQuota }}</td>
                      <td class="total-cell">Rp {{ activity.total.toLocaleString('id-ID') }}</td>
                      <td v-if="plan.packageStatus === 'Pending'" class="actions-cell">
                        <div class="action-buttons-cell">
                          <button
                            @click="handleEditActivity(activity)"
                            class="btn-action btn-edit"
                            title="Edit"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="action-icon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            @click="confirmDeleteActivity(activity.id)"
                            class="btn-action btn-delete"
                            title="Remove"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="action-icon"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Activity Modal -->
      <AddActivityModal
        :is-open="showAddActivityModal"
        :plan-id="plan?.id || ''"
        :activity-type="plan?.activityType || ''"
        :package-quota="packageQuota"
        :current-total-ordered="currentTotalOrdered"
        @close="showAddActivityModal = false"
        @success="handleActivityAdded"
      />

      <!-- Edit Activity Modal -->
      <EditActivityModal
        :is-open="showEditActivityModal"
        :ordered-activity="selectedActivity"
        :package-quota="packageQuota"
        :current-total-ordered="currentTotalOrdered"
        @close="showEditActivityModal = false"
        @success="handleActivityUpdated"
      />

      <!-- Delete Activity Confirmation Modal -->
      <VConfirmModal
        :is-open="showDeleteActivityConfirm"
        title="Remove Activity"
        message="Are you sure you want to remove this activity from the plan?"
        confirm-text="OK"
        cancel-text="Cancel"
        @confirm="handleDeleteActivity"
        @cancel="cancelDeleteActivity"
      />

      <!-- Delete Plan Confirmation Modal -->
      <VConfirmModal
        :is-open="showDeletePlanConfirm"
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This action cannot be undone."
        confirm-text="Delete"
        cancel-text="Cancel"
        @confirm="handleDeletePlan"
        @cancel="cancelDeletePlan"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/plan'
import { useOrderedActivityStore } from '@/stores/orderedActivity'
import { storeToRefs } from 'pinia'
import type { PlanDetail, OrderedQuantity } from '@/interfaces/plan.interface'
import AddActivityModal from '@/components/activity/AddActivityModal.vue'
import EditActivityModal from '@/components/activity/EditActivityModal.vue'
import VConfirmModal from '@/components/common/VConfirmModal.vue'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

const route = useRoute()
const router = useRouter()
const planStore = usePlanStore()
const orderedActivityStore = useOrderedActivityStore()

const { currentPlan, loading, error } = storeToRefs(planStore)
const plan = computed(() => currentPlan.value as PlanDetail | null)

// Modal states
const showAddActivityModal = ref(false)
const showEditActivityModal = ref(false)
const showDeleteActivityConfirm = ref(false)
const showDeletePlanConfirm = ref(false)

const selectedActivity = ref<OrderedQuantity | null>(null)
const activityToDelete = ref<string | null>(null)

// Computed properties
const packageQuota = computed(() => {
  // Get from plan detail if available (default to 100 if not present)
  return 100
})

const currentTotalOrdered = computed(() => {
  if (!plan.value?.orderedQuantities) return 0
  return plan.value.orderedQuantities.reduce(
    (sum: number, oq: OrderedQuantity) => sum + oq.orderedQuota,
    0,
  )
})

// Lifecycle
onMounted(async () => {
  const planId = route.params.id as string
  console.log('🔄 Loading plan details for:', planId)
  await planStore.getPlanDetail(planId)
  console.log(
    '✅ Plan loaded. Status:',
    plan.value?.status,
    'Package Status:',
    plan.value?.packageStatus,
  )
})

// Methods
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
  if (status === 'Unfulfilled') return 'badge badge-orange'
  if (status === 'Fulfilled') return 'badge badge-green'
  return 'badge badge-gray'
}

async function handleActivityAdded() {
  console.log('✅ Activity added successfully')
  const planId = route.params.id as string
  await planStore.getPlanDetail(planId)
}

function handleEditActivity(activity: OrderedQuantity) {
  selectedActivity.value = activity
  showEditActivityModal.value = true
}

async function handleActivityUpdated() {
  console.log('✅ Activity updated successfully')
  const planId = route.params.id as string
  await planStore.getPlanDetail(planId)
}

// Delete Activity Methods
function confirmDeleteActivity(activityId: string) {
  activityToDelete.value = activityId
  showDeleteActivityConfirm.value = true
}

async function handleDeleteActivity() {
  if (!activityToDelete.value) return

  try {
    await orderedActivityStore.deleteOrderedActivity(activityToDelete.value)
    console.log('✅ Activity deleted successfully')

    // Close modal
    showDeleteActivityConfirm.value = false
    activityToDelete.value = null

    // Refresh plan data
    const planId = route.params.id as string
    await planStore.getPlanDetail(planId)
  } catch (error) {
    console.error('❌ Failed to delete activity:', error)
    const err = error as { response?: { data?: { message?: string } } }
    alert(err.response?.data?.message || 'Failed to delete activity')
    showDeleteActivityConfirm.value = false
  }
}

function cancelDeleteActivity() {
  showDeleteActivityConfirm.value = false
  activityToDelete.value = null
}

// Delete Plan Methods
function confirmDeletePlan() {
  showDeletePlanConfirm.value = true
}

async function handleDeletePlan() {
  if (!plan.value) return

  try {
    // Delete plan
    await axios.delete(`${BASE_URL}plans/${plan.value.id}`)

    console.log('✅ Plan deleted successfully')
    showDeletePlanConfirm.value = false

    // Navigate to package detail
    router.push(`/package/${plan.value.packageId}`)
  } catch (error) {
    console.error('❌ Failed to delete plan:', error)
    const err = error as { response?: { data?: { message?: string } } }
    alert(err.response?.data?.message || 'Failed to delete plan')
    showDeletePlanConfirm.value = false
  }
}

function cancelDeletePlan() {
  showDeletePlanConfirm.value = false
}
</script>

<style scoped>
/* Container */
.view-plan-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

.view-plan-wrapper {
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
  transition: background-color 0.2s;
}

.btn-back-error:hover {
  background-color: #5a3ca1;
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
  transition: color 0.2s ease;
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

/* Cards */
.info-card,
.activities-card {
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
}

.card-header-with-button {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  padding: 1.25rem 1.5rem;
  border-radius: 0.75rem 0.75rem 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.btn-add-activity {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  color: #6b46c1;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-activity:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.card-body {
  padding: 1.5rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
  margin: 0;
}

.info-note {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0.25rem 0 0 0;
}

.package-link {
  color: #6b46c1;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.package-link:hover {
  color: #5a3ca1;
  text-decoration: underline;
}

/* Badge */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}

.badge-green {
  background-color: #dcfce7;
  color: #15803d;
}

.badge-orange {
  background-color: #ffedd5;
  color: #c2410c;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: #ffffff;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

.btn-danger {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-danger:hover {
  background-color: #fecaca;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin: 0 auto 1rem;
}

.empty-text {
  color: #6b7280;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
}

.btn-add-empty {
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-empty:hover {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
  transform: translateY(-1px);
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
  border-bottom: 2px solid #e5e7eb;
}

.activities-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.activities-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.activities-table tbody tr:hover {
  background-color: #f9fafb;
}

.activities-table td {
  padding: 1rem;
  color: #1f2937;
}

.activity-id {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #4b5563;
}

.price-cell,
.quota-cell,
.total-cell {
  font-weight: 600;
}

.total-cell {
  color: #15803d;
}

.capacity-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.capacity-note {
  display: block;
  font-size: 0.625rem;
  color: #059669;
  font-weight: 500;
  margin-top: 0.25rem;
  font-style: italic;
}

/* Action Buttons in Table */
.actions-cell {
  padding: 0.5rem 1rem;
}

.action-buttons-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.375rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.btn-edit {
  background-color: #fef3c7;
  color: #d97706;
}

.btn-edit:hover {
  background-color: #fde68a;
}

.btn-delete {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-delete:hover {
  background-color: #fecaca;
}

/* Responsive */
@media (max-width: 768px) {
  .view-plan-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .card-header-with-button {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .btn-add-activity {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    overflow-x: scroll;
  }

  .activities-table {
    min-width: 900px;
  }
}
</style>

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
                <p class="info-note">All requirements met</p>
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
                  class="package-link"
                >
                  {{ plan.packageName }}
                </a>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button
                class="btn btn-secondary"
                @click="$router.push(`/package/${plan.packageId}`)"
              >
                View Package
              </button>
              <button
                class="btn btn-primary"
                @click="$router.push(`/plans/${plan.id}/edit`)"
              >
                Edit Plan
              </button>
              <button class="btn btn-danger">Delete Plan</button>
            </div>
          </div>
        </div>

        <!-- Ordered Activities Table -->
        <div class="activities-card">
          <div class="card-header">
            <h2 class="card-title">Ordered Activities</h2>
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
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="activity in plan.orderedQuantities" :key="activity.id">
                    <td>{{ activity.activityName }}</td>
                    <td><code class="activity-id">{{ activity.activityId }}</code></td>
                    <td>{{ formatDateTime(activity.startDate) }}</td>
                    <td>{{ formatDateTime(activity.endDate) }}</td>
                    <td class="price-cell">Rp {{ activity.price.toLocaleString('id-ID') }}</td>
                    <td class="quota-cell">{{ activity.quota }}</td>
                    <td class="quota-cell">{{ activity.orderedQuota }}</td>
                    <td class="total-cell">Rp {{ activity.total.toLocaleString('id-ID') }}</td>
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
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlanStore } from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/stores/plan.ts'
import { storeToRefs } from 'pinia'

const route = useRoute()
const planStore = usePlanStore()

const { currentPlan: plan, loading, error } = storeToRefs(planStore)

onMounted(async () => {
  const planId = route.params.id as string
  await planStore.getPlanDetail(planId)
})

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

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
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

.badge-blue {
  background-color: #dbeafe;
  color: #1e40af;
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
  margin: 0;
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

  .table-container {
    overflow-x: scroll;
  }

  .activities-table {
    min-width: 800px;
  }
}
</style>

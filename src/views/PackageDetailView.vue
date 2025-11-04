<template>
  <div class="detail-container">
    <div class="detail-wrapper">
      <!-- Back Button & Header -->
      <div class="detail-header">
        <button class="btn-back" @click="$router.push('/packages')">
          <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Packages
        </button>

        <div class="header-content">
          <h1 class="detail-title">{{ pkg?.packageName || 'Loading...' }}</h1>
          <div class="header-actions">
            <button class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Package
            </button>
            <button class="btn btn-danger">
              <svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Package Info Cards -->
      <div class="info-grid">
        <!-- Status Card -->
        <div class="info-card status-card">
          <div class="card-icon-wrapper status-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="card-label">Status</p>
            <p class="card-value">
              <span :class="statusBadge(pkg?.status)">{{ pkg?.status || '-' }}</span>
            </p>
          </div>
        </div>

        <!-- Quota Card -->
        <div class="info-card">
          <div class="card-icon-wrapper quota-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="card-label">Quota</p>
            <p class="card-value">{{ pkg?.quota || 0 }} pax</p>
          </div>
        </div>

        <!-- Price Card -->
        <div class="info-card">
          <div class="card-icon-wrapper price-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="card-label">Total Price</p>
            <p class="card-value">Rp {{ pkg?.price.toLocaleString('id-ID') || '0' }}</p>
          </div>
        </div>

        <!-- User Card -->
        <div class="info-card">
          <div class="card-icon-wrapper user-icon">
            <svg xmlns="http://www.w3.org/2000/svg" class="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="card-label">Created By</p>
            <p class="card-value">User {{ pkg?.userId || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Period Section -->
      <div class="period-card">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Travel Period
        </h2>
        <div class="period-content">
          <div class="period-item">
            <p class="period-label">Start Date</p>
            <p class="period-value">{{ formatDate(pkg?.startDate) }}</p>
          </div>
          <div class="period-divider">
            <svg xmlns="http://www.w3.org/2000/svg" class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <div class="period-item">
            <p class="period-label">End Date</p>
            <p class="period-value">{{ formatDate(pkg?.endDate) }}</p>
          </div>
        </div>
      </div>

      <!-- Plans Table -->
      <div class="plans-section">
        <div class="section-header">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Travel Plans
          </h2>
          <span class="plans-count">{{ pkg?.plans?.length || 0 }} plans</span>
        </div>

        <div v-if="!pkg?.plans || pkg.plans.length === 0" class="empty-plans">
          <svg xmlns="http://www.w3.org/2000/svg" class="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="empty-text">No plans available for this package</p>
        </div>

        <div v-else class="table-container">
          <table class="plans-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Activity</th>
                <th>Route</th>
                <th>Period</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in pkg?.plans" :key="plan.id">
                <td>
                  <div class="plan-name">{{ plan.planName }}</div>
                </td>
                <td>
                  <span class="activity-badge">{{ plan.activityType }}</span>
                </td>
                <td>
                  <div class="route-cell">
                    <div class="location">
                      <svg xmlns="http://www.w3.org/2000/svg" class="location-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ plan.startLocation }}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="route-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <div class="location">
                      <svg xmlns="http://www.w3.org/2000/svg" class="location-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ plan.endLocation }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-range">
                    <div class="date-item">{{ formatDate(plan.startDate) }}</div>
                    <div class="date-separator">-</div>
                    <div class="date-item">{{ formatDate(plan.endDate) }}</div>
                  </div>
                </td>
                <td>
                  <div class="price-cell">Rp {{ plan.price.toLocaleString('id-ID') }}</div>
                </td>
                <td>
                  <span :class="statusBadge(plan.status)">{{ plan.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { Package } from '@/interfaces/package.interface'
import type { CommonResponse } from '@/interfaces/common.response.interface'

const route = useRoute()
const pkg = ref<Package | null>(null)
const API = import.meta.env.VITE_API_BASE_URL

onMounted(async () => {
  const id = route.params.id
  const res = await axios.get<CommonResponse<Package>>(`${API}package/${id}`)
  pkg.value = res.data.data
})

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function statusBadge(status?: string) {
  if (status === 'Pending') return 'badge badge-yellow'
  if (status === 'Processed') return 'badge badge-green'
  return 'badge badge-gray'
}
</script>

<style scoped>
/* Container */
.detail-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

.detail-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Header */
.detail-header {
  margin-bottom: 2rem;
}

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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-danger {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-danger:hover {
  background-color: #fecaca;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.info-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.card-icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #ffffff;
}

.status-icon {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
}

.quota-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
}

.price-icon {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
}

.user-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
}

.card-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.card-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

/* Period Card */
.period-card {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b46c1;
}

.period-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.period-item {
  flex: 1;
}

.period-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.period-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.period-divider {
  display: flex;
  align-items: center;
}

.arrow-icon {
  width: 2rem;
  height: 2rem;
  color: #6b46c1;
}

/* Plans Section */
.plans-section {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.plans-count {
  font-size: 0.875rem;
  color: #6b7280;
  background-color: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

/* Empty State */
.empty-plans {
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
  font-size: 0.875rem;
  margin: 0;
}

/* Table */
.table-container {
  overflow-x: auto;
}

.plans-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.plans-table thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.plans-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.plans-table tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.2s ease;
}

.plans-table tbody tr:hover {
  background-color: #f9fafb;
}

.plans-table td {
  padding: 1rem;
  color: #1f2937;
}

.plan-name {
  font-weight: 600;
  color: #1f2937;
}

.activity-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: #e0e7ff;
  color: #4338ca;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.route-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.location-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: #9ca3af;
}

.route-arrow {
  width: 1rem;
  height: 1rem;
  color: #d1d5db;
  flex-shrink: 0;
}

.date-range {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-item {
  font-size: 0.75rem;
  color: #6b7280;
}

.date-separator {
  color: #d1d5db;
  font-size: 0.75rem;
}

.price-cell {
  font-weight: 600;
  color: #1f2937;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-green {
  background-color: #f0fdf4;
  color: #15803d;
}

.badge-yellow {
  background-color: #fef3c7;
  color: #b45309;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .detail-container {
    padding: 1rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .period-content {
    flex-direction: column;
    gap: 1rem;
  }

  .arrow-icon {
    transform: rotate(90deg);
  }

  .route-cell {
    flex-direction: column;
    align-items: flex-start;
  }

  .route-arrow {
    transform: rotate(90deg);
  }
}
</style>

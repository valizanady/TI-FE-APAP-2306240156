<template>
  <div class="detail-container">
    <div class="detail-wrapper">
      <!-- Back Button & Header -->
      <div class="detail-header">
        <button class="btn-back" @click="$router.push('/package')">
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
          Back to Packages
        </button>

        <div class="header-content">
          <h1 class="detail-title">{{ pkg?.packageName || 'Loading...' }}</h1>
          <div class="header-actions">
            <!-- Process Package Button (Customer only, shows for Pending packages, disabled until all plans Fulfilled) -->
            <button
              v-if="showProcessButton"
              class="btn btn-success"
              @click="handleProcessPackage"
              :disabled="!canProcess || processing"
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span v-if="processing">Processing...</span>
              <span v-else>Process Package</span>
            </button>

            <button
              v-if="canEditPackage"
              class="btn btn-secondary"
              @click="router.push(`/package/${route.params.id}/edit`)"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Package
            </button>
            <VDeleteButton v-if="pkg && canDeletePackage" :package-id="pkg.id" redirect-to="/package" />
          </div>
        </div>
      </div>

      <!-- Package Info Cards -->
      <div class="info-grid">
        <!-- Status Card -->
        <div class="info-card status-card">
          <div class="card-icon-wrapper status-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="card-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="card-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="card-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="card-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="section-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Travel Period
        </h2>
        <div class="period-content">
          <div class="period-item">
            <p class="period-label">Start Date</p>
            <p class="period-value">{{ formatDate(pkg?.startDate) }}</p>
          </div>
          <div class="period-divider">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="arrow-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
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
          <div class="section-header-left">
            <h2 class="section-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="section-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              Travel Plans
            </h2>
            <span class="plans-count">{{ pkg?.plans?.length || 0 }} plans</span>
          </div>
          <button
            v-if="pkg?.status === 'Pending'"
            class="btn btn-primary"
            @click="router.push(`/package/${route.params.id}/plans/create`)"
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
            Create New Plan
          </button>
        </div>

        <!-- Access Message (for customers viewing admin/vendor packages) -->
        <div v-if="pkg?.accessMessage && pkg.canViewPlans === false" class="access-message-card">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="info-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="access-message-text">{{ pkg.accessMessage }}</p>
        </div>

        <div v-if="!pkg?.plans || pkg.plans.length === 0" class="empty-plans">
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
          <p class="empty-text">No plans available for this package</p>
          <p class="empty-subtext">Click "Create New Plan" button above to add your first plan</p>
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
                <th>Actions</th>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="location-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ plan.startLocation }}
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="route-arrow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    <div class="location">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="location-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
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
                <td>
                  <div class="action-buttons-cell">
                    <button
                      class="btn-view"
                      @click="router.push(`/plans/${plan.id}`)"
                      title="View Plan Details"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View
                    </button>

                    <!-- Edit Plan - only if package status is Pending -->
                    <button
                      v-if="canEditPlan"
                      class="btn-edit"
                      @click="router.push(`/plans/${plan.id}/edit`)"
                      title="Edit Plan"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>

                    <!-- Delete Plan - only if package status is Pending -->
                    <button
                      v-if="canDeletePlan"
                      class="btn-delete"
                      @click="deletePlan(plan.id)"
                      title="Delete Plan"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ✅ NEW: Process Package Modal -->
    <div v-if="showProcessModal" class="modal-overlay" @click.self="closeProcessModal">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h2 class="modal-title">Confirm Package Processing</h2>
          <button
            class="modal-close"
            @click="closeProcessModal"
            :disabled="isProcessing"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
          <div class="confirmation-details">
            <div class="detail-row">
              <span class="detail-label">Package Name:</span>
              <span class="detail-value">{{ pkg?.packageName }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Quota:</span>
              <span class="detail-value">{{ pkg?.quota }} pax</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Period:</span>
              <span class="detail-value">
                {{ formatDate(pkg?.startDate) }} - {{ formatDate(pkg?.endDate) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Number of Plans:</span>
              <span class="detail-value">{{ pkg?.plans?.length || 0 }} plan(s)</span>
            </div>
          </div>

          <div class="warning-message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="warning-icon"
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
            <div>
              <p class="warning-title">This action cannot be undone</p>
              <p class="warning-text">
                Processing this package will lock it and prevent further modifications.
              </p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button
            class="btn-modal btn-cancel"
            @click="closeProcessModal"
            :disabled="isProcessing"
          >
            Cancel
          </button>
          <button
            class="btn-modal btn-confirm"
            @click="confirmProcessPackage"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="loading-spinner"></span>
            <span v-else>Confirm</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Package } from '@/interfaces/package.interface'
import type { CommonResponse } from '@/interfaces/common.response.interface'
import VDeleteButton from '@/components/package/VDeleteButton.vue'
import { usePackageStore } from '@/stores/package'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const packageStore = usePackageStore()
const authStore = useAuthStore()
const pkg = ref<Package | null>(null)
const processing = ref(false)
const API = import.meta.env.VITE_API_BASE_URL

// ✅ NEW: Modal state for Process Package
const showProcessModal = ref(false)
const isProcessing = ref(false)

const userRole = computed(() => authStore.getUserRole)
const userId = computed(() => authStore.getUserId)

onMounted(async () => {
  await loadPackage()
  checkAccessPermission()
})

async function loadPackage() {
  const id = route.params.id as string
  const res = await axios.get<CommonResponse<Package>>(`${API}package/${id}`)
  pkg.value = res.data.data
}

// Check if Customer has access to view this package
function checkAccessPermission() {
  if (!pkg.value) return

  // ⚠️ This is for UX only - Backend enforces security
  // Customer hanya bisa akses:
  // 1. Package yang dibuat sendiri
  // 2. Package dari Admin/Vendor (based on creatorRole from backend)
  if (userRole.value === 'Customer') {
    const isOwnPackage = String(pkg.value.userId) === String(userId.value)

    // Backend returns creatorRole, check if it's Admin/Vendor
    const isAdminVendorPackage =
      pkg.value.creatorRole === 'Superadmin' ||
      pkg.value.creatorRole === 'TourPackageVendor' ||
      pkg.value.creatorRole === null  // Backward compatibility for old data

    if (!isOwnPackage && !isAdminVendorPackage) {
      alert('⚠️ You do not have permission to view this package')
      router.push('/package')
    }
  }
}

// Check if user can edit this package
const canEditPackage = computed(() => {
  if (!pkg.value) return false

  // Customer hanya bisa edit package sendiri
  if (userRole.value === 'Customer') {
    return String(pkg.value.userId) === String(userId.value)
  }

  // Vendor/Admin bisa edit semua
  return ['Superadmin', 'TourPackageVendor'].includes(userRole.value || '')
})

// Check if user can delete this package
const canDeletePackage = computed(() => {
  if (!pkg.value) return false

  // Customer hanya bisa delete package sendiri dengan status Pending
  if (userRole.value === 'Customer') {
    return (
      String(pkg.value.userId) === String(userId.value) && pkg.value.status === 'Pending'
    )
  }

  // Vendor/Admin bisa delete semua yang Pending
  return (
    ['Superadmin', 'TourPackageVendor'].includes(userRole.value || '') &&
    pkg.value.status === 'Pending'
  )
})

// Computed: Check if Process Package button should be shown (CUSTOMER ONLY FEATURE)
const showProcessButton = computed(() => {
  if (!pkg.value) return false

  // ✅ Button is ONLY for Customer role
  if (userRole.value !== 'Customer') return false

  // ✅ Package status must be Pending
  const isPending = pkg.value.status === 'Pending'
  if (!isPending) return false

  // ✅ Show button for own packages OR packages from admin/vendor
  // Customer can process any package as long as it's fulfilled
  return true
})

// Computed: Check if Process Package button is enabled
const canProcess = computed(() => {
  if (!showProcessButton.value || !pkg.value) return false

  // ✅ Use backend's canProcess flag if available
  if (pkg.value.canProcess !== undefined && pkg.value.canProcess !== null) {
    return pkg.value.canProcess
  }

  // ✅ Fallback: Check if all plans are fulfilled (for backward compatibility)
  if (!pkg.value.plans || pkg.value.plans.length === 0) return false
  const allPlansFulfilled = pkg.value.plans.every((plan) => plan.status === 'Fulfilled')

  return allPlansFulfilled
})

// Computed: Check if plans can be edited (only if package status is Pending)
const canEditPlan = computed(() => {
  if (!pkg.value) return false

  // Customer hanya bisa edit plan dari package sendiri
  if (userRole.value === 'Customer') {
    return (
      String(pkg.value.userId) === String(userId.value) && pkg.value.status === 'Pending'
    )
  }

  // Vendor/Admin bisa edit semua plan yang Pending
  return pkg.value.status === 'Pending'
})

// Computed: Check if plans can be deleted (only if package status is Pending)
const canDeletePlan = computed(() => {
  if (!pkg.value) return false

  // Customer hanya bisa delete plan dari package sendiri
  if (userRole.value === 'Customer') {
    return (
      String(pkg.value.userId) === String(userId.value) && pkg.value.status === 'Pending'
    )
  }

  // Vendor/Admin bisa delete semua plan yang Pending
  return pkg.value.status === 'Pending'
})

// Delete plan function
async function deletePlan(planId: string) {
  const confirmed = confirm(
    'Are you sure you want to delete this plan?\n\nThis action cannot be undone.',
  )

  if (!confirmed) return

  try {
    await axios.delete(`${API}plans/${planId}`)
    alert('✅ Plan deleted successfully!')

    // Reload package data
    await loadPackage()
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete plan'
    alert(`❌ Error deleting plan:\n\n${errorMsg}`)
  }
}

// ✅ NEW: Open Process Modal (with validation)
function handleProcessPackage() {
  if (!pkg.value) return

  // Show modal for confirmation
  showProcessModal.value = true
}

// ✅ NEW: Validate & Process Package
async function confirmProcessPackage() {
  if (!pkg.value) return

  // ✅ FRONTEND VALIDATION 1: Package must be Pending
  if (pkg.value.status !== 'Pending') {
    alert('❌ Only packages with "Pending" status can be processed.')
    showProcessModal.value = false
    return
  }

  // ✅ Use backend's canProcess flag if available
  if (pkg.value.canProcess !== undefined && pkg.value.canProcess !== null) {
    if (!pkg.value.canProcess) {
      alert('❌ This package cannot be processed yet. Please ensure all plans are fulfilled.')
      return  // Keep modal open
    }
    // ✅ Backend says canProcess = true, skip frontend validations
    // (Plans might be hidden for Customer viewing admin packages)
  } else {
    // ✅ Fallback to frontend validations (backward compatibility)

    // VALIDATION 2: Must have at least 1 plan
    if (!pkg.value.plans || pkg.value.plans.length === 0) {
      alert('❌ This package cannot be processed because it has no plans.')
      return  // Keep modal open
    }

    // VALIDATION 3: All plans must be Fulfilled
    const hasUnfulfilledPlan = pkg.value.plans.some((plan) => plan.status !== 'Fulfilled')
    if (hasUnfulfilledPlan) {
      const fulfilledCount = pkg.value.plans.filter((p) => p.status === 'Fulfilled').length
      const totalCount = pkg.value.plans.length
      alert(
        `❌ All plans must be fulfilled before processing this package.\n\n` +
        `Current status: ${fulfilledCount}/${totalCount} plans fulfilled.\n\n` +
        `Please ensure all plans are fulfilled first.`,
      )
      return  // Keep modal open
    }
  }

  // ✅ All validations passed - call API
  isProcessing.value = true

  try {
    await packageStore.processPackage(pkg.value.id)

    // Success
    showProcessModal.value = false
    alert('✅ Package processed successfully!')

    // Reload package data
    await loadPackage()
  } catch (error) {
    // Error from backend
    let errorMsg = 'Failed to process package'

    if (error instanceof Error) {
      errorMsg = error.message
    }

    alert(`❌ There was an error processing this package: ${errorMsg}`)
    // Keep modal open on error
  } finally {
    isProcessing.value = false
  }
}

// ✅ NEW: Close modal
function closeProcessModal() {
  if (!isProcessing.value) {
    showProcessModal.value = false
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
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

.btn-primary {
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: #ffffff;
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
}

.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-success {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: #ffffff;
  border: none;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

.btn-success:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-danger {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-danger:hover {
  background-color: #fecaca;
}

/* View Button */
.action-buttons-cell {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-view {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view:hover {
  background: linear-gradient(135deg, #5a3ca1 0%, #7c4ee6 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(107, 70, 193, 0.2);
}

.btn-view .btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn-edit {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit:hover {
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
}

.btn-edit .btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn-delete {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.2);
}

.btn-delete .btn-icon {
  width: 1rem;
  height: 1rem;
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
  margin: 0;
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
  margin-top: 1rem;
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

/* Access Message Card */
.access-message-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #93c5fd;
  border-radius: 0.75rem;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.access-message-text {
  margin: 0;
  color: #1e40af;
  font-size: 0.9375rem;
  line-height: 1.6;
  font-weight: 500;
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
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
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
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
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

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-header-left {
    width: 100%;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

/* Process Package Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px 24px 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: #f5f5f5;
  color: #1a1a1a;
}

.close-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-body {
  padding: 24px;
}

.package-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-weight: 500;
  color: #666;
}

.detail-value {
  font-weight: 600;
  color: #1a1a1a;
}

.warning-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
}

.warning-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-text {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.modal-footer {
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel,
.btn-confirm {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #e0e0e0;
  color: #1a1a1a;
}

.btn-confirm {
  background-color: #28a745;
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background-color: #218838;
}

.btn-cancel:disabled,
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }

  .modal-header h3 {
    font-size: 18px;
  }

  .detail-row {
    flex-direction: column;
    gap: 4px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
    justify-content: center;
  }
}
</style>

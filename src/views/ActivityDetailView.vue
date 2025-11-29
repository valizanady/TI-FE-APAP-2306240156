<template>
  <div class="activity-detail-container">
    <div class="activity-detail-wrapper">
      <!-- Loading State -->
      <div v-if="activityStore.isLoading" class="state-card loading-state">
        <div class="spinner-large"></div>
        <p class="state-text">Loading activity details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="activityStore.error" class="state-card error-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="state-icon error-icon"
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
        <h3 class="state-title">⚠️ Error Loading Activity</h3>
        <p class="state-message">{{ activityStore.error }}</p>
        <router-link to="/activities" class="btn-back-large">
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Activities
        </router-link>
      </div>

      <!-- Activity Detail -->
      <div v-else-if="activity" class="detail-content">
        <!-- Header with Gradient Background -->
        <div class="detail-header-gradient">
          <div class="header-actions-top">
            <router-link to="/activities" class="btn-back-white">
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Activities
            </router-link>
            <div class="action-buttons-group">
              <router-link
                v-if="canEdit"
                :to="`/activities/${activity.id}/edit`"
                class="btn-edit-white"
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
                Edit Activity
              </router-link>
              <button v-if="canDelete" @click="openDeleteModal" class="btn-delete-white">
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
          </div>

          <div class="header-content-main">
            <div class="title-section">
              <h1 class="activity-title-large">{{ activity.activityName }}</h1>
              <p class="activity-description">{{ activity.activityItem }}</p>
            </div>
            <div class="badges-row-large">
              <span :class="typeColorClass(activity.activityType)" class="type-badge-large">
                {{ getTypeIcon(activity.activityType) }} {{ activity.activityType }}
              </span>
              <span v-if="activity.isDeleted" class="status-badge-large badge-inactive">
                ⚠️ Inactive
              </span>
              <span v-else class="status-badge-large badge-active">✓ Active</span>
            </div>
          </div>
        </div>

        <!-- Quick Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card stat-price">
            <div class="stat-icon-wrapper stat-icon-green">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stat-icon"
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
            <div class="stat-content">
              <div class="stat-label">Price per Person</div>
              <div class="stat-value stat-value-large">
                {{ activity ? formatCurrency(activity.price) : '-' }}
              </div>
            </div>
          </div>

          <div class="stat-card stat-capacity">
            <div class="stat-icon-wrapper stat-icon-blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stat-icon"
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
            <div class="stat-content">
              <div class="stat-label">Capacity</div>
              <div class="stat-value">{{ activity ? `${activity.capacity} people` : '-' }}</div>
            </div>
          </div>

          <div class="stat-card stat-duration">
            <div class="stat-icon-wrapper stat-icon-purple">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stat-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-label">Duration</div>
              <div class="stat-value">{{ calculateDuration() }}</div>
            </div>
          </div>
        </div>

        <!-- Main Info Grid -->
        <div class="info-grid">
          <!-- Location & Schedule Card -->
          <div class="info-card">
            <div class="card-header">


              <h2 class="card-title">Location & Schedule</h2>
            </div>
            <div class="card-body">
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    Start Location
                  </div>
                  <div class="info-value">{{ activity.startLocation }}</div>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    End Location
                  </div>
                  <div class="info-value">{{ activity.endLocation }}</div>
                </div>
              </div>

              <div class="divider"></div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    Start Date & Time
                  </div>
                  <div class="info-value info-value-highlight">
                    {{ formatDateTime(activity.startDate) }}
                  </div>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">
                    End Date & Time
                  </div>
                  <div class="info-value info-value-highlight">
                    {{ formatDateTime(activity.endDate) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Activity Details Card -->
          <div class="info-card">
            <div class="card-header">

              <h2 class="card-title">Activity Details</h2>
            </div>
            <div class="card-body">
              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    Activity Type
                  </div>
                  <span :class="typeColorClass(activity.activityType)" class="type-badge-small">
                    {{ getTypeIcon(activity.activityType) }} {{ activity.activityType }}
                  </span>
                </div>
              </div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    Activity ID
                  </div>
                  <div class="info-value info-value-mono">{{ activity.id }}</div>
                </div>
              </div>

              <div v-if="authStore.user?.role === 'Superadmin'" class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    Vendor ID
                  </div>
                  <div class="info-value info-value-mono">{{ activity.vendorId }}</div>
                </div>
              </div>

              <div class="divider"></div>

              <div class="info-row">
                <div class="info-item">
                  <div class="info-label">

                    Status
                  </div>
                  <span v-if="activity.isDeleted" class="status-badge badge-inactive">
                    Inactive
                  </span>
                  <span v-else class="status-badge badge-active">Active</span>
                </div>
              </div>

              <div v-if="activity.isDeleted" class="warning-box">
            
                <p class="warning-text">
                  This activity is marked as inactive and may not be visible to customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Not Found -->
      <div v-else class="state-card">
        <div class="empty-icon-wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="state-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="state-title">Activity Not Found</h3>
        <p class="state-description">The activity you're looking for doesn't exist.</p>
        <router-link to="/activities" class="btn-primary btn-large">
          ← Back to Activities
        </router-link>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="modal-icon"
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
            Delete Activity
          </h3>
          <button @click="closeDeleteModal" class="modal-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
        <div class="modal-body">
          <p class="modal-description">
            Are you sure you want to <strong class="text-danger">delete</strong> this activity?
          </p>
          <div class="modal-info">
            <div class="info-row-modal">
              <span class="info-label-modal">Activity Name:</span>
              <span class="info-value-modal">{{ activity?.activityName }}</span>
            </div>
            <div class="info-row-modal">
              <span class="info-label-modal">Type:</span>
              <span class="info-value-modal">{{ activity?.activityType }}</span>
            </div>
          </div>
          <div class="modal-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="warning-icon-modal"
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
            <div>
              <p class="warning-text-modal">
                This is a <strong>soft delete</strong>. The activity will be marked as inactive.
              </p>
              <p class="warning-note-modal">
                You cannot delete activities with unfulfilled orders.
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeDeleteModal" class="btn-cancel">Cancel</button>
          <button @click="deleteActivity" class="btn-confirm-delete">Delete Activity</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const route = useRoute()
const router = useRouter()
const activityStore = useActivityStore()
const authStore = useAuthStore()

const showDeleteModal = ref(false)

const activity = computed(() => activityStore.currentActivity)

const canEdit = computed(() => {
  if (!activity.value || !authStore.user) return false
  const user = authStore.user
  if (user.role === 'Superadmin') return true
  return activity.value.vendorId === user.id && !activity.value.isDeleted
})

const canDelete = computed(() => {
  if (!activity.value || !authStore.user) return false
  const user = authStore.user
  if (user.role === 'Superadmin') return true
  return activity.value.vendorId === user.id && !activity.value.isDeleted
})

const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    Flight: '✈️',
    Accommodation: '🏨',
    'Vehicle Rental': '🚗',
    'Tour Activity': '🎯',
  }
  return icons[type] || '📋'
}

const typeColorClass = (type: string) => {
  const colors: Record<string, string> = {
    Flight: 'badge-flight',
    Accommodation: 'badge-accommodation',
    'Vehicle Rental': 'badge-rental',
    'Tour Activity': 'badge-tour',
  }
  return colors[type] || 'badge-default'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const calculateDuration = () => {
  if (!activity.value) return '-'
  const start = new Date(activity.value.startDate)
  const end = new Date(activity.value.endDate)
  const diffMs = end.getTime() - start.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

// Modal handlers
const openDeleteModal = () => {
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
}

const deleteActivity = async () => {
  if (!activity.value) return

  try {
    await activityStore.deleteActivity(activity.value.id)
    toast.success('✅ Activity deleted successfully!')
    closeDeleteModal()
    router.push('/activities')
  } catch (error) {
    console.error('Failed to delete activity:', error)
    const err = error as { response?: { data?: { message?: string } } }
    toast.error(err.response?.data?.message || '❌ Failed to delete activity')
  }
}

// Load activity on mount
onMounted(async () => {
  const activityId = route.params.id as string
  if (activityId) {
    await activityStore.fetchActivityById(activityId)
  }
})
</script>

<style scoped>
/* Container */
.activity-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  padding: 2rem;
}

.activity-detail-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* State Cards */
.state-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 4px solid #e5e7eb;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-text {
  font-size: 1.125rem;
  color: #6b7280;
  font-weight: 500;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.state-icon {
  width: 64px;
  height: 64px;
}

.error-icon {
  color: #ef4444;
}

.state-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.state-message {
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
}

.btn-back-large {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  margin-top: 1rem;
}

.btn-back-large:hover {
  background-color: #4f46e5;
  transform: translateY(-1px);
}

/* Header with Gradient */
.detail-header-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 1rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.header-actions-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.action-buttons-group {
  display: flex;
  gap: 1rem;
}

.btn-back-white,
.btn-edit-white,
.btn-delete-white {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: white;
  color: #6366f1;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-back-white:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

.btn-edit-white {
  color: #8b5cf6;
}

.btn-edit-white:hover {
  background-color: #f5f3ff;
}

.btn-delete-white {
  color: #ef4444;
}

.btn-delete-white:hover {
  background-color: #fef2f2;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.header-content-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-title-large {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.activity-description {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.6;
}

.badges-row-large {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.type-badge-large,
.status-badge-large {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
}

.badge-flight {
  color: #2563eb;
  background-color: white;
}

.badge-accommodation {
  color: #7c3aed;
  background-color: white;
}

.badge-rental {
  color: #059669;
  background-color: white;
}

.badge-tour {
  color: #ea580c;
  background-color: white;
}

.badge-active {
  color: #059669;
}

.badge-inactive {
  color: #dc2626;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon {
  width: 28px;
  height: 28px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.stat-value-large {
  font-size: 1.875rem;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.card-icon {
  width: 24px;
  height: 24px;
  color: #6366f1;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-subtitle {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  flex-shrink: 0;
  min-width: 120px;
}

.info-value {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
  text-align: right;
}

.info-value-mono {
  font-family: 'Courier New', monospace;
  font-size: 0.813rem;
  color: #6366f1;
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
}

.type-badge-small {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.813rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.warning-box {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
}

.warning-icon-box {
  width: 24px;
  height: 24px;
  color: #d97706;
  flex-shrink: 0;
}

.warning-text {
  font-size: 0.875rem;
  color: #78350f;
  line-height: 1.5;
  margin: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f3f4f6;
  border-radius: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.text-danger {
  color: #dc2626;
}

.modal-info {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.info-row-modal {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.info-label-modal {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.info-value-modal {
  font-size: 0.875rem;
  color: #111827;
  font-weight: 600;
}

.modal-warning {
  display: flex;
  gap: 0.75rem;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 0.5rem;
  padding: 1rem;
}

.warning-icon-modal {
  width: 20px;
  height: 20px;
  color: #dc2626;
  flex-shrink: 0;
}

.warning-text-modal {
  font-size: 0.875rem;
  color: #991b1b;
  margin: 0 0 0.5rem 0;
}

.warning-note-modal {
  font-size: 0.813rem;
  color: #dc2626;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 2px solid #f3f4f6;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.btn-confirm-delete {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-delete:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .activity-detail-container {
    padding: 1rem;
  }

  .detail-header-gradient {
    padding: 1.5rem;
  }

  .header-actions-top {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .action-buttons-group {
    flex-direction: column;
  }

  .activity-title-large {
    font-size: 1.875rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

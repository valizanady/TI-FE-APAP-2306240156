<template>
  <div class="activity-container">
    <div class="activity-wrapper">
      <!-- Header with gradient -->
      <div class="activity-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="activity-title">Activity Management</h1>
            <p class="activity-subtitle">Manage activities for tour packages</p>
          </div>
          <div class="stats-badge">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stats-icon"
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
            <div>
              <div class="stats-number">{{ sortedActivities.length }}</div>
              <div class="stats-label">Total Activities</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Card -->
      <div class="filters-card">
        <div class="filters-header">
          <h3 class="filters-title">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="filter-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters & Search
          </h3>
          <button @click="clearFilters" class="btn-clear">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Clear All
          </button>
        </div>

        <div class="filters-grid">
          <!-- Activity Type Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="label-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              Activity Type
            </label>
            <select v-model="filters.activityType" @change="applyFilters" class="filter-select">
              <option value="">All Types</option>
              <option value="Flight">✈️ Flight</option>
              <option value="Accommodation">🏨 Accommodation</option>
              <option value="Vehicle Rental">🚗 Vehicle Rental</option>
              <option value="Tour Activity">🎯 Tour Activity</option>
            </select>
          </div>

          <!-- Start Location Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="label-icon"
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
              Start Location
            </label>
            <input
              v-model="filters.startLocation"
              @input="debouncedSearch"
              type="text"
              placeholder="e.g., Jakarta"
              class="filter-input"
            />
          </div>

          <!-- End Location Filter -->
          <div class="filter-group">
            <label class="filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="label-icon"
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
              </svg>
              End Location
            </label>
            <input
              v-model="filters.endLocation"
              @input="debouncedSearch"
              type="text"
              placeholder="e.g., Bali"
              class="filter-input"
            />
          </div>

          <!-- Search -->
          <div class="filter-group">
            <label class="filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="label-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search Name/Item
            </label>
            <input
              v-model="filters.search"
              @input="debouncedSearch"
              type="text"
              placeholder="Search by name or item..."
              class="filter-input"
            />
          </div>
        </div>

        <!-- Date Range Filters -->
        <div class="date-filters">
          <div class="filter-group">
            <label class="filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="label-icon"
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
              Start Date From
            </label>
            <input
              v-model="filters.startDate"
              @change="applyFilters"
              type="date"
              class="filter-input"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="label-icon"
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
              End Date Until
            </label>
            <input
              v-model="filters.endDate"
              @change="applyFilters"
              type="date"
              class="filter-input"
            />
          </div>
        </div>

        <!-- Show Deleted Toggle -->
        <div class="filter-toggle">
          <label class="toggle-label">
            <input
              v-model="filters.showDeleted"
              @change="applyFilters"
              type="checkbox"
              class="toggle-checkbox"
            />
            <span class="toggle-text">Show deleted activities</span>
            <span v-if="!canViewDeleted" class="toggle-badge">(Superadmin/Vendor only)</span>
          </label>
        </div>
      </div>

      <!-- Action Bar -->
      <div v-if="canCreate" class="action-bar">
        <router-link to="/activities/create" class="btn-create">
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
          Create Activity
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="state-card">
        <div class="spinner"></div>
        <p class="state-text">Loading activities...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-card">
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
        <h3 class="error-title">Error Loading Activities</h3>
        <p class="error-message">{{ error }}</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="sortedActivities.length === 0"
        class="state-card"
      >
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 class="state-title">No Activities Found</h3>
        <p class="state-description">
          {{
            filters.search || filters.activityType || filters.startLocation || filters.endLocation
              ? 'Try adjusting your filters or clearing them'
              : 'Create your first activity to get started!'
          }}
        </p>
        <button v-if="canCreate && !filters.search && !filters.activityType" class="btn-create btn-large" @click="$router.push('/activities/create')">
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
          Create First Activity
        </button>
        <button v-else class="btn-secondary btn-large" @click="clearFilters">
          Clear Filters
        </button>
      </div>

      <!-- Activities Table -->
      <div v-else class="table-card">
        <table class="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Type</th>
              <th>Location</th>
              <th>Price</th>
              <th>Capacity</th>
              <th class="sortable-header" @click="toggleSortOrder" title="Click to toggle sort order">
                <div class="sort-header">
                  Dates
                  <span class="sort-indicator">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="activity in sortedActivities"
              :key="activity.id"
              :class="{ 'row-deleted': activity.isDeleted }"
            >
              <!-- Activity Name & Item -->
              <td>
                <div class="cell-activity">
                  <div class="activity-name">{{ activity.activityName }}</div>
                  <div class="activity-item">{{ activity.activityItem }}</div>
                </div>
              </td>

              <!-- Type -->
              <td>
                <span :class="getTypeBadgeClass(activity.activityType)" class="badge">
                  {{ activity.activityType }}
                </span>
              </td>

              <!-- Location -->
              <td>
                <div class="cell-location">
                  {{ activity.startLocation }} → {{ activity.endLocation }}
                </div>
              </td>

              <!-- Price -->
              <td>
                <div class="cell-price">Rp {{ formatCurrency(activity.price) }}</div>
              </td>

              <!-- Capacity -->
              <td>
                <span class="badge badge-capacity">{{ activity.capacity }} pax</span>
              </td>

              <!-- Dates -->
              <td>
                <div class="cell-dates">
                  <div class="date-start">{{ formatDate(activity.startDate) }}</div>
                  <div class="date-end">to {{ formatDate(activity.endDate) }}</div>
                </div>
              </td>

              <!-- Status -->
              <td>
                <span :class="activity.isDeleted ? 'badge badge-inactive' : 'badge badge-active'">
                  {{ activity.isDeleted ? 'Inactive' : 'Active' }}
                </span>
              </td>

              <!-- Actions -->
              <td>
                <div class="action-buttons">
                  <router-link
                    v-if="!activity.isDeleted"
                    :to="`/activities/${activity.id}`"
                    class="btn-action btn-view"
                    title="View Detail"
                  >
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </router-link>

                  <router-link
                    v-if="canEdit(activity)"
                    :to="`/activities/${activity.id}/edit`"
                    class="btn-action btn-edit"
                    title="Edit Activity"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </router-link>

                  <button
                    v-if="canDelete(activity)"
                    @click="confirmDelete(activity)"
                    class="btn-action btn-delete"
                    title="Delete Activity"
                  >
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-description">
              Are you sure you want to <strong class="text-danger">delete</strong> this activity?
            </p>
            <div class="modal-info">
              <div class="info-row">
                <span class="info-label">Activity Name:</span>
                <span class="info-value">{{ activityToDelete?.activityName }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Type:</span>
                <span class="info-value">{{ activityToDelete?.activityType }}</span>
              </div>
            </div>
            <div class="modal-warning">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="warning-text">
                  This is a <strong>soft delete</strong>. The activity will be marked as inactive.
                </p>
                <p class="warning-note">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivityStore } from '@/stores/activity'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import type { Activity } from '@/interfaces/activity.interface'

const activityStore = useActivityStore()
const authStore = useAuthStore()

const activities = computed(() => activityStore.getActivities)
const isLoading = computed(() => activityStore.isLoading)
const error = computed(() => activityStore.error)

const userRole = computed(() => authStore.getUserRole)
const userId = computed(() => authStore.getUserId)

// Sorting
const sortOrder = ref<'asc' | 'desc'>('asc')

// Sorted activities (default: startDate ascending)
const sortedActivities = computed(() => {
  const sorted = [...activities.value].sort((a, b) => {
    const dateA = new Date(a.startDate).getTime()
    const dateB = new Date(b.startDate).getTime()
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })
  return sorted
})

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Filters
const filters = ref({
  activityType: '',
  startLocation: '',
  endLocation: '',
  search: '',
  startDate: '',
  endDate: '',
  showDeleted: false,
})

// Delete modal
const showDeleteModal = ref(false)
const activityToDelete = ref<Activity | null>(null)

// Check if user can view deleted activities
const canViewDeleted = computed(() => {
  return [
    'Superadmin',
    'TourPackageVendor',
    'FlightAirline',
    'AccommodationOwner',
    'RentalVendor',
  ].includes(userRole.value || '')
})

// Check if user can create activities
const canCreate = computed(() => {
  return [
    'Superadmin',
    'TourPackageVendor',
    'FlightAirline',
    'AccommodationOwner',
    'RentalVendor',
  ].includes(userRole.value || '')
})

// Check if user can edit activity
const canEdit = (activity: Activity) => {
  if (activity.isDeleted) return false
  if (userRole.value === 'Superadmin') return true
  return activity.vendorId === userId.value
}

// Check if user can delete activity
const canDelete = (activity: Activity) => {
  if (activity.isDeleted) return false
  if (userRole.value === 'Superadmin') return true
  return activity.vendorId === userId.value
}

// Apply filters
const applyFilters = async () => {
  const filterParams: Record<string, string | boolean> = {}

  // Only show deleted if user has permission
  if (filters.value.showDeleted && canViewDeleted.value) {
    // Don't add isDeleted filter, show all
  } else {
    filterParams.isDeleted = false
  }

  if (filters.value.activityType) {
    filterParams.activityType = filters.value.activityType
  }

  if (filters.value.startLocation) {
    filterParams.startLocation = filters.value.startLocation
  }

  if (filters.value.endLocation) {
    filterParams.endLocation = filters.value.endLocation
  }

  if (filters.value.search) {
    filterParams.search = filters.value.search
  }

  if (filters.value.startDate) {
    filterParams.startDate = filters.value.startDate
  }

  if (filters.value.endDate) {
    filterParams.endDate = filters.value.endDate
  }

  await activityStore.fetchActivities(filterParams)
}

// Debounced search
let searchTimeout: ReturnType<typeof setTimeout>
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
}

// Clear all filters
const clearFilters = () => {
  filters.value = {
    activityType: '',
    startLocation: '',
    endLocation: '',
    search: '',
    startDate: '',
    endDate: '',
    showDeleted: false,
  }
  sortOrder.value = 'asc' // Reset to default sort
  applyFilters()
}

// Delete confirmation
const confirmDelete = (activity: Activity) => {
  activityToDelete.value = activity
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  activityToDelete.value = null
}

const deleteActivity = async () => {
  if (!activityToDelete.value) return

  try {
    await activityStore.deleteActivity(activityToDelete.value.id)
    toast.success('✅ Activity deleted successfully')
    closeDeleteModal()
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } }
    const errorMsg = error.response?.data?.message || 'Failed to delete activity'
    toast.error(`❌ ${errorMsg}`)
  }
}

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getTypeBadgeClass = (type: string): string => {
  const classes: Record<string, string> = {
    Flight: 'badge-flight',
    Accommodation: 'badge-accommodation',
    'Vehicle Rental': 'badge-rental',
    'Tour Activity': 'badge-tour',
  }
  return classes[type] || 'badge-default'
}

// Load activities on mount
onMounted(async () => {
  await applyFilters()
})
</script>

<style scoped>

/* Header with Card Style */
.activity-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.activity-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-text {
  flex: 1;
  min-width: 280px;
}

.activity-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.activity-subtitle {
  color: #718096;
  margin: 0;
  font-size: 1rem;
}

.stats-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.stats-icon {
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.9;
}

.stats-number {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1;
}

.stats-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Filters Card */
.filters-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.filters-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #667eea;
}

.btn-clear {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  color: #2d3748;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.date-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.label-icon {
  width: 1rem;
  height: 1rem;
  color: #667eea;
}

.filter-select,
.filter-input {
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #2d3748;
  transition: all 0.2s;
  background: white;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select:hover,
.filter-input:hover {
  border-color: #cbd5e0;
}

.filter-toggle {
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #667eea;
}

.toggle-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.toggle-badge {
  font-size: 0.75rem;
  color: #a0aec0;
  font-style: italic;
}

/* Action Bar */
.action-bar {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-secondary {
  background: #718096;
  box-shadow: 0 4px 6px -1px rgba(113, 128, 150, 0.3);
}

.btn-secondary:hover {
  box-shadow: 0 10px 15px -3px rgba(113, 128, 150, 0.4);
}

/* State Cards */
.state-card {
  background: white;
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.error-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-text {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.empty-icon-wrapper {
  display: inline-flex;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.state-icon {
  width: 4rem;
  height: 4rem;
  color: #667eea;
}

.state-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.state-description {
  color: #718096;
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #f56565;
  margin: 0 auto 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.error-message {
  color: #718096;
  margin: 0;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.activity-table {
  width: 100%;
  border-collapse: collapse;
}

.activity-table thead {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.activity-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sortable-header {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.sortable-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.sort-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-indicator {
  font-size: 1rem;
  opacity: 0.8;
}

.activity-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s;
}

.activity-table tbody tr:hover {
  background: #f7fafc;
}

.activity-table tbody tr.row-deleted {
  opacity: 0.6;
  background: #fff5f5;
}

.activity-table tbody tr.row-deleted:hover {
  background: #fed7d7;
}

.activity-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #2d3748;
}

/* Cell Styles */
.cell-activity {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-name {
  font-weight: 600;
  color: #2d3748;
}

.activity-item {
  font-size: 0.8125rem;
  color: #718096;
}

.cell-location {
  font-size: 0.875rem;
  color: #4a5568;
  white-space: nowrap;
}

.cell-price {
  font-weight: 600;
  color: #2d3748;
  white-space: nowrap;
}

.cell-dates {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-start {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.8125rem;
}

.date-end {
  font-size: 0.75rem;
  color: #718096;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-flight {
  background: #dbeafe;
  color: #1e40af;
}

.badge-accommodation {
  background: #fce7f3;
  color: #9f1239;
}

.badge-rental {
  background: #d1fae5;
  color: #065f46;
}

.badge-tour {
  background: #fef3c7;
  color: #92400e;
}

.badge-default {
  background: #e2e8f0;
  color: #4a5568;
}

.badge-capacity {
  background: #e0e7ff;
  color: #3730a3;
}

.badge-active {
  background: #d1fae5;
  color: #065f46;
}

.badge-inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-action svg {
  width: 1.125rem;
  height: 1.125rem;
}

.btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.btn-view:hover {
  background: #bfdbfe;
  transform: scale(1.1);
}

.btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-edit:hover {
  background: #fde68a;
  transform: scale(1.1);
}

.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s;
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
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.3s;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.modal-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #f59e0b;
}

.modal-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #718096;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f7fafc;
  color: #2d3748;
}

.modal-close svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-description {
  color: #4a5568;
  margin: 0 0 1.5rem 0;
  font-size: 0.9375rem;
}

.text-danger {
  color: #dc2626;
}

.modal-info {
  background: #f7fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.info-row:not(:last-child) {
  border-bottom: 1px solid #e2e8f0;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #718096;
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
}

.modal-warning {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 0.5rem;
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #d97706;
  flex-shrink: 0;
}

.warning-text {
  font-size: 0.875rem;
  color: #92400e;
  margin: 0 0 0.25rem 0;
}

.warning-note {
  font-size: 0.8125rem;
  color: #92400e;
  opacity: 0.8;
  margin: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  padding: 0.625rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.btn-confirm-delete {
  padding: 0.625rem 1.25rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-delete:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.3);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .activity-container {
    padding: 1rem;
  }

  .activity-header {
    padding: 1.5rem;
  }

  .activity-title {
    font-size: 1.5rem;
  }

  .stats-badge {
    padding: 0.75rem 1rem;
  }

  .filters-grid,
  .date-filters {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-badge {
    justify-content: center;
  }

  .table-card {
    overflow-x: auto;
  }

  .activity-table {
    min-width: 900px;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style>

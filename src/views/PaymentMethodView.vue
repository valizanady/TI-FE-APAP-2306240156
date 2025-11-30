<template>
  <div class="activity-container">
    <div class="activity-wrapper">
      <div class="activity-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="activity-title">💰 Payment Methods</h1>
            <p class="activity-subtitle">Manage payment methods for top-up transactions</p>
          </div>
          <router-link to="/payment-methods/create" class="stats-badge link-style">
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
                d="M12 9v3m0 3h.01M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <div>
              <div class="stats-number">+</div>
              <div class="stats-label">Add Method</div>
            </div>
          </router-link>
        </div>
      </div>

      <div v-if="isLoading" class="state-card">
        <div class="spinner"></div>
        <p class="state-text">Loading payment methods...</p>
      </div>

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
        <h3 class="error-title">Error Loading Methods</h3>
        <p class="error-message">❌ {{ error }}</p>
      </div>

      <div v-else-if="paymentMethods.length === 0" class="state-card">
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
              d="M12 8c1.657 0 3 .895 3 2s-1.343 2-3 2-3 .895-3 2 1.343 2 3 2m-3-2h6m-9 0h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 class="state-title">No Payment Methods Yet</h3>
        <p class="state-description">Add your first payment method to enable top-up transactions.</p>
        <router-link to="/payment-methods/create" class="btn-create btn-large inline-block">
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
          Add Payment Method
        </router-link>
      </div>

      <div v-else class="filters-card">
        <div class="filters-header border-b-0 pb-0">
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
            Filter & Display Options
          </h3>
        </div>

        <div class="filters-grid mt-4">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002.944 12c.045 4.098 1.499 7.962 3.843 10.323a10.99 10.99 0 0014.288-14.288z"
                />
              </svg>
              Filter by Status
            </label>
            <select v-model="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              Sort by
            </label>
            <select v-model="sortBy" class="filter-select">
              <option value="methodName">Method Name</option>
              <option value="provider">Provider</option>
              <option value="createdAt">Created Date</option>
            </select>
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
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Results per page
            </label>
            <select v-model.number="itemsPerPage" class="filter-select">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && !error && paymentMethods.length > 0" class="table-card">
        <table class="activity-table">
          <thead>
            <tr>
              <th
                class="sortable-header"
                @click="toggleSort('methodName')"
                title="Click to toggle sort order"
              >
                <div class="sort-header">
                  Method Name
                  <span v-if="sortBy === 'methodName'" class="sort-indicator">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th
                class="sortable-header"
                @click="toggleSort('provider')"
                title="Click to toggle sort order"
              >
                <div class="sort-header">
                  Provider
                  <span v-if="sortBy === 'provider'" class="sort-indicator">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th>Status</th>
              <th
                class="sortable-header"
                @click="toggleSort('createdAt')"
                title="Click to toggle sort order"
              >
                <div class="sort-header">
                  Created At
                  <span v-if="sortBy === 'createdAt'" class="sort-indicator">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="method in paginatedMethods" :key="method.id" class="hover:bg-gray-50">
              <td class="font-semibold text-gray-900">
                {{ method.methodName }}
              </td>
              <td class="text-gray-600">
                {{ method.provider }}
              </td>
              <td>
                <span
                  :class="method.status === 'Active' ? 'badge-active' : 'badge-inactive'"
                  class="badge"
                >
                  {{ method.status }}
                </span>
              </td>
              <td class="text-gray-600">
                {{ formatDate(method.createdAt) }}
              </td>
              <td>
                <div class="action-buttons">
                  <button
                    @click="showToggleModal(method)"
                    :class="method.status === 'Active' ? 'btn-toggle-inactive' : 'btn-toggle-active'"
                    class="btn-action"
                    :title="method.status === 'Active' ? 'Deactivate' : 'Activate'"
                  >
                    <svg
                      v-if="method.status === 'Active'"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>

                  <button
                    @click="showDeleteModal(method)"
                    class="btn-action btn-delete"
                    title="Delete Method"
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

        <div v-if="totalPages > 1" class="pagination-footer">
          <div class="flex items-center justify-between w-full">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="pagination-btn"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              ← Previous
            </button>
            <div class="flex gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="pagination-page"
                :class="{ 'active': currentPage === page }"
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="pagination-btn"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div v-if="showModal && modalAction === 'toggle'" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="modal-icon"
                :class="selectedMethod?.status === 'Active' ? 'text-yellow-600' : 'text-green-600'"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 11V7a4 4 0 118 0v4m-5 4h2m-2 4h2M7 19h10a2 2 0 002-2v-7a2 2 0 00-2-2H7a2 2 0 00-2 2v7a2 2 0 002 2z"
                />
              </svg>
              {{ selectedMethod?.status === 'Active' ? 'Deactivate Payment Method' : 'Activate Payment Method' }}
            </h3>
            <button @click="closeModal" class="modal-close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-description">
              Are you sure you want to <strong :class="selectedMethod?.status === 'Active' ? 'text-yellow-600' : 'text-green-600'">{{ selectedMethod?.status === 'Active' ? 'deactivate' : 'activate' }}</strong> this payment method?
            </p>
            <div class="modal-info">
              <div class="info-row">
                <span class="info-label">Method Name:</span>
                <span class="info-value">{{ selectedMethod?.methodName }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Provider:</span>
                <span class="info-value">{{ selectedMethod?.provider }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Current Status:</span>
                <span class="info-value" :class="selectedMethod?.status === 'Active' ? 'text-green-600' : 'text-red-600'">
                  {{ selectedMethod?.status }}
                </span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">
              Cancel
            </button>
            <button
              @click="confirmToggle"
              :class="selectedMethod?.status === 'Active' ? 'btn-confirm-inactive' : 'btn-confirm-active'"
            >
              {{ selectedMethod?.status === 'Active' ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="showModal && modalAction === 'delete'" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="modal-icon text-red-600"
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
              Delete Payment Method
            </h3>
            <button @click="closeModal" class="modal-close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-description">
              Are you sure you want to <strong class="text-danger">permanently delete</strong> this payment method?
            </p>
            <div class="modal-warning bg-red-50 border-red-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="warning-icon text-red-500"
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
              <div>
                <p class="warning-text text-red-800">
                  ⚠️ This action **cannot be undone**.
                </p>
                <p class="warning-note text-red-700">
                  All transactions using this method will still be preserved.
                </p>
              </div>
            </div>
            <div class="modal-info mt-4">
              <div class="info-row">
                <span class="info-label">Method Name:</span>
                <span class="info-value">{{ selectedMethod?.methodName }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Provider:</span>
                <span class="info-value">{{ selectedMethod?.provider }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="btn-confirm-delete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useTopUpStore } from '@/stores/topup'
import { toast } from 'vue-sonner'
import type { PaymentMethod } from '@/interfaces/topup.interface'

// Pastikan Anda telah mendefinisikan/menginstal store dan interface ini:
// import { useTopUpStore } from '@/stores/topup'
// import { toast } from 'vue-sonner'
// import type { PaymentMethod } from '@/interfaces/topup.interface'

const topupStore = useTopUpStore()

const paymentMethods = computed(() => topupStore.getAllPaymentMethods)
const isLoading = computed(() => topupStore.isLoading)
const error = computed(() => topupStore.error)

// Filter and pagination state
const statusFilter = ref('')
const sortBy = ref<'methodName' | 'provider' | 'createdAt'>('methodName')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal state
const showModal = ref(false)
const modalAction = ref<'toggle' | 'delete'>('toggle')
const selectedMethod = ref<PaymentMethod | null>(null)

onMounted(async () => {
  await topupStore.fetchPaymentMethods()
})

// Computed: filtered payment methods
const filteredMethods = computed(() => {
  let filtered = paymentMethods.value

  // Filter by status
  if (statusFilter.value) {
    filtered = filtered.filter(m => m.status === statusFilter.value)
  }

  // Sort
  filtered = [...filtered].sort((a, b) => {
    let aVal: string | number
    let bVal: string | number

    if (sortBy.value === 'createdAt') {
      aVal = new Date(a.createdAt).getTime()
      bVal = new Date(b.createdAt).getTime()
    } else {
      aVal = a[sortBy.value].toLowerCase()
      bVal = b[sortBy.value].toLowerCase()
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

// Computed: pagination
const totalPages = computed(() => Math.ceil(filteredMethods.value.length / itemsPerPage.value))

const paginatedMethods = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMethods.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Toggle sort
const toggleSort = (field: 'methodName' | 'provider' | 'createdAt') => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortOrder.value = 'asc'
  }
}

// Reset to first page when filter changes
watch([statusFilter, itemsPerPage], () => {
  currentPage.value = 1
})

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Modal handlers
const showToggleModal = (method: PaymentMethod) => {
  selectedMethod.value = method
  modalAction.value = 'toggle'
  showModal.value = true
}

const showDeleteModal = (method: PaymentMethod) => {
  selectedMethod.value = method
  modalAction.value = 'delete'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedMethod.value = null
}

const confirmToggle = async () => {
  if (!selectedMethod.value) return

  const newStatus = selectedMethod.value.status === 'Active' ? 'Inactive' : 'Active'

  try {
    await topupStore.updatePaymentMethodStatus(selectedMethod.value.id, newStatus)
    toast.success(
      newStatus === 'Active'
        ? '✅ Payment method activated successfully!'
        : '✅ Payment method deactivated successfully!'
    )
    closeModal()
  } catch {
    toast.error('❌ Failed to update payment method status')
  }
}

const confirmDelete = async () => {
  if (!selectedMethod.value) return

  try {
    await topupStore.deletePaymentMethod(selectedMethod.value.id)
    toast.success('✅ Payment method deleted successfully!')
    closeModal()
  } catch {
    toast.error('❌ Failed to delete payment method')
  }
}
</script>

<style scoped>
/* ==================================== */
/* INHERITED STYLES from Activity Management */
/* ==================================== */

/* Container and Wrapper */
.activity-container {
  min-height: 100vh;
  background-color: #f7fafc; /* bg-gray-50 */
  padding: 2rem 1rem; /* py-8 px-4 */
}

.activity-wrapper {
  max-width: 1280px; /* max-w-6xl */
  margin-left: auto;
  margin-right: auto;
}

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
  /* Matching Gradient: #667eea (Indigo-400) to #764ba2 (Purple-600 custom) */
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
  /* Matching Gradient */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
  /* Custom for link style */
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.stats-badge.link-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);
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
.filters-header.border-b-0 {
    border-bottom: none;
}
.filters-header.pb-0 {
    padding-bottom: 0;
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

.filters-grid {
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

/* Action Bar / Create Button */
.btn-create {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  /* Matching Gradient */
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

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
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
  /* Matching Gradient */
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

.activity-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #2d3748;
}

/* Badges (reusing status badge styles from Activity) */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-active {
  background: #d1fae5; /* Light green */
  color: #065f46; /* Dark green */
}

.badge-inactive {
  background: #fef3c7; /* Light amber/yellow */
  color: #92400e; /* Dark amber/yellow */
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

.btn-toggle-active {
  background: #d1fae5; /* Light green */
  color: #065f46;
}

.btn-toggle-active:hover {
  background: #a7f3d0;
  transform: scale(1.1);
}

.btn-toggle-inactive {
  background: #fef3c7; /* Light amber/yellow */
  color: #92400e;
}

.btn-toggle-inactive:hover {
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

/* Pagination */
.pagination-footer {
  background-color: #f7fafc; /* bg-gray-50 */
  padding: 1rem 1.5rem; /* px-6 py-4 */
  border-top: 1px solid #e2e8f0; /* border-t border-gray-200 */
  display: flex;
  justify-content: center;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #667eea; /* Theme Color */
}

.pagination-page {
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 2.5rem;
  text-align: center;
}

.pagination-page:hover {
  background-color: #f3f4f6;
  border-color: #667eea;
}

.pagination-page.active {
  background-color: #667eea; /* Theme Color */
  color: white;
  border-color: #667eea;
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

.modal-warning.bg-red-50 {
    background-color: #fef2f2; /* bg-red-50 */
    border-color: #fca5a5; /* border-red-200 */
    border-left: 4px solid #ef4444; /* border-red-500 */
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #d97706;
  flex-shrink: 0;
}

.warning-icon.text-red-500 {
    color: #ef4444;
}

.warning-text {
  font-size: 0.875rem;
  color: #92400e;
  margin: 0 0 0.25rem 0;
}

.warning-text.text-red-800 {
    color: #991b1b;
}

.warning-note {
  font-size: 0.8125rem;
  color: #92400e;
  opacity: 0.8;
  margin: 0;
}

.warning-note.text-red-700 {
    color: #b91c1c;
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

/* Toggle Confirm Buttons */
.btn-confirm-active {
  padding: 0.625rem 1.25rem;
  background: #10b981; /* bg-green-500 */
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-active:hover {
  background: #059669; /* bg-green-600 */
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

.btn-confirm-inactive {
  padding: 0.625rem 1.25rem;
  background: #f59e0b; /* bg-amber-500 */
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-inactive:hover {
  background: #d97706; /* bg-amber-600 */
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.3);
}

/* Delete Confirm Button */
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

  .filters-grid {
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
    min-width: 800px; /* Adjust min width for better mobile table view */
  }

  .modal-content {
    margin: 1rem;
  }
}
</style>

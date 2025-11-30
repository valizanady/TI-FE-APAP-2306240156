<template>
  <div class="activity-container">
    <div class="activity-wrapper">
      <div class="activity-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="activity-title">Transaction List</h1>
            <p class="activity-subtitle">View all your top-up transactions</p>
          </div>
          <router-link v-if="userRole === 'Customer'" to="/topup/create" class="btn-create">
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
                d="M12 9v3m0 3h.01M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Create Top-Up
          </router-link>
        </div>
      </div>

      <div v-if="isLoading" class="state-card">
        <div class="spinner"></div>
        <p class="state-text">Loading transactions...</p>
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
        <h3 class="error-title">Error Loading Transactions</h3>
        <p class="error-message">❌ {{ error }}</p>
      </div>

      <div v-else-if="transactions.length === 0" class="state-card">
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
              d="M3 10h18M7 15h1m4 0h1m-9 5h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 class="state-title">No Transactions Yet</h3>
        <p class="state-description">You haven't made any top-up transactions.</p>
        <router-link v-if="userRole === 'Customer'" to="/topup/create" class="btn-create btn-large inline-block">
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
          Create Your First Top-Up
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
          <span class="text-sm text-gray-600">
            Showing <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> -
            <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }}</span> of
            <span class="font-semibold">{{ filteredTransactions.length }}</span> transactions
          </span>
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
              <option value="Pending">⏳ Pending</option>
              <option value="Success">✅ Success</option>
              <option value="Failed">❌ Failed</option>
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

      <div v-if="!isLoading && !error && transactions.length > 0" class="table-card">
        <table class="activity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th
                class="sortable-header"
                @click="toggleSort"
                title="Click to toggle sort order"
              >
                <div class="sort-header">
                  Date
                  <span class="sort-indicator">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th v-if="userRole === 'Superadmin'">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
              <td>
                <div class="cell-activity">
                  <div class="activity-name font-mono text-indigo-800">
                    #{{ transaction.id }}
                  </div>
                  <div class="activity-item text-xs">
                    for Customer ID: {{ transaction.customerId || 'N/A' }}
                  </div>
                </div>
              </td>
              <td>
                <div class="cell-price text-lg text-green-700">
                  Rp {{ formatAmount(transaction.amount) }}
                </div>
              </td>
              <td>
                <div class="cell-activity">
                  <div class="activity-name text-gray-700">
                    {{ transaction.paymentMethod.methodName }}
                  </div>
                  <div class="activity-item text-xs">
                    ({{ transaction.paymentMethod.provider }})
                  </div>
                </div>
              </td>
              <td>
                <span :class="getStatusClass(transaction.status)" class="badge">
                  <span v-if="transaction.status === 'Pending'">⏳ </span>
                  <span v-else-if="transaction.status === 'Success'">✅ </span>
                  <span v-else-if="transaction.status === 'Failed'">❌ </span>
                  {{ transaction.status }}
                </span>
              </td>
              <td>
                <div class="cell-dates">
                  <div class="date-start text-gray-700">{{ formatDate(transaction.createdAt) }}</div>
                </div>
              </td>
              <td v-if="userRole === 'Superadmin'">
                <div class="action-buttons">
                  <button
                    v-if="transaction.status === 'Pending'"
                    @click="showApproveModal(transaction)"
                    class="btn-action btn-toggle-active"
                    title="Approve Transaction"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                  <button
                    v-if="transaction.status === 'Pending'"
                    @click="showRejectModal(transaction)"
                    class="btn-action btn-delete"
                    title="Reject Transaction"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <button
                    @click="showDeleteModal(transaction)"
                    class="btn-action btn-secondary-delete"
                    title="Delete Transaction (Admin)"
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
            <button @click="currentPage--" :disabled="currentPage === 1" class="pagination-btn" :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
              ← Previous
            </button>
            <div class="flex gap-2">
              <button v-for="page in visiblePages" :key="page" @click="currentPage = page" class="pagination-page" :class="{ active: currentPage === page }">
                {{ page }}
              </button>
            </div>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="pagination-btn" :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
              Next →
            </button>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="modal-icon"
                :class="
                  modalAction === 'approve'
                    ? 'text-green-600'
                    : modalAction === 'reject'
                      ? 'text-red-600'
                      : 'text-gray-600'
                "
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="
                    modalAction === 'approve'
                      ? 'M5 13l4 4L19 7'
                      : modalAction === 'reject'
                        ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
                        : 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  "
                />
              </svg>
              {{
                modalAction === 'approve'
                  ? 'Approve Transaction'
                  : modalAction === 'reject'
                    ? 'Reject Transaction'
                    : 'Delete Transaction'
              }}
            </h3>
            <button @click="closeModal" class="modal-close">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <p class="modal-description">
              <span v-if="modalAction === 'delete'">
                Are you sure you want to
                <strong class="text-danger">permanently delete</strong> this transaction? This action cannot be undone.
              </span>
              <span v-else>
                Are you sure you want to <strong :class="modalAction === 'approve' ? 'text-green-600' : 'text-red-600'">{{ modalAction }}</strong> this transaction?
              </span>
            </p>
            <div class="modal-info">
              <div class="info-row">
                <span class="info-label">Transaction ID:</span>
                <span class="info-value font-mono">#{{ selectedTransaction?.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="info-label">Amount:</span>
                <span class="info-value font-semibold text-green-700"
                  >Rp {{ selectedTransaction ? formatAmount(selectedTransaction.amount) : 0 }}</span
                >
              </div>
              <div class="info-row">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">{{ selectedTransaction?.paymentMethod.methodName }}</span>
              </div>
              <div class="info-row" v-if="selectedTransaction?.customerId">
                <span class="info-label">Customer ID:</span>
                <span class="info-value">{{ selectedTransaction.customerId }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">Cancel</button>
            <button
              @click="confirmAction"
              :class="
                modalAction === 'approve'
                  ? 'btn-confirm-approve'
                  : modalAction === 'reject'
                    ? 'btn-confirm-reject'
                    : 'btn-confirm-delete'
              "
            >
              {{
                modalAction === 'approve'
                  ? 'Approve'
                  : modalAction === 'reject'
                    ? 'Reject'
                    : 'Delete'
              }}
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
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import type { TopUpTransaction } from '@/interfaces/topup.interface'
import type { ComputedRef } from 'vue';

const topupStore = useTopUpStore()
const authStore = useAuthStore()

// FIX: Menggunakan casting `as ComputedRef<TopUpTransaction[]>` untuk memastikan TypeScript
// mengenali properti seperti `.status` pada setiap item transaksi,
// sambil tetap menggunakan TopUpTransaction dari interface Anda.
const transactions = computed(() => topupStore.getTransactions) as ComputedRef<TopUpTransaction[]>;

const isLoading = computed(() => topupStore.isLoading)
const error = computed(() => topupStore.error)
const userRole = computed(() => authStore.getUserRole)

// Filter and pagination state
const statusFilter = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Modal state
const showModal = ref(false)
const modalAction = ref<'approve' | 'reject' | 'delete'>('approve')

// Menggunakan TopUpTransaction dari import asli
const selectedTransaction = ref<TopUpTransaction | null>(null)

onMounted(async () => {
  await topupStore.fetchTransactions()
})

// Computed: filtered transactions
const filteredTransactions = computed(() => {
  let filtered = transactions.value

  // Filter by status - FIX: t.status sekarang dikenali karena transactions sudah di-cast
  if (statusFilter.value) {
    filtered = filtered.filter((t) => t.status === statusFilter.value)
  }

  // Sort by date
  filtered = [...filtered].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
  })

  return filtered
})

// Computed: pagination
const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage.value))

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTransactions.value.slice(start, end)
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

// Toggle sort order
const toggleSort = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Watch status filter to reset pagination
watch([statusFilter, itemsPerPage], () => {
  currentPage.value = 1
})

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'Pending':
      return 'badge-pending' // Yellow/Amber
    case 'Success':
      return 'badge-active' // Green
    case 'Failed':
      return 'badge-inactive' // Red
    default:
      return 'badge-default' // Gray
  }
}

// Modal handlers
const showApproveModal = (transaction: TopUpTransaction) => {
  selectedTransaction.value = transaction
  modalAction.value = 'approve'
  showModal.value = true
}

const showRejectModal = (transaction: TopUpTransaction) => {
  selectedTransaction.value = transaction
  modalAction.value = 'reject'
  showModal.value = true
}

const showDeleteModal = (transaction: TopUpTransaction) => {
  selectedTransaction.value = transaction
  modalAction.value = 'delete'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTransaction.value = null
}

const confirmAction = async () => {
  if (!selectedTransaction.value) return

  const transactionId = selectedTransaction.value.id

  try {
    if (modalAction.value === 'delete') {
      await topupStore.deleteTransaction(transactionId)
      toast.success('✅ Transaction deleted successfully!')
    } else {
      const status = modalAction.value === 'approve' ? 'Success' : 'Failed'
      await topupStore.updateTransactionStatus(transactionId, status)
      toast.success(
        modalAction.value === 'approve'
          ? '✅ Transaction approved successfully!'
          : '✅ Transaction rejected successfully!',
      )
    }
    closeModal()
  } catch {
    toast.error(
      modalAction.value === 'delete'
        ? '❌ Failed to delete transaction'
        : '❌ Failed to update transaction status',
    )
  }
}
</script>

<style scoped>
/* ==================================== */
/* INHERITED STYLES from Activity Management (Adjusted/Combined) */
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

/* Header with Card Style (Replaces topup-header) */
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

/* Create Button (Replaces btn-primary) */
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

/* State Cards (Replaces loading-state, error-card, empty-card) */
.state-card {
  background: white;
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.error-card {
  /* Reusing error-card structure but adjusting colors for Activity theme */
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

/* Filter Card (Replaces filter-card) */
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
/* Ensure the filter info column takes up one slot if needed */
.filter-group.filter-info {
    grid-column: span 1;
    align-self: flex-end;
    text-align: right;
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

.filter-select {
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #2d3748;
  transition: all 0.2s;
  background: white;
  width: 100%; /* Important for grid layout */
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-select:hover {
  border-color: #cbd5e0;
}

/* Table Card (Replaces topup-table-card) */
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

/* Badges (Replaces utility status classes) */
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
  background: #d1fae5; /* Success: Light green */
  color: #065f46; /* Dark green */
}

.badge-inactive {
  background: #fee2e2; /* Failed: Light red */
  color: #991b1b; /* Dark red */
}

.badge-pending {
  background: #fef3c7; /* Pending: Light yellow/amber */
  color: #92400e; /* Dark amber/yellow */
}
.badge-default {
    background: #e2e8f0;
    color: #4a5568;
}

/* Action Buttons (Replaces btn-approve, btn-reject, btn-delete) */
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

/* Approve/Activate Button Style (Green) */
.btn-toggle-active {
  background: #d1fae5;
  color: #065f46;
}

.btn-toggle-active:hover {
  background: #a7f3d0;
  transform: scale(1.1);
}

/* Reject/Delete (Red Style) */
.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-delete:hover {
  background: #fecaca;
  transform: scale(1.1);
}

/* Admin Delete Button (Secondary delete action, using gray theme) */
.btn-secondary-delete {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-secondary-delete:hover {
  background: #cbd5e0;
  transform: scale(1.1);
}

/* Pagination (Replaces gradient footer) */
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

/* Modal Styles */
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

/* Modal Action Buttons (Using consistent names) */
.btn-confirm-approve {
  padding: 0.625rem 1.25rem;
  background: #10b981; /* Green */
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-approve:hover {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
}

.btn-confirm-reject {
  padding: 0.625rem 1.25rem;
  background: #ef4444; /* Red */
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm-reject:hover {
  background: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
}

.btn-confirm-delete {
  padding: 0.625rem 1.25rem;
  background: #4a5568; /* Dark Gray */
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm-delete:hover {
  background: #2d3748;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(74, 85, 104, 0.3);
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

  .filters-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-create {
      width: 100%;
      justify-content: center;
  }

  .table-card {
    overflow-x: auto;
  }

  .activity-table {
    min-width: 800px;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style>

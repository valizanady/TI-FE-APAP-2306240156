<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">💳 Transaction List</h1>
          <p class="text-gray-600 mt-1">View all your top-up transactions</p>
        </div>

        <!-- Create Button (Customer only) -->
        <router-link v-if="userRole === 'Customer'" to="/topup/create" class="btn-primary">
          ➕ Create Top-Up
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading transactions...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        ❌ {{ error }}
      </div>

      <!-- Empty State -->
      <div
        v-else-if="transactions.length === 0"
        class="bg-white rounded-lg shadow p-12 text-center"
      >
        <div class="text-6xl mb-4">💳</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
        <p class="text-gray-600 mb-6">You haven't made any top-up transactions.</p>
        <router-link
          v-if="userRole === 'Customer'"
          to="/topup/create"
          class="btn-primary inline-block"
        >
          Create Your First Top-Up
        </router-link>
      </div>

      <!-- Filter & Controls -->
      <div v-else class="bg-white rounded-t-lg shadow-sm p-4 border-b border-gray-200">
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select v-model="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Results per page</label>
            <select v-model.number="itemsPerPage" class="filter-select">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </div>
          <div class="flex-1 text-right pt-7">
            <span class="text-sm text-gray-600">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} -
              {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} of
              {{ filteredTransactions.length }} transactions
            </span>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div
        v-if="!isLoading && !error && transactions.length > 0"
        class="bg-white rounded-b-lg shadow overflow-hidden"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Method
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                @click="toggleSort"
              >
                <div class="flex items-center gap-2">
                  Date
                  <span class="text-sm">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
                </div>
              </th>
              <th
                v-if="userRole === 'Superadmin'"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                {{ transaction.id.substring(0, 8) }}...
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                Rp {{ formatAmount(transaction.amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ transaction.paymentMethod.methodName }}
                <span class="text-xs text-gray-400"
                  >({{ transaction.paymentMethod.provider }})</span
                >
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getStatusClass(transaction.status)"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(transaction.createdAt) }}
              </td>
              <td v-if="userRole === 'Superadmin'" class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex gap-2">
                  <button
                    v-if="transaction.status === 'Pending'"
                    @click="showApproveModal(transaction)"
                    class="btn-approve"
                  >
                    ✅ Approve
                  </button>
                  <button
                    v-if="transaction.status === 'Pending'"
                    @click="showRejectModal(transaction)"
                    class="btn-reject"
                  >
                    ❌ Reject
                  </button>
                  <button
                    @click="showDeleteModal(transaction)"
                    class="btn-delete"
                    title="Delete transaction"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
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
                :class="{ active: currentPage === page }"
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

      <!-- Confirmation Modal -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="text-lg font-semibold text-gray-900">
              {{
                modalAction === 'approve'
                  ? '✅ Approve Transaction'
                  : modalAction === 'reject'
                    ? '❌ Reject Transaction'
                    : '🗑️ Delete Transaction'
              }}
            </h3>
            <button @click="closeModal" class="modal-close">✕</button>
          </div>
          <div class="modal-body">
            <p class="text-gray-700 mb-4">
              <span v-if="modalAction === 'delete'">
                Are you sure you want to
                <strong class="text-red-600">permanently delete</strong> this transaction? This
                action cannot be undone.
              </span>
              <span v-else>
                Are you sure you want to <strong>{{ modalAction }}</strong> this transaction?
              </span>
            </p>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Transaction ID:</span>
                <span class="font-mono">{{ selectedTransaction?.id.substring(0, 12) }}...</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Amount:</span>
                <span class="font-semibold"
                  >Rp {{ selectedTransaction ? formatAmount(selectedTransaction.amount) : 0 }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Payment Method:</span>
                <span>{{ selectedTransaction?.paymentMethod.methodName }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">Cancel</button>
            <button
              @click="confirmAction"
              :class="
                modalAction === 'approve'
                  ? 'btn-approve'
                  : modalAction === 'reject'
                    ? 'btn-reject'
                    : 'btn-delete-modal'
              "
              class="px-4 py-2"
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
import { onMounted, computed, ref } from 'vue'
import { useTopUpStore } from '@/stores/topup'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'
import type { TopUpTransaction } from '@/interfaces/topup.interface'

const topupStore = useTopUpStore()
const authStore = useAuthStore()

const transactions = computed(() => topupStore.getTransactions)
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
const selectedTransaction = ref<TopUpTransaction | null>(null)

onMounted(async () => {
  await topupStore.fetchTransactions()
})

// Computed: filtered transactions
const filteredTransactions = computed(() => {
  let filtered = transactions.value

  // Filter by status
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

// Reset to first page when filter changes
const resetPagination = () => {
  currentPage.value = 1
}

// Watch status filter to reset pagination
import { watch } from 'vue'
watch([statusFilter, itemsPerPage], () => {
  resetPagination()
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
      return 'bg-yellow-100 text-yellow-800'
    case 'Success':
      return 'bg-green-100 text-green-800'
    case 'Failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
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
      // Handle delete action
      await topupStore.deleteTransaction(transactionId)
      toast.success('✅ Transaction deleted successfully!')
    } else {
      // Handle approve/reject action
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
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.4);
}

.filter-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #6d28d9;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.2);
}

.btn-approve {
  padding: 0.375rem 0.75rem;
  background-color: #10b981;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-approve:hover {
  background-color: #059669;
}

.btn-reject {
  padding: 0.375rem 0.75rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reject:hover {
  background-color: #dc2626;
}

.btn-delete {
  padding: 0.375rem 0.75rem;
  background-color: #9ca3af;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete:hover {
  background-color: #6b7280;
}

.btn-delete-modal {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-modal:hover {
  background-color: #dc2626;
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
  border-color: #6d28d9;
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
  border-color: #6d28d9;
}

.pagination-page.active {
  background-color: #6d28d9;
  color: white;
  border-color: #6d28d9;
}

/* Modal Styles */
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
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 500px;
  width: 90%;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  padding: 0.5rem 1rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}
</style>

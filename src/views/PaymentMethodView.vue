<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">💰 Payment Methods</h1>
          <p class="text-gray-600 mt-1">Manage payment methods for top-up transactions</p>
        </div>

        <!-- Create Button -->
        <router-link to="/payment-methods/create" class="btn-primary">
          ➕ Add Payment Method
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
        <p class="text-gray-600 mt-4">Loading payment methods...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        ❌ {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="paymentMethods.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
        <div class="text-6xl mb-4">💰</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Payment Methods Yet</h3>
        <p class="text-gray-600 mb-6">Add your first payment method to enable top-up transactions.</p>
        <router-link to="/payment-methods/create" class="btn-primary inline-block">
          Add Payment Method
        </router-link>
      </div>

      <!-- Filter & Controls -->
      <div v-else class="bg-white rounded-t-lg shadow-sm p-4 border-b border-gray-200">
        <div class="flex gap-4 items-center">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select v-model="statusFilter" class="filter-select">
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select v-model="sortBy" class="filter-select">
              <option value="methodName">Method Name</option>
              <option value="provider">Provider</option>
              <option value="createdAt">Created Date</option>
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
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredMethods.length) }}
              of {{ filteredMethods.length }} methods
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Methods Table -->
      <div v-if="!isLoading && !error && paymentMethods.length > 0" class="bg-white rounded-b-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                @click="toggleSort('methodName')"
              >
                <div class="flex items-center gap-2">
                  Method Name
                  <span v-if="sortBy === 'methodName'" class="text-sm">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                @click="toggleSort('provider')"
              >
                <div class="flex items-center gap-2">
                  Provider
                  <span v-if="sortBy === 'provider'" class="text-sm">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                @click="toggleSort('createdAt')"
              >
                <div class="flex items-center gap-2">
                  Created At
                  <span v-if="sortBy === 'createdAt'" class="text-sm">
                    {{ sortOrder === 'asc' ? '↑' : '↓' }}
                  </span>
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="method in paginatedMethods" :key="method.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {{ method.methodName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ method.provider }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="method.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                  class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                >
                  {{ method.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(method.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex gap-2">
                  <button
                    @click="showToggleModal(method)"
                    :class="method.status === 'Active' ? 'btn-inactive' : 'btn-active'"
                  >
                    {{ method.status === 'Active' ? '⏸️ Deactivate' : '▶️ Activate' }}
                  </button>
                  <button
                    @click="showDeleteModal(method)"
                    class="btn-delete"
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

      <!-- Toggle Status Modal -->
      <div v-if="showModal && modalAction === 'toggle'" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedMethod?.status === 'Active' ? '⏸️ Deactivate Payment Method' : '▶️ Activate Payment Method' }}
            </h3>
            <button @click="closeModal" class="modal-close">✕</button>
          </div>
          <div class="modal-body">
            <p class="text-gray-700 mb-4">
              Are you sure you want to <strong>{{ selectedMethod?.status === 'Active' ? 'deactivate' : 'activate' }}</strong> this payment method?
            </p>
            <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Method Name:</span>
                <span class="font-semibold">{{ selectedMethod?.methodName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Provider:</span>
                <span>{{ selectedMethod?.provider }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Current Status:</span>
                <span :class="selectedMethod?.status === 'Active' ? 'text-green-600' : 'text-gray-600'">
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
              :class="selectedMethod?.status === 'Active' ? 'btn-inactive' : 'btn-active'"
              class="px-4 py-2"
            >
              {{ selectedMethod?.status === 'Active' ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showModal && modalAction === 'delete'" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="text-lg font-semibold text-gray-900">
              🗑️ Delete Payment Method
            </h3>
            <button @click="closeModal" class="modal-close">✕</button>
          </div>
          <div class="modal-body">
            <p class="text-gray-700 mb-2">
              Are you sure you want to <strong class="text-red-600">permanently delete</strong> this payment method?
            </p>
            <p class="text-sm text-gray-600 mb-4">
              ⚠️ This action cannot be undone. All transactions using this method will still be preserved.
            </p>
            <div class="bg-red-50 rounded-lg p-4 space-y-2 text-sm border border-red-200">
              <div class="flex justify-between">
                <span class="text-gray-600">Method Name:</span>
                <span class="font-semibold">{{ selectedMethod?.methodName }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Provider:</span>
                <span>{{ selectedMethod?.provider }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeModal" class="btn-cancel">
              Cancel
            </button>
            <button
              @click="confirmDelete"
              class="btn-delete px-4 py-2"
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
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
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

.btn-active {
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

.btn-active:hover {
  background-color: #059669;
}

.btn-inactive {
  padding: 0.375rem 0.75rem;
  background-color: #f59e0b;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-inactive:hover {
  background-color: #d97706;
}

.btn-delete {
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

.btn-delete:hover {
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
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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

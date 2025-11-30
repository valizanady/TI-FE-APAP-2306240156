<template>
  <div class="packages-container">
    <div class="packages-wrapper">
      <!-- Header with gradient -->
      <div class="packages-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="packages-title">Tour Packages</h1>
            <p class="packages-subtitle">Manage and explore your tour packages</p>
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <div>
              <div class="stats-number">{{ filteredPackages.length }}</div>
              <div class="stats-label">Total Packages</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search & Actions with better spacing -->
      <div class="packages-toolbar">
        <div class="toolbar-content">
          <!-- Enhanced Search -->
          <div class="search-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="search-icon"
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
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by package name..."
              class="search-input"
            />
            <span v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="toolbar-actions">
            <button class="btn btn-primary" @click="router.push('/package/create')">
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
              Add Package
            </button>
          </div>
        </div>
      </div>

      <!-- Loading with animation -->
      <div v-if="store.isLoading" class="state-card">
        <div class="spinner"></div>
        <p class="state-text">Loading packages...</p>
      </div>

      <!-- Enhanced Empty State -->
      <div v-else-if="filteredPackages.length === 0" class="state-card">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 class="state-title">No packages found</h3>
        <p class="state-description">
          {{
            searchQuery
              ? 'Try different search terms or clear your search'
              : 'Create your first tour package to get started'
          }}
        </p>
        <button v-if="!searchQuery" class="btn btn-primary btn-large">
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
          Create Your First Package
        </button>
        <button v-else class="btn btn-secondary btn-large" @click="searchQuery = ''">
          Clear Search
        </button>
      </div>

      <!-- Enhanced Table -->
      <div v-else class="table-card">
        <VDataTable
          :data="filteredPackages"
          :columns="columns"
          :page-size="8"
          :page-size-options="[5, 10, 20, 50]"
          :show-pagination="true"
          :show-entries-per-page="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { usePackageStore } from '@/stores/package'
import { useAuthStore } from '@/stores/auth'
import VDataTable from '@/components/common/VDataTable.vue'
import VButton from '@/components/common/VButton.vue'
import VDeleteButton from '@/components/package/VDeleteButton.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Package } from '@/interfaces/package.interface'

const store = usePackageStore()
const authStore = useAuthStore()
const router = useRouter()
const searchQuery = ref('')

const userRole = computed(() => authStore.getUserRole)
const userId = computed(() => authStore.getUserId)

// RBAC: Check if user can edit/delete/process packages
const canManagePackages = computed(() => {
  return ['Superadmin', 'TourPackageVendor'].includes(userRole.value || '')
})

const canEdit = (pkg: Package) => {
  // Customer hanya bisa edit package sendiri
  if (userRole.value === 'Customer') {
    return String(pkg.userId) === String(userId.value)
  }
  // Vendor/Admin bisa edit semua
  return canManagePackages.value
}

const canDelete = (pkg: Package) => {
  // Customer hanya bisa delete package sendiri dengan status Pending
  if (userRole.value === 'Customer') {
    return String(pkg.userId) === String(userId.value) && pkg.status === 'Pending'
  }
  // Vendor/Admin bisa delete semua yang Pending
  return canManagePackages.value && pkg.status === 'Pending'
}

onMounted(async () => {
  await store.fetchAll()
  console.log('🔥 Packages fetched:', store.items)
})

const filteredPackages = computed(() => {
  // ✅ Backend sudah melakukan role-based filtering berdasarkan creatorRole
  // Customer: Melihat package sendiri + package dari Admin/Vendor
  // Admin/Vendor: Melihat semua package

  // Frontend hanya perlu filter berdasarkan search query
  return store.items.filter((p) =>
    p.packageName.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

const columns: ColumnDef<Package>[] = [
  {
    accessorKey: 'packageName',
    header: 'Package Name',
    cell: ({ row }) => h('div', { class: 'cell-package-name' }, row.original.packageName),
  },
  {
    header: 'Period',
    cell: ({ row }) => {
      const start = new Date(row.original.startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      const end = new Date(row.original.endDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      return h('div', { class: 'cell-period' }, `${start} - ${end}`)
    },
  },
  {
    accessorKey: 'quota',
    header: 'Quota',
    cell: ({ row }) => h('span', { class: 'badge badge-blue' }, `${row.original.quota} pax`),
  },
  {
    header: 'Price',
    cell: ({ row }) =>
      h('div', { class: 'cell-price' }, `Rp ${row.original.price.toLocaleString('id-ID')}`),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      let badgeClass = 'badge badge-yellow' // default

      // Status badge colors based on payment flow:
      // Pending → Yellow (awaiting plans to be fulfilled)
      // Processed → Blue (plans fulfilled, bill being created)
      // Waiting for Payment → Orange (bill created, awaiting payment)
      // Payment Confirmed → Green (payment completed)

      if (status === 'Payment Confirmed') {
        badgeClass = 'badge badge-green'
      } else if (status === 'Waiting for Payment') {
        badgeClass = 'badge badge-orange'
      } else if (status === 'Processed') {
        badgeClass = 'badge badge-blue'
      } else if (status === 'Pending') {
        badgeClass = 'badge badge-yellow'
      }

      return h('span', { class: badgeClass }, status)
    },
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) => h('span', { class: 'cell-user-id' }, row.original.userId),
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const pkg = row.original
      const actions = [
        // Details button - always visible
        h(
          VButton,
          {
            variant: 'primary',
            size: 'sm',
            onClick: () => router.push(`/package/${pkg.id}`),
          },
          () => 'Details',
        ),
      ]

      // Edit button - only if user has permission
      if (canEdit(pkg)) {
        actions.push(
          h(
            VButton,
            {
              variant: 'success',
              size: 'sm',
              onClick: () => router.push(`/package/${pkg.id}/edit`),
            },
            () => 'Edit',
          ),
        )
      }

      // Delete button - only if status is Pending and user has permission
      if (canDelete(pkg)) {
        actions.push(
          h(VDeleteButton, {
            packageId: pkg.id,
            redirectTo: '/package',
          }),
        )
      }

      return h('div', { class: 'action-buttons' }, actions)
    },
  },
]
</script>

<style scoped>
/* Container & Layout */
.packages-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.packages-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header with Card Style */
.packages-header {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.header-text {
  flex: 1;
}

.packages-title {
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.packages-subtitle {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 400;
}

/* Stats Badge */
.stats-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.25rem 1.75rem;
  border-radius: 1rem;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.3);
}

.stats-icon {
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.9;
}

.stats-number {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.stats-label {
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Toolbar */
.packages-toolbar {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.toolbar-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* Enhanced Search */
.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-clear {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
}

.search-clear:hover {
  color: #ef4444;
}

.search-clear svg {
  width: 100%;
  height: 100%;
}

/* Toolbar Actions */
.toolbar-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

/* Enhanced Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: fit-content;
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #4b5563;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #667eea;
  color: #667eea;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* State Cards */
.state-card {
  background: white;
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.empty-icon-wrapper {
  width: 5rem;
  height: 5rem;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.state-icon {
  width: 3rem;
  height: 3rem;
  color: white;
}

.state-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.state-description {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.state-text {
  color: #6b7280;
  font-size: 1rem;
  margin-top: 1rem;
}

/* Loading Spinner */
.spinner {
  width: 3rem;
  height: 3rem;
  margin: 0 auto;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
}

/* Table styling improvements */
.table-card :deep(table) {
  border-collapse: separate;
  border-spacing: 0;
}

.table-card :deep(thead) {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.table-card :deep(thead th) {
  padding: 1rem;
  font-weight: 700;
  font-size: 0.875rem;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #d1d5db;
}

.table-card :deep(tbody tr) {
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.table-card :deep(tbody tr:hover) {
  background-color: #f9fafb;
}

.table-card :deep(tbody td) {
  padding: 1rem;
  vertical-align: middle;
}

.table-card :deep(.pagination-container) {
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

/* Table Cells */
.cell-package-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 0.95rem;
}

.cell-period {
  color: #6b7280;
  font-size: 0.875rem;
}

.cell-price {
  font-weight: 700;
  color: #059669;
  font-size: 0.95rem;
}

.cell-user-id {
  font-family: 'Courier New', monospace;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
}

/* Enhanced Badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.badge-green {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
}

.badge-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.badge-orange {
  background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
  color: #9a3412;
}

.badge-yellow {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.table-card :deep(td:last-child) {
  text-align: center;
  padding: 1rem;
}

/* Fix for entries per page text */
.table-card :deep(.entries-info),
.table-card :deep(.pagination-info) {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .packages-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .packages-title {
    font-size: 1.75rem;
  }

  .toolbar-content {
    flex-direction: column;
  }

  .search-wrapper {
    max-width: 100%;
  }

  .toolbar-actions {
    width: 100%;
    flex-direction: column;
  }

  .toolbar-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .stats-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>

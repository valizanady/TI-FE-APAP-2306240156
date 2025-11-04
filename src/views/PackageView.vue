<template>
  <div class="packages-container">
    <div class="packages-wrapper">
      <!-- Header -->
      <div class="packages-header">
        <div>
          <h1 class="packages-title">Tour Packages</h1>
          <p class="packages-subtitle">
            Manage and explore tour packages •
            <span class="packages-count">{{ filteredPackages.length }}</span> total
          </p>
        </div>
      </div>

      <!-- Search & Actions -->
      <div class="packages-toolbar">
        <div class="toolbar-content">
          <!-- Search -->
          <div class="search-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="search-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search package name..."
              class="search-input"
            />
          </div>

          <!-- Buttons -->
          <div class="toolbar-actions">
            <button class="btn btn-secondary">
              Filter
            </button>
            <button class="btn btn-primary">
              + Add Package
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.isLoading" class="state-card">
        <div class="spinner"></div>
        <p class="state-text">Loading packages...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredPackages.length === 0" class="state-card">
        <svg xmlns="http://www.w3.org/2000/svg" class="state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="state-title">No packages found</h3>
        <p class="state-description">
          {{ searchQuery ? 'Try different search terms' : 'Create your first tour package to get started' }}
        </p>
        <button v-if="!searchQuery" class="btn btn-primary">
          Create Package
        </button>
      </div>

      <!-- Table -->
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
import { usePackageStore } from '@/stores/package'
import VDataTable from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/components/common/VDataTable.vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Package } from '@/interfaces/package.interface'

const store = usePackageStore()
const searchQuery = ref('')

onMounted(async () => {
  await store.fetchAll()
  console.log('🔥 Packages fetched:', store.items)
})

const filteredPackages = computed(() => {
  return store.items.filter((p) =>
    p.packageName.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const columns: ColumnDef<Package>[] = [
  {
    accessorKey: 'packageName',
    header: 'Package Name',
    cell: ({ row }) =>
      h('div', { class: 'cell-package-name' }, row.original.packageName)
  },
  {
    header: 'Period',
    cell: ({ row }) => {
      const start = new Date(row.original.startDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
      const end = new Date(row.original.endDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
      return h('div', { class: 'cell-period' }, `${start} - ${end}`)
    }
  },
  {
    accessorKey: 'quota',
    header: 'Quota',
    cell: ({ row }) =>
      h('span', { class: 'badge badge-blue' }, `${row.original.quota} pax`)
  },
  {
    header: 'Price',
    cell: ({ row }) =>
      h('div', { class: 'cell-price' }, `Rp ${row.original.price.toLocaleString('id-ID')}`)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const isProcessed = row.original.status === 'Processed'
      const badgeClass = isProcessed ? 'badge badge-green' : 'badge badge-yellow'
      return h('span', { class: badgeClass }, row.original.status)
    }
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
    cell: ({ row }) =>
      h('span', { class: 'cell-user-id' }, row.original.userId)
  }
]
</script>

<style scoped>
/* Container */
.packages-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 2rem;
}

.packages-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Header */
.packages-header {
  margin-bottom: 1.5rem;
}

.packages-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.packages-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.packages-count {
  font-weight: 600;
  color: #6b46c1;
}

/* Toolbar */
.packages-toolbar {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.toolbar-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .toolbar-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

/* Search */
.search-wrapper {
  position: relative;
  flex: 1;
  max-width: 28rem;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  height: 1.25rem;
  width: 1.25rem;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6b46c1;
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

/* Toolbar Actions */
.toolbar-actions {
  display: flex;
  gap: 0.5rem;
}

/* Buttons */
.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-primary {
  background-color: #6b46c1;
  color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  background-color: #553c9a;
}

.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

/* State Card (Loading & Empty) */
.state-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  padding: 3rem;
  text-align: center;
}

.spinner {
  display: inline-block;
  width: 3rem;
  height: 3rem;
  border: 4px solid #e9d5ff;
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

.state-icon {
  width: 4rem;
  height: 4rem;
  color: #d1d5db;
  margin: 0 auto 1rem;
}

.state-text {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

.state-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.state-description {
  color: #6b7280;
  margin: 0 0 1.5rem 0;
}

/* Table Card */
.table-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

/* Table Cell Styles */
.cell-package-name {
  font-weight: 600;
  color: #1f2937;
}

.cell-period {
  font-size: 0.875rem;
  color: #374151;
}

.cell-price {
  font-weight: 600;
  color: #1f2937;
}

.cell-user-id {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-blue {
  background-color: #eff6ff;
  color: #1e40af;
}

.badge-green {
  background-color: #f0fdf4;
  color: #15803d;
}

.badge-yellow {
  background-color: #fef3c7;
  color: #b45309;
}

/* Responsive */
@media (min-width: 768px) {
  .packages-container {
    padding: 2rem;
  }
}
</style>

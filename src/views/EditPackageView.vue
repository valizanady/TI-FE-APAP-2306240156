<template>
  <div class="p-10 bg-gray-50 min-h-screen space-y-8">
    <h1 class="text-4xl font-bold text-gray-800">Edit Package</h1>

    <!-- Loading State -->
    <div v-if="!pkg" class="bg-white shadow-md rounded-xl p-8 text-center">
      <div class="spinner"></div>
      <p class="mt-4 text-gray-600">Loading package data...</p>
    </div>

    <template v-else>
      <!-- Section: Package Info -->
      <div class="bg-white shadow-md rounded-xl border border-gray-100">
        <div
          class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-xl px-6 py-3 font-semibold"
        >
          Package Information
        </div>

        <div class="p-6 space-y-4">
          <VFormInput label="Package Name" v-model="form.packageName" required />
          <VFormInput label="User ID" :model-value="pkg.userId" disabled />
          <VFormInput label="Start Date" type="datetime-local" v-model="form.startDate" required />
          <VFormInput label="End Date" type="datetime-local" v-model="form.endDate" required />
          <VFormInput label="Quota" type="number" v-model.number="form.quota" required />

          <VButton variant="primary" @click="onUpdate">Update Package</VButton>
        </div>
      </div>

      <!-- Section: Manage Plans -->
      <div class="bg-white shadow-md rounded-xl border border-gray-100">
        <div
          class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-xl px-6 py-3 font-semibold flex justify-between"
        >
          <span>Manage Plans</span>
          <VButton
            variant="primary"
            size="sm"
            @click="router.push(`/plans/create?packageId=${pkg.id}`)"
            >Create New Plan</VButton
          >
        </div>

        <div v-if="pkg.plans && pkg.plans.length > 0">
          <VDataTable :data="pkg.plans" :columns="columns" />
        </div>
        <div v-else class="p-8 text-center text-gray-500">No plans available for this package</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePackageStore } from '@/stores/package'
import VButton from '@/components/common/VButton.vue'
import VDataTable from '@/components/common/VDataTable.vue'
import VFormInput from '@/components/common/VFormInput.vue'
import type { Package, Plan } from '@/interfaces/package.interface'
import type { ColumnDef } from '@tanstack/vue-table'
import axios from 'axios'
import type { CommonResponse } from '@/interfaces/common.response.interface'

const API = import.meta.env.VITE_API_BASE_URL
const store = usePackageStore()
const route = useRoute()
const router = useRouter()

const pkg = ref<Package | null>(null)
const form = reactive({
  packageName: '',
  startDate: '',
  endDate: '',
  quota: 0,
})

// Define columns for the plans table
const columns: ColumnDef<Plan>[] = [
  {
    accessorKey: 'planName',
    header: 'Plan Name',
    cell: ({ row }) => h('div', { class: 'font-semibold' }, row.original.planName),
  },
  {
    accessorKey: 'activityType',
    header: 'Activity Type',
    cell: ({ row }) => h('span', { class: 'badge' }, row.original.activityType),
  },
  {
    header: 'Route',
    cell: ({ row }) => h('div', {}, `${row.original.startLocation} → ${row.original.endLocation}`),
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => h('div', {}, `Rp ${row.original.price.toLocaleString('id-ID')}`),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h('span', { class: 'badge' }, row.original.status),
  },
]

onMounted(async () => {
  const id = route.params.id as string
  try {
    // Fetch package by ID
    const res = await axios.get<CommonResponse<Package>>(`${API}package/${id}`)
    pkg.value = res.data.data

    console.log('📦 Package loaded:', pkg.value)
    console.log('📊 Package status:', pkg.value.status)
    console.log('📋 Number of plans:', pkg.value.plans?.length || 0)

    // Format dates for datetime-local input
    const formatForInput = (dateStr: string) => {
      const date = new Date(dateStr)
      return date.toISOString().slice(0, 16)
    }

    Object.assign(form, {
      packageName: pkg.value.packageName,
      startDate: formatForInput(pkg.value.startDate),
      endDate: formatForInput(pkg.value.endDate),
      quota: pkg.value.quota,
    })

    // Check if package can be edited
    if (pkg.value.status !== 'Pending') {
      console.warn(
        `⚠️  Package status is "${pkg.value.status}", not "Pending". Backend might reject update.`,
      )
    }
    if (pkg.value.plans && pkg.value.plans.length > 0) {
      console.warn(`⚠️  Package has ${pkg.value.plans.length} plans. Backend might reject update.`)
    }
  } catch (error) {
    console.error('Failed to fetch package:', error)
    alert('Failed to load package data')
  }
})

async function onUpdate() {
  if (!pkg.value) return

  try {
    // Convert datetime-local format to ISO string
    const payload = {
      packageName: form.packageName,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      quota: form.quota,
    }

    console.log('📝 Updating package with data:', payload)
    const response = await axios.put(`${API}package/${pkg.value.id}/edit`, payload)
    console.log('✅ Response:', response.data)

    alert('✅ Package updated successfully!')

    // Refresh store
    await store.fetchAll()

    // Redirect back to package detail
    router.push(`/package/${pkg.value.id}`)
  } catch (error) {
    console.error('Update error:', error)
    if (axios.isAxiosError(error)) {
      console.error('Error response:', error.response?.data)
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update package'
      alert(`❌ Error: ${errorMsg}`)
    } else {
      alert('❌ Error: Failed to update package')
    }
  }
}
</script>

<style scoped>
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

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #e0e7ff;
  color: #4338ca;
}
</style>

<template>
  <div class="edit-plan-container">
    <div class="edit-plan-wrapper max-w-4xl">
      <button class="btn-back" @click="router.push('/package')">
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
        Back to Package List
      </button>

      <div class="page-header">
        <h1 class="page-title">Edit Package: {{ pkg?.packageName || 'Loading...' }}</h1>
        <p class="page-subtitle">Update package details and manage associated plans.</p>
      </div>

      <div v-if="!pkg" class="state-card">
        <div class="spinner"></div>
        <p class="state-text">Loading package data...</p>
      </div>

      <template v-else>
        <div class="form-card mb-8">
          <div class="card-header bg-theme-gradient">
            <h2 class="card-title-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="header-icon-white"
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
              Package Details
            </h2>
          </div>

          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="form-group md:col-span-2">
                <label class="form-label" for="packageName">Package Name <span class="required">*</span></label>
                <input
                  id="packageName"
                  v-model="form.packageName"
                  type="text"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">User ID</label>
                <input
                  :value="pkg.userId"
                  type="text"
                  class="form-input"
                  disabled
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="quota">Quota <span class="required">*</span></label>
                <input
                  id="quota"
                  v-model.number="form.quota"
                  type="number"
                  min="1"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="startDate">Start Date <span class="required">*</span></label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="datetime-local"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="endDate">End Date <span class="required">*</span></label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="datetime-local"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div class="flex justify-end pt-6">
              <button class="btn btn-theme-primary" @click="onUpdate">
                Update Package
              </button>
            </div>
          </div>
        </div>

        <div class="activities-card">
          <div class="card-header bg-theme-gradient flex justify-between items-center">
            <h2 class="card-title-white">Manage Plans</h2>
            <button
              class="btn btn-white btn-sm text-theme-primary-hover"
              @click="router.push(`/plans/create?packageId=${pkg.id}`)"
            >
              ➕ Create New Plan
            </button>
          </div>

          <div v-if="pkg.plans && pkg.plans.length > 0" class="card-body p-0">
            <div class="table-container">
              <table class="activities-table">
                <thead>
                  <tr>
                    <th>Plan Name</th>
                    <th>Type</th>
                    <th>Route</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="plan in pkg.plans" :key="plan.id">
                    <td>{{ plan.planName }}</td>
                    <td><span class="badge badge-default">{{ plan.activityType }}</span></td>
                    <td>{{ plan.startLocation }} → {{ plan.endLocation }}</td>
                    <td>Rp {{ plan.price.toLocaleString('id-ID') }}</td>
                    <td><span :class="getStatusBadgeClass(plan.status)" class="badge">{{ plan.status }}</span></td>
                    <td>
                      <div class="action-buttons">
                         <router-link :to="`/plans/${plan.id}/edit`" class="btn-action btn-edit" title="Edit Plan">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </router-link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="card-body text-center text-gray-500">
            No plans available for this package. Create one to begin adding activities.
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { Package } from '@/interfaces/package.interface'
import type { CommonResponse } from '@/interfaces/common.response.interface'
import { toast } from 'vue-sonner'

const API = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const router = useRouter()

const pkg = ref<Package | null>(null)
const form = reactive({
  packageName: '',
  startDate: '',
  endDate: '',
  quota: 0,
})

// Utility function to get status badge class
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'badge-pending'
    case 'Unfulfilled':
      return 'badge-active' // Greenish
    case 'Fulfilled':
      return 'badge-default' // Gray/Blue
    default:
      return 'badge-default'
  }
}

onMounted(async () => {
  const id = route.params.id as string
  try {
    const res = await axios.get<CommonResponse<Package>>(`${API}package/${id}`)
    pkg.value = res.data.data

    const formatForInput = (dateStr: string) => {
      if (!dateStr) return ''
      // Remove the 'Z' if exists and take only the first 16 chars (YYYY-MM-DDTHH:mm)
      return dateStr.replace('Z', '').substring(0, 16)
    }

    Object.assign(form, {
      packageName: pkg.value.packageName,
      startDate: formatForInput(pkg.value.startDate),
      endDate: formatForInput(pkg.value.endDate),
      quota: pkg.value.quota,
    })
  } catch (error) {
    console.error('Failed to fetch package:', error)
    toast.error('❌ Failed to load package data', { position: 'top-right' })
  }
})

async function onUpdate() {
  if (!pkg.value) return

  // Simple date validation
  if (new Date(form.endDate) < new Date(form.startDate)) {
     toast.error('❌ End date cannot be earlier than start date.', { position: 'top-right' })
     return
  }

  try {
    // Payload format disederhanakan
    const payload = {
      packageName: form.packageName,
      startDate: form.startDate,
      endDate: form.endDate,
      quota: form.quota,
    }

    await axios.put(`${API}package/${pkg.value.id}/edit`, payload)

    toast.success('✅ Package updated successfully!', { position: 'top-right' })

    // Redirect back to package detail (assuming detail route exists)
    router.push(`/package/${pkg.value.id}`)
  } catch (error) {
    console.error('Update error:', error)
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || 'Failed to update package due to server error.'
      toast.error(`❌ Error: ${errorMsg}`, { position: 'top-right' })
    } else {
      toast.error('❌ Error: Failed to update package.', { position: 'top-right' })
    }
  }
}
</script>

<style scoped>
/* ==================================== */
/* INHERITED BASE STYLES */
/* ==================================== */
.edit-plan-container {
  min-height: 100vh;
  background-color: #f7fafc;
  padding: 3rem 1rem;
}

.edit-plan-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Back Button */
.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  margin-bottom: 1.5rem;
}

.btn-back:hover {
  background-color: #f0f0f5;
  border-color: #a0a0a0;
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* Header Styles */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #718096;
}

/* Card Structure */
.form-card,
.activities-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.activities-card {
    margin-top: 2rem;
}

/* Card Header (Themed) */
.bg-theme-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #667eea;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}


.card-title-white {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon-white {
  width: 1.5rem;
  height: 1.5rem;
}

.card-body {
  padding: 2rem;
}

/* Form Elements */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568;
}

.required {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.form-input:disabled {
  background-color: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

/* Buttons */
.btn {
  padding: 0.75rem 1.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-theme-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.btn-theme-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -3px rgba(102, 126, 234, 0.4);
}

.btn-white {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.btn-white:hover {
  background-color: #f9fafb;
  border-color: #a0aec0;
}


/* Table Styles (Matching Activity List Table) */
.table-container {
  overflow-x: auto;
  border-radius: 0 0 0.75rem 0.75rem;
}

.activities-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.activities-table thead {
    /* Use the same gradient as the card header for table header */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.activities-table th {
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.activities-table td {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  color: #2d3748;
}

.activities-table tbody tr:hover {
  background-color: #f7fafc;
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

.badge-default {
    background-color: #e0e7ff; /* light indigo */
    color: #4338ca;
}

.badge-active { /* Used for Unfulfilled */
  background: #d1fae5;
  color: #065f46;
}

.badge-pending {
  background: #fef3c7;
  color: #92400e;
}

/* Actions */
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
    transition: all 0.2s;
}
.btn-action svg {
    width: 1.125rem;
    height: 1.125rem;
}

.btn-edit {
    background: #fef3c7;
    color: #92400e;
}
.btn-edit:hover {
    background: #fde68a;
    transform: scale(1.1);
}

/* Loading Spinner */
.state-card {
    text-align: center;
    padding: 4rem;
}
.spinner {
  width: 3rem;
  height: 3rem;
  margin: 0 auto;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea; /* Theme color */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.state-text {
    color: #718096;
    margin-top: 1rem;
}
</style>

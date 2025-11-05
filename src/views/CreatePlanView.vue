<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <!-- Header Gradient -->
      <div
        class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-t-xl font-semibold"
      >
        Plan Information
      </div>

      <!-- Form Body -->
      <div class="p-6 space-y-6">
        <h1 class="text-2xl font-bold text-gray-800">Create New Plan</h1>

        <!-- Error Alert -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ error }}
        </div>

        <!-- Warning if package is not Pending -->
        <div
          v-if="pkg && pkg.status !== 'Pending'"
          class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg"
        >
          ⚠️ This package has status "{{ pkg.status }}". Plans can only be created for packages with
          "Pending" status.
        </div>

        <!-- Plan Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
          <input
            v-model="form.planName"
            type="text"
            class="input"
            placeholder="Jakarta-Bali Flight Plan"
            :disabled="pkg?.status !== 'Pending'"
          />
        </div>

        <!-- Activity Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Activity Type *</label>
          <select v-model="form.activityType" class="input" :disabled="pkg?.status !== 'Pending'">
            <option value="">Select activity type</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Vehicle Rental">Vehicle Rental</option>
            <option value="Flight">Flight</option>
          </select>
        </div>

        <!-- Dates -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              v-model="form.startDate"
              type="datetime-local"
              class="input"
              :disabled="pkg?.status !== 'Pending'"
            />
            <p v-if="pkg" class="text-xs text-gray-500 mt-1">
              Package starts: {{ formatDate(pkg.startDate) }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
            <input
              v-model="form.endDate"
              type="datetime-local"
              class="input"
              :disabled="pkg?.status !== 'Pending'"
            />
            <p v-if="pkg" class="text-xs text-gray-500 mt-1">
              Package ends: {{ formatDate(pkg.endDate) }}
            </p>
          </div>
        </div>

        <!-- Locations -->
        <div class="space-y-4">
          <!-- Start Location Section -->
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="font-semibold text-gray-700 mb-3">Start Location *</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  v-model="startProvince"
                  class="input"
                  :disabled="pkg?.status !== 'Pending' || isLoadingLocations"
                >
                  <option value="">
                    {{ isLoadingLocations ? 'Loading provinces...' : 'Select province' }}
                  </option>
                  <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
                    {{ prov.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City/Regency</label>
                <select
                  v-model="form.startLocation"
                  class="input"
                  :disabled="pkg?.status !== 'Pending' || !startProvince || isLoadingStartRegencies"
                >
                  <option value="">
                    {{
                      isLoadingStartRegencies
                        ? 'Loading cities...'
                        : startProvince
                          ? 'Select city/regency'
                          : 'Select province first'
                    }}
                  </option>
                  <option v-for="reg in startRegencies" :key="reg.code" :value="reg.name">
                    {{ reg.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- End Location Section -->
          <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 class="font-semibold text-gray-700 mb-3">End Location *</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <select
                  v-model="endProvince"
                  class="input"
                  :disabled="pkg?.status !== 'Pending' || isLoadingLocations"
                >
                  <option value="">
                    {{ isLoadingLocations ? 'Loading provinces...' : 'Select province' }}
                  </option>
                  <option v-for="prov in provinces" :key="prov.code" :value="prov.code">
                    {{ prov.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City/Regency</label>
                <select
                  v-model="form.endLocation"
                  class="input"
                  :disabled="pkg?.status !== 'Pending' || !endProvince || isLoadingEndRegencies"
                >
                  <option value="">
                    {{
                      isLoadingEndRegencies
                        ? 'Loading cities...'
                        : endProvince
                          ? 'Select city/regency'
                          : 'Select province first'
                    }}
                  </option>
                  <option v-for="reg in endRegencies" :key="reg.code" :value="reg.name">
                    {{ reg.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning for Accommodation -->
        <div
          v-if="
            form.activityType === 'Accommodation' &&
            form.startLocation &&
            form.endLocation &&
            form.startLocation !== form.endLocation
          "
          class="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg text-sm"
        >
          ⚠️ For Accommodation type, Start Location and End Location must be the same.
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <button @click="router.push(`/package/${route.params.id}`)" class="btn-gray">
            Cancel
          </button>
          <button
            @click="handleSubmit"
            class="btn-primary"
            :disabled="pkg?.status !== 'Pending'"
            :class="{ 'opacity-50 cursor-not-allowed': pkg?.status !== 'Pending' }"
          >
            Create Plan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { CommonResponse } from '@/interfaces/common.response.interface'
import type { Package } from '@/interfaces/package.interface'

const route = useRoute()
const router = useRouter()
const API = import.meta.env.VITE_API_BASE_URL

const form = ref({
  planName: '',
  activityType: '',
  startDate: '',
  endDate: '',
  startLocation: '',
  endLocation: '',
})

interface Province {
  code: string
  name: string
}

interface Regency {
  code: string
  province_code: string
  name: string
}

const provinces = ref<Province[]>([])
const pkg = ref<Package | null>(null)
const error = ref<string>('')
const isLoadingLocations = ref(false)

// Cascading dropdown states
const startProvince = ref<string>('')
const endProvince = ref<string>('')
const startRegencies = ref<Regency[]>([])
const endRegencies = ref<Regency[]>([])
const isLoadingStartRegencies = ref(false)
const isLoadingEndRegencies = ref(false)

// Watch for start province changes
watch(startProvince, async (provCode) => {
  startRegencies.value = []
  form.value.startLocation = ''

  if (provCode) {
    isLoadingStartRegencies.value = true
    try {
      const res = await axios.get<{ data: Regency[] }>(
        `${API}location/regencies/${provCode}`,
      )
      startRegencies.value = res.data.data
      console.log('✅ Loaded start regencies:', startRegencies.value.length)
    } catch (err) {
      console.error('Failed to fetch start regencies:', err)
      alert('❌ Failed to load cities for selected province')
    } finally {
      isLoadingStartRegencies.value = false
    }
  }
})

// Watch for end province changes
watch(endProvince, async (provCode) => {
  endRegencies.value = []
  form.value.endLocation = ''

  if (provCode) {
    isLoadingEndRegencies.value = true
    try {
      const res = await axios.get<{ data: Regency[] }>(
        `${API}location/regencies/${provCode}`,
      )
      endRegencies.value = res.data.data
      console.log('✅ Loaded end regencies:', endRegencies.value.length)
    } catch (err) {
      console.error('Failed to fetch end regencies:', err)
      alert('❌ Failed to load cities for selected province')
    } finally {
      isLoadingEndRegencies.value = false
    }
  }
})

onMounted(async () => {
  // Fetch package details
  try {
    const response = await axios.get<CommonResponse<Package>>(`${API}package/${route.params.id}`)
    pkg.value = response.data.data
  } catch (e) {
    console.error('Failed to fetch package:', e)
    alert('❌ Failed to load package details')
    router.push('/package')
    return
  }

  // Fetch provinces from wilayah.id API
  await fetchProvinces()
})

async function fetchProvinces() {
  isLoadingLocations.value = true
  try {
    const provincesResponse = await axios.get<{ data: Province[] }>(
      `${API}location/provinces`,
    )
    provinces.value = provincesResponse.data.data
    console.log('✅ Loaded provinces:', provinces.value.length)
  } catch (e) {
    console.error('Failed to fetch provinces from backend:', e)
    // Fallback to dummy data if API fails
    provinces.value = [
      { code: '31', name: 'DKI Jakarta' },
      { code: '32', name: 'Jawa Barat' },
      { code: '33', name: 'Jawa Tengah' },
      { code: '35', name: 'Jawa Timur' },
      { code: '51', name: 'Bali' },
    ]
  } finally {
    isLoadingLocations.value = false
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function validateForm(): boolean {
  error.value = ''

  // Check if package status is Pending
  if (pkg.value?.status !== 'Pending') {
    error.value = 'Plans can only be created for packages with "Pending" status'
    return false
  }

  // Check all required fields
  if (!form.value.planName.trim()) {
    error.value = 'Plan Name is required'
    return false
  }

  if (!form.value.activityType) {
    error.value = 'Activity Type is required'
    return false
  }

  if (!form.value.startDate) {
    error.value = 'Start Date is required'
    return false
  }

  if (!form.value.endDate) {
    error.value = 'End Date is required'
    return false
  }

  if (!form.value.startLocation) {
    error.value = 'Start Location is required'
    return false
  }

  if (!form.value.endLocation) {
    error.value = 'End Location is required'
    return false
  }

  // Date validations
  const planStartDate = new Date(form.value.startDate)
  const planEndDate = new Date(form.value.endDate)
  const packageStartDate = new Date(pkg.value!.startDate)
  const packageEndDate = new Date(pkg.value!.endDate)

  // EndDate tidak boleh lebih dahulu daripada StartDate
  if (planEndDate < planStartDate) {
    error.value = 'End Date cannot be earlier than Start Date'
    return false
  }

  // StartDate tidak boleh lebih dahulu daripada startDate Package
  if (planStartDate < packageStartDate) {
    error.value = `Plan Start Date must be on or after Package Start Date (${formatDate(pkg.value!.startDate)})`
    return false
  }

  // EndDate tidak boleh setelah EndDate Package
  if (planEndDate > packageEndDate) {
    error.value = `Plan End Date must be on or before Package End Date (${formatDate(pkg.value!.endDate)})`
    return false
  }

  // For Accommodation, start and end location must be the same
  if (form.value.activityType === 'Accommodation') {
    if (form.value.startLocation !== form.value.endLocation) {
      error.value = 'For Accommodation type, Start Location and End Location must be the same'
      return false
    }
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  try {
    // Convert dates to ISO string format
    const payload = {
      planName: form.value.planName.trim(),
      activityType: form.value.activityType,
      startDate: new Date(form.value.startDate).toISOString(),
      endDate: new Date(form.value.endDate).toISOString(),
      startLocation: form.value.startLocation,
      endLocation: form.value.endLocation,
    }

    await axios.post(`${API}package/${route.params.id}/plans/create`, payload)
    alert('✅ Plan created successfully!')
    router.push(`/package/${route.params.id}`)
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const msg = e?.response?.data?.message ?? 'Failed to create plan'
      error.value = msg
    } else {
      error.value = 'An unexpected error occurred'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

.input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-primary {
  background-color: #9333ea;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover:not(:disabled) {
  background-color: #7e22ce;
}

.btn-gray {
  background-color: #e5e7eb;
  color: #1f2937;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.btn-gray:hover {
  background-color: #d1d5db;
}
</style>

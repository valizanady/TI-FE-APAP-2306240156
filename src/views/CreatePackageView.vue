<!-- src/views/packages/CreatePackageView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
    <!-- Header -->
    <div class="max-w-3xl w-full text-center mb-10">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">Create New Package</h1>
      <p class="text-gray-500">Fill in the information below to create your tour package.</p>
    </div>

    <!-- Card -->
    <div
      class="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <!-- Gradient Header -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <h2 class="text-white text-lg font-semibold tracking-wide">Package Information</h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="p-8 space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <!-- Package Name -->
          <div class="sm:col-span-2">
            <label class="form-label">Package Name *</label>
            <input
              v-model="form.packageName"
              type="text"
              placeholder="e.g. Jakarta - Bali Adventure Package"
              class="form-input"
              required
            />
          </div>

          <!-- Quota -->
          <div>
            <label class="form-label">Quota *</label>
            <input
              v-model.number="form.quota"
              type="number"
              min="1"
              placeholder="25"
              class="form-input"
              required
            />
          </div>

          <!-- Start Date -->
          <div>
            <label class="form-label">Start Date *</label>
            <input v-model="form.startDate" type="datetime-local" class="form-input" required />
          </div>

          <!-- End Date -->
          <div>
            <label class="form-label">End Date *</label>
            <input v-model="form.endDate" type="datetime-local" class="form-input" required />
          </div>
        </div>

        <!-- Error message -->
        <p v-if="errorMsg" class="text-sm text-red-600 font-medium pt-2">
          {{ errorMsg }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="onCancel"
            class="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            class="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Create Package
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePackageStore } from '@/stores/package'
import { toast } from 'vue-sonner'

const router = useRouter()
const store = usePackageStore()
const errorMsg = ref<string | null>(null)

const form = reactive({
  packageName: '',
  quota: 1,
  startDate: '',
  endDate: '',
})

const onSubmit = async () => {
  errorMsg.value = null
  if (new Date(form.endDate) < new Date(form.startDate)) {
    errorMsg.value = 'End date cannot be earlier than start date'
    return
  }
  try {
    await store.create(form)
    toast.success('✅ Package created successfully')
    router.push('/package')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message ?? e.message
    toast.error(`❌ ${errorMsg.value}`)
  }
}

const onCancel = () => router.push('/package')
</script>

<style scoped>
.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  color: #1f2937;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style>

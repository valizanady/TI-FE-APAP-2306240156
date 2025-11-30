<template>
  <div class="edit-plan-container">
    <div class="edit-plan-wrapper max-w-3xl">
      <button class="btn-back" @click="onCancel">
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
        Back to Packages
      </button>

      <div class="page-header">
        <h1 class="page-title">➕ Create New Package</h1>
        <p class="page-subtitle">Fill in the information below to create your tour package.</p>
      </div>

      <div class="form-card">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-8 4h16"
              />
            </svg>
            Package Information
          </h2>
        </div>
        <div class="card-body">
          <form @submit.prevent="onSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div class="form-group md:col-span-2">
                <label class="form-label" for="packageName">
                  Package Name <span class="required">*</span>
                </label>
                <input
                  id="packageName"
                  v-model="form.packageName"
                  type="text"
                  placeholder="e.g. Jakarta - Bali Adventure Package"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="quota">
                  Quota <span class="required">*</span>
                </label>
                <input
                  id="quota"
                  v-model.number="form.quota"
                  type="number"
                  min="1"
                  placeholder="25"
                  class="form-input"
                  required
                />
              </div>

              <div class="hidden md:block"></div>

              <div class="form-group">
                <label class="form-label" for="startDate">
                  Start Date <span class="required">*</span>
                </label>
                <input
                  id="startDate"
                  v-model="form.startDate"
                  type="datetime-local"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="endDate">
                  End Date <span class="required">*</span>
                </label>
                <input
                  id="endDate"
                  v-model="form.endDate"
                  type="datetime-local"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <div v-if="errorMsg" class="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="alert-icon"
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
              <span>{{ errorMsg }}</span>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button type="button" @click="onCancel" class="btn btn-white">
                Cancel
              </button>

              <button type="submit" class="btn btn-theme-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="btn-icon-sm"
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
                Create Package
              </button>
            </div>
          </form>
        </div>
      </div>
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
    // Menggunakan toast.success default
    toast.success('✅ Package created successfully')
    router.push('/package')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const message = e.response?.data?.message ?? e.message
    errorMsg.value = message
    // Menggunakan toast.error default
    toast.error(`❌ Failed to create package: ${message}`)
  }
}

const onCancel = () => router.push('/package')
</script>

<style scoped>
/* ==================================== */
/* DESIGN THEME INHERITANCE */
/* ==================================== */

/* Base Container (from Edit Plan, keeping background light) */
.edit-plan-container {
  min-height: 100vh;
  background-color: #f7fafc; /* light gray/white background */
  padding: 3rem 1rem;
}

.edit-plan-wrapper {
  max-width: 1280px;
  margin: 0 auto;
}

/* Back Button (Retained style) */
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
  background-color: #f0f0f5; /* Light hover */
  border-color: #a0a0a0;
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* Header Styles (Enhanced for Theme Consistency) */
.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a202c;
  /* Applying Activity List Gradient Text */
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

/* Card Styles (The Stolen Structure) */
.form-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Deeper shadow */
  overflow: hidden;
}

/* Card Header (Matching Gradient Theme) */
.bg-theme-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #667eea;
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
  padding: 2rem; /* Increased inner padding */
}

/* Form Elements (from Edit Plan, themed) */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a5568; /* Darker label for clarity */
}

.required {
  color: #ef4444;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem; /* Taller input */
  border: 2px solid #e2e8f0; /* Thicker border */
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea; /* Theme color focus */
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2); /* Theme color glow */
}

/* Alert Error (from Edit Plan) */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

/* Buttons (Themed) */

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
  /* Matching Create Button Gradient */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(102, 126, 234, 0.3);
}

.btn-theme-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 10px -3px rgba(102, 126, 234, 0.4);
}

.btn-white {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4a5568;
}

.btn-white:hover {
  background-color: #f9fafb;
  border-color: #a0aec0;
}

.btn-icon-sm {
    width: 1.125rem;
    height: 1.125rem;
}
</style>

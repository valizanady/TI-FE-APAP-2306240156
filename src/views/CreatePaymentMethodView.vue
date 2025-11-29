<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <router-link to="/payment-methods" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm mb-4 inline-flex items-center gap-2">
          ← Back to Payment Methods
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900 mt-4">💰 Add Payment Method</h1>
        <p class="text-gray-600 mt-1">Create a new payment method for top-up transactions</p>
      </div>

      <!-- Form Card -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <form @submit.prevent="handleSubmit">
          <!-- Method Name -->
          <div class="mb-6">
            <label for="methodName" class="block text-sm font-medium text-gray-700 mb-2">
              Method Name <span class="text-red-500">*</span>
            </label>
            <input
              id="methodName"
              v-model="formData.methodName"
              type="text"
              placeholder="e.g., Bank Transfer, E-Wallet, Credit Card"
              class="form-input"
              :class="{ 'border-red-500': errors.methodName }"
              required
            />
            <p v-if="errors.methodName" class="text-red-500 text-sm mt-1">
              {{ errors.methodName }}
            </p>
          </div>

          <!-- Provider -->
          <div class="mb-6">
            <label for="provider" class="block text-sm font-medium text-gray-700 mb-2">
              Provider <span class="text-red-500">*</span>
            </label>
            <input
              id="provider"
              v-model="formData.provider"
              type="text"
              placeholder="e.g., BCA, Mandiri, GoPay, OVO"
              class="form-input"
              :class="{ 'border-red-500': errors.provider }"
              required
            />
            <p v-if="errors.provider" class="text-red-500 text-sm mt-1">
              {{ errors.provider }}
            </p>
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div class="flex gap-3">
              <span class="text-blue-600 text-xl">ℹ️</span>
              <div class="text-sm text-blue-800">
                <p class="font-semibold mb-1">About Payment Methods</p>
                <ul class="list-disc list-inside space-y-1 text-blue-700">
                  <li>Payment methods will be set to <strong>Active</strong> by default</li>
                  <li>Customers can select active payment methods when creating top-ups</li>
                  <li>You can deactivate or delete payment methods later</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 justify-end">
            <router-link
              to="/payment-methods"
              class="btn-cancel"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="btn-submit"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="flex items-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </span>
              <span v-else>
                ➕ Create Payment Method
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTopUpStore } from '@/stores/topup'
import { toast } from 'vue-sonner'

const router = useRouter()
const topupStore = useTopUpStore()

const formData = ref({
  methodName: '',
  provider: '',
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value.methodName.trim()) {
    errors.value.methodName = 'Method name is required'
  } else if (formData.value.methodName.trim().length < 3) {
    errors.value.methodName = 'Method name must be at least 3 characters'
  }

  if (!formData.value.provider.trim()) {
    errors.value.provider = 'Provider is required'
  } else if (formData.value.provider.trim().length < 2) {
    errors.value.provider = 'Provider must be at least 2 characters'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('❌ Please fix the form errors')
    return
  }

  isSubmitting.value = true

  try {
    await topupStore.createPaymentMethod({
      methodName: formData.value.methodName.trim(),
      provider: formData.value.provider.trim(),
    })

    toast.success('✅ Payment method created successfully!')

    // Redirect to payment methods list
    setTimeout(() => {
      router.push('/payment-methods')
    }, 500)
  } catch (error) {
    console.error('Failed to create payment method:', error)
    toast.error('❌ Failed to create payment method')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #6d28d9;
  box-shadow: 0 0 0 3px rgba(109, 40, 217, 0.1);
}

.form-input.border-red-500 {
  border-color: #ef4444;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}

.btn-submit {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.3);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
</style>

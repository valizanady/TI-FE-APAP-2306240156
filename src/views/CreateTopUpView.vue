<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
    <!-- Header -->
    <div class="max-w-3xl w-full text-center mb-10">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-2">💳 Create Top-Up</h1>
      <p class="text-gray-500">Top-up your balance to purchase tour packages</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
      <!-- Gradient Header -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <h2 class="text-white text-lg font-semibold tracking-wide">Top-Up Information</h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="p-8 space-y-6">
        <!-- User Info (Read-only) -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800">
            <strong>Customer:</strong> {{ username }}
          </p>
          <p class="text-sm text-blue-800 mt-1">
            <strong>Customer ID:</strong> {{ userId }}
          </p>
        </div>

        <!-- Amount -->
        <div>
          <label class="form-label">Amount (Rp) *</label>
          <input
            v-model.number="form.amount"
            type="number"
            min="1"
            step="1"
            placeholder="100000"
            class="form-input"
            required
          />
          <p class="text-xs text-gray-500 mt-1">
            Minimum amount: Rp 1
          </p>
        </div>

        <!-- Payment Method -->
        <div>
          <label class="form-label">Payment Method *</label>
          <select v-model="form.paymentMethodId" class="form-input" required>
            <option value="" disabled>Select payment method</option>
            <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
              {{ method.methodName }} - {{ method.provider }}
            </option>
          </select>
        </div>

        <!-- Error message -->
        <p v-if="errorMsg" class="text-sm text-red-600 font-medium pt-2">
          ❌ {{ errorMsg }}
        </p>

        <!-- Buttons -->
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="onCancel" class="btn-cancel">
            Cancel
          </button>

          <button type="submit" :disabled="isLoading" class="btn-submit">
            <span v-if="isLoading">Creating...</span>
            <span v-else>💳 Create Top-Up</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Info Box -->
    <div class="max-w-3xl w-full mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 class="font-semibold text-yellow-900 mb-2">📋 Important Information:</h3>
      <ul class="text-sm text-yellow-800 space-y-1">
        <li>• Your transaction will be in <strong>Pending</strong> status after creation</li>
        <li>• Please wait for admin to approve your top-up request</li>
        <li>• Balance will be added after approval</li>
        <li>• Transaction status can be checked in the Top-Up page</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTopUpStore } from '@/stores/topup'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const topupStore = useTopUpStore()
const authStore = useAuthStore()

const errorMsg = ref<string | null>(null)
const isLoading = computed(() => topupStore.isLoading)
const paymentMethods = computed(() => topupStore.getPaymentMethods)
const userId = computed(() => authStore.getUserId)
const username = computed(() => authStore.getUsername)

const form = reactive({
  amount: 0,
  paymentMethodId: '',
})

onMounted(async () => {
  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    alert('⚠️  Please login first to create top-up')
    authStore.loginRedirect()
    return
  }

  // Check if user is Customer
  if (authStore.getUserRole !== 'Customer') {
    alert('⚠️  Only customers can create top-up transactions')
    router.push('/topup')
    return
  }

  // Fetch payment methods
  try {
    await topupStore.fetchPaymentMethods()
  } catch {
    errorMsg.value = 'Failed to load payment methods'
  }
})

const onSubmit = async () => {
  errorMsg.value = null

  // Validation
  if (!form.amount || form.amount < 1) {
    errorMsg.value = 'Amount must be at least Rp 1'
    return
  }

  if (!form.paymentMethodId) {
    errorMsg.value = 'Please select a payment method'
    return
  }

  if (!userId.value) {
    errorMsg.value = 'Customer ID not found. Please login again.'
    return
  }

  try {
    await topupStore.createTransaction({
      customerId: String(userId.value),
      amount: form.amount,
      paymentMethodId: form.paymentMethodId,
    })

    alert('✅ Top-up transaction created successfully!\nPlease wait for admin approval.')
    router.push('/topup')
  } catch (error) {
    if (error instanceof Error) {
      errorMsg.value = error.message
    } else {
      errorMsg.value = 'Failed to create top-up transaction'
    }
  }
}

const onCancel = () => router.push('/topup')
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

.btn-cancel {
  padding: 0.625rem 1.5rem;
  border: 1px solid #d1d5db;
  color: #374151;
  background-color: white;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background-color: #f3f4f6;
}

.btn-submit {
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  border: none;
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
}
</style>

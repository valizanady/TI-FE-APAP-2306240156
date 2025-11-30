<template>
  <div class="edit-plan-container">
    <div class="edit-plan-wrapper max-w-3xl">
      <div class="page-header">
        <h1 class="page-title">💳 Create Top-Up</h1>
        <p class="page-subtitle">Top-up your balance to purchase tour packages.</p>
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
                d="M3 10h18M7 15h1m4 0h1m-9 5h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Top-Up Information
          </h2>
        </div>

        <div class="card-body">
          <form @submit.prevent="onSubmit" class="space-y-6">
            <div class="alert alert-info">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p class="alert-text">
                  <strong>Customer:</strong> {{ username }}
                </p>
                <p class="alert-text mt-1">
                  <strong>Customer ID:</strong> {{ userId }}
                </p>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="amount">
                Amount (Rp) <span class="required">*</span>
              </label>
              <input
                id="amount"
                v-model.number="form.amount"
                type="number"
                min="1"
                step="1"
                placeholder="100000"
                class="form-input"
                required
              />
              <p class="input-note">
                Minimum amount: Rp 1
              </p>
            </div>

            <div class="form-group">
              <label class="form-label" for="paymentMethod">
                Payment Method <span class="required">*</span>
              </label>
              <select id="paymentMethod" v-model="form.paymentMethodId" class="form-input" required>
                <option value="" disabled>Select payment method</option>
                <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                  {{ method.methodName }} - {{ method.provider }}
                </option>
              </select>
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

              <button type="submit" :disabled="isLoading" class="btn btn-theme-primary">
                <span v-if="isLoading">Creating...</span>
                <span v-else>💳 Create Top-Up</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="alert alert-warning mt-6">
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="alert-title-warning">📋 Important Information:</h3>
          <ul class="alert-list">
            <li>• Your transaction will be in **Pending** status after creation.</li>
            <li>• Please wait for admin to approve your top-up request.</li>
            <li>• Balance will be added after approval.</li>
            <li>• Transaction status can be checked in the Top-Up page.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTopUpStore } from '@/stores/topup'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

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

const toastOptions = {
  duration: 4000,
  position: 'top-right' as const,
}

onMounted(async () => {
  // Check if user is logged in
  if (!authStore.isLoggedIn) {
    toast.error('⚠️ Please login first to create top-up', toastOptions);
    authStore.loginRedirect();
    return;
  }

  // Check if user is Customer
  if (authStore.getUserRole !== 'Customer') {
    toast.error('⚠️ Only customers can create top-up transactions', toastOptions);
    router.push('/topup');
    return;
  }

  // Fetch payment methods
  try {
    await topupStore.fetchPaymentMethods()
  } catch {
    errorMsg.value = 'Failed to load payment methods'
    toast.error('❌ Failed to load payment methods.', toastOptions);
  }
})

const onSubmit = async () => {
  errorMsg.value = null

  // Validation
  if (!form.amount || form.amount < 1) {
    errorMsg.value = 'Amount must be at least Rp 1'
    toast.error('❌ Amount must be at least Rp 1.', toastOptions);
    return
  }

  if (!form.paymentMethodId) {
    errorMsg.value = 'Please select a payment method'
    toast.error('❌ Please select a payment method.', toastOptions);
    return
  }

  if (!userId.value) {
    errorMsg.value = 'Customer ID not found. Please login again.'
    toast.error('❌ Customer ID not found. Please login again.', toastOptions);
    return
  }

  try {
    await topupStore.createTransaction({
      customerId: String(userId.value),
      amount: form.amount,
      paymentMethodId: form.paymentMethodId,
    })

    toast.success('✅ Top-up transaction created successfully! Please wait for admin approval.', toastOptions);
    router.push('/topup')
  } catch (error) {
    let message = 'Failed to create top-up transaction';
    if (error instanceof Error) {
      message = error.message;
    }
    errorMsg.value = message;
    toast.error(`❌ Error: ${message}`, toastOptions);
  }
}

const onCancel = () => router.push('/topup')
</script>

<style scoped>
/* ==================================== */
/* DESIGN THEME INHERITANCE */
/* ==================================== */

/* Base Container (from Edit Plan/Create Package) */
.edit-plan-container {
  min-height: 100vh;
  background-color: #f7fafc; /* light gray/white background */
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-plan-wrapper {
  max-width: 800px; /* Lebar maksimum yang lebih fokus untuk form tunggal */
  margin: 0 auto;
}

/* Header Styles (Enhanced for Theme Consistency) */
.page-header {
  margin-bottom: 2rem;
  text-align: center;
  width: 100%;
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
  width: 100%;
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

.input-note {
    font-size: 0.8125rem;
    color: #718096;
    margin-top: 0.25rem;
}

/* Alert Info Box (Replaces bg-blue-50) */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Customer Info (Info Alert) */
.alert-info {
  background-color: #e0e7ff; /* Light indigo */
  border: 1px solid #c3dafe;
}
.alert-text {
    font-size: 0.875rem;
    color: #374151;
}

/* Error Alert */
.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

/* Important Info Box (Warning Alert) */
.alert-warning {
    background-color: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
}
.alert-title-warning {
    font-weight: 600;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    color: #92400e;
}
.alert-list {
    list-style: none;
    padding-left: 0;
    margin-top: 0.5rem;
}
.alert-list li {
    font-size: 0.875rem;
    line-height: 1.4;
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
</style>

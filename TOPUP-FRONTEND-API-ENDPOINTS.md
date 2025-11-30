# 📱 Frontend Top-Up API Endpoints

## 🔧 Base URL Configuration

```typescript
// .env atau .env.production
VITE_API_BASE_URL=http://2306240156-be.hafizmuh.site/api/
```

**Full Base URL**: `http://2306240156-be.hafizmuh.site/api/`

**⚠️ Note**: `/api/` sudah included di BASE_URL, jadi di service hanya perlu `${BASE_URL}transactions` (TANPA `/api/` lagi)

---

## 🔗 Top-Up Transaction Endpoints

### 1️⃣ **Get All Transactions** (Customer/Superadmin)

**Endpoint**: `transactions` (BASE_URL already includes `/api/`)  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/transactions`

**Frontend Service**: `topUpService.getAllTransactions()`

**Response**:
```typescript
TopUpTransaction[] // List of transactions
```

**Access**:
- ✅ Customer: Own transactions only (auto-filtered)
- ✅ Superadmin: All transactions

**Usage**:
```typescript
const transactions = await topUpService.getAllTransactions()
```

---

### 2️⃣ **Get Transaction by ID** (Superadmin Only)

**Endpoint**: `GET /api/transactions/{id}`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/transactions/{id}`

**Frontend Service**: `topUpService.getTransactionById(id)`

**Response**:
```typescript
TopUpTransaction // Single transaction
```

**Access**: ✅ Superadmin only

**Usage**:
```typescript
const transaction = await topUpService.getTransactionById('550e8400-...')
```

---

### 3️⃣ **Create Transaction** (Customer Only)

**Endpoint**: `POST /api/transactions`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/transactions`

**Frontend Service**: `topUpService.createTransaction(data)`

**Request Body**:
```typescript
{
  customerId: string,      // UUID from auth store
  amount: number,          // Minimum: 1
  paymentMethodId: string  // Payment method UUID
}
```

**Response**:
```typescript
TopUpTransaction // Created transaction
```

**Access**: ✅ Customer only

**Usage**:
```typescript
const newTransaction = await topUpService.createTransaction({
  customerId: '550e8400-...',
  amount: 500000,
  paymentMethodId: 'pm-001'
})
```

---

### 4️⃣ **Update Transaction Status** (Superadmin Only)

**Endpoint**: `PUT /api/transactions/{id}/status`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/transactions/{id}/status`

**Frontend Service**: `topUpService.updateTransactionStatus(id, data)`

**Request Body**:
```typescript
{
  status: 'Approved' | 'Rejected'
}
```

**Response**:
```typescript
TopUpTransaction // Updated transaction
```

**Access**: ✅ Superadmin only

**Usage**:
```typescript
const updated = await topUpService.updateTransactionStatus('550e8400-...', {
  status: 'Approved'
})
```

---

### 5️⃣ **Delete Transaction** (Superadmin Only)

**Endpoint**: `DELETE /api/transactions/{id}`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/transactions/{id}`

**Frontend Service**: `topUpService.deleteTransaction(id)`

**Response**: `void`

**Access**: ✅ Superadmin only

**Usage**:
```typescript
await topUpService.deleteTransaction('550e8400-...')
```

---

## 💳 Payment Method Endpoints

### 1️⃣ **Get All Payment Methods**

**Endpoint**: `GET /api/payment-methods`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/payment-methods`

**Frontend Service**: `topUpService.getAllPaymentMethods()`

**Response**:
```typescript
PaymentMethod[] // List of payment methods
```

**Access**: ✅ All authenticated users

**Usage**:
```typescript
const methods = await topUpService.getAllPaymentMethods()
```

---

### 2️⃣ **Get Payment Method by ID**

**Endpoint**: `GET /api/payment-methods/{id}`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/payment-methods/{id}`

**Frontend Service**: `topUpService.getPaymentMethodById(id)`

**Response**:
```typescript
PaymentMethod // Single payment method
```

**Access**: ✅ All authenticated users

**Usage**:
```typescript
const method = await topUpService.getPaymentMethodById('pm-001')
```

---

### 3️⃣ **Create Payment Method** (Superadmin Only)

**Endpoint**: `POST /api/payment-methods`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/payment-methods`

**Frontend Service**: `topUpService.createPaymentMethod(data)`

**Request Body**:
```typescript
{
  methodName: string,  // e.g., "Bank Transfer", "E-Wallet"
  provider: string     // e.g., "BCA", "GoPay"
}
```

**Response**:
```typescript
PaymentMethod // Created payment method
```

**Access**: ✅ Superadmin only

**Usage**:
```typescript
const method = await topUpService.createPaymentMethod({
  methodName: 'Bank Transfer',
  provider: 'BCA'
})
```

---

### 4️⃣ **Update Payment Method Status** (Superadmin Only)

**Endpoint**: `PUT /api/payment-methods/{id}/status`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/payment-methods/{id}/status`

**Frontend Service**: `topUpService.updatePaymentMethodStatus(id, status)`

**Request Body**:
```typescript
{
  status: 'Active' | 'Inactive'
}
```

**Response**:
```typescript
PaymentMethod // Updated payment method
```

**Access**: ✅ Superadmin only

**Usage**:
```typescript
const updated = await topUpService.updatePaymentMethodStatus('pm-001', 'Inactive')
```

---

### 5️⃣ **Delete Payment Method** (Superadmin Only)

**Endpoint**: `DELETE /api/payment-methods/{id}`  
**Full URL**: `http://2306240156-be.hafizmuh.site/api/payment-methods/{id}`

**Frontend Service**: `topUpService.deletePaymentMethod(id)`

**Response**: `void`

**Access**: ✅ Superadmin only

**Usage**:
```typescript
await topUpService.deletePaymentMethod('pm-001')
```

---

## 📋 Data Interfaces

### TopUpTransaction
```typescript
interface TopUpTransaction {
  id: string                    // UUID
  customerId: string            // UUID
  amount: number                // Rupiah
  status: 'Pending' | 'Approved' | 'Rejected'
  paymentMethodId: string       // UUID
  paymentMethodName: string     // e.g., "Bank Transfer"
  paymentMethodProvider: string // e.g., "BCA"
  createdAt: string             // ISO timestamp
  updatedAt: string             // ISO timestamp
  approvedAt: string | null     // ISO timestamp or null
  approvedBy: string | null     // Admin UUID or null
}
```

### PaymentMethod
```typescript
interface PaymentMethod {
  id: string                          // UUID
  methodName: string                  // e.g., "Bank Transfer"
  provider: string                    // e.g., "BCA"
  status: 'Active' | 'Inactive'
  createdAt: string                   // ISO timestamp
  updatedAt: string                   // ISO timestamp
}
```

### CreateTopUpRequest
```typescript
interface CreateTopUpRequest {
  customerId: string        // UUID from auth store
  amount: number            // Minimum: 1
  paymentMethodId: string   // Payment method UUID
}
```

### UpdateTopUpStatusRequest
```typescript
interface UpdateTopUpStatusRequest {
  status: 'Approved' | 'Rejected'
}
```

---

## 🎯 Frontend Usage Examples

### 1. Create Transaction (Customer)
```vue
<script setup lang="ts">
import { useTopUpStore } from '@/stores/topup'
import { useAuthStore } from '@/stores/auth'

const topupStore = useTopUpStore()
const authStore = useAuthStore()

const createTopUp = async () => {
  await topupStore.createTransaction({
    customerId: authStore.getUserId,
    amount: 500000,
    paymentMethodId: 'pm-001'
  })
  
  // Success: transaction created with status "Pending"
}
</script>
```

### 2. Get Transaction History (Customer)
```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTopUpStore } from '@/stores/topup'

const topupStore = useTopUpStore()
const transactions = ref([])

onMounted(async () => {
  await topupStore.fetchTransactions()
  transactions.value = topupStore.getTransactions
})
</script>

<template>
  <div v-for="tx in transactions" :key="tx.id">
    <p>Amount: Rp {{ tx.amount.toLocaleString('id-ID') }}</p>
    <p>Status: {{ tx.status }}</p>
    <p>Created: {{ new Date(tx.createdAt).toLocaleDateString('id-ID') }}</p>
  </div>
</template>
```

### 3. Approve Transaction (Superadmin)
```vue
<script setup lang="ts">
import { useTopUpStore } from '@/stores/topup'

const topupStore = useTopUpStore()

const approveTransaction = async (transactionId: string) => {
  await topupStore.updateTransactionStatus(transactionId, {
    status: 'Approved'
  })
  
  // Success: balance added to customer's account
}
</script>
```

---

## 🔐 Authentication

**All endpoints require JWT token** in Authorization header:

```typescript
// Axios automatically includes token from interceptor
// Configured in: src/services/axios.config.ts

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 🚦 Status Flow

```
Customer creates transaction
         ↓
    [Pending] ← Initial status
         ↓
    Admin reviews
    ↙         ↘
[Approved]   [Rejected]
    ↓             ↓
Balance +     No change
```

**Status Meanings:**
- **Pending**: Waiting for admin approval
- **Approved**: Admin approved, balance added to customer
- **Rejected**: Admin rejected, no balance change

---

## 📱 Frontend Routes

```typescript
// src/router/index.ts
{
  path: '/topup',
  name: 'TopUp',
  component: () => import('@/views/TopUpView.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/topup/create',
  name: 'CreateTopUp',
  component: () => import('@/views/CreateTopUpView.vue'),
  meta: { requiresAuth: true, role: 'Customer' }
}
```

**URLs:**
- `/topup` - List all transactions (Customer: own, Admin: all)
- `/topup/create` - Create new transaction (Customer only)

---

## 🎨 Frontend Components

### Main Files:
- `src/views/TopUpView.vue` - Transaction list
- `src/views/CreateTopUpView.vue` - Create transaction form
- `src/stores/topup.ts` - Pinia store for state management
- `src/services/topup.service.ts` - API service layer
- `src/interfaces/topup.interface.ts` - TypeScript interfaces

---

## 📝 Summary

**Backend Base URL**: `http://2306240156-be.hafizmuh.site/api/`

**Main Endpoints:**
1. ✅ `GET /transactions` - Get transaction history
2. ✅ `POST /transactions` - Create new transaction
3. ✅ `PUT /transactions/{id}/status` - Approve/reject transaction
4. ✅ `GET /payment-methods` - Get payment methods
5. ✅ `POST /payment-methods` - Create payment method

**Frontend Usage:**
- Import `useTopUpStore()` for state management
- Call store methods: `fetchTransactions()`, `createTransaction()`, etc.
- All API calls handled by `topup.service.ts`
- Authentication handled automatically by Axios interceptor

---

**Last Updated**: November 30, 2025

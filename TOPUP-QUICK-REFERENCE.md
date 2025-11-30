# 🚀 Top-Up Frontend - Quick Reference

## 📍 Base URL
```
http://2306240156-be.hafizmuh.site/api/
```

---

## 🔗 Main Endpoints

### Top-Up Transactions
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/transactions` | Customer, Superadmin | Get transaction history |
| `GET` | `/transactions/{id}` | Superadmin | Get single transaction |
| `POST` | `/transactions` | Customer | Create new transaction |
| `PUT` | `/transactions/{id}/status` | Superadmin | Approve/Reject |
| `DELETE` | `/transactions/{id}` | Superadmin | Delete transaction |

### Payment Methods
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/payment-methods` | All | Get all payment methods |
| `GET` | `/payment-methods/{id}` | All | Get single method |
| `POST` | `/payment-methods` | Superadmin | Create payment method |
| `PUT` | `/payment-methods/{id}/status` | Superadmin | Toggle Active/Inactive |
| `DELETE` | `/payment-methods/{id}` | Superadmin | Delete method |

---

## 💻 Quick Usage

### 1. Get Transaction History (Customer)
```typescript
import { useTopUpStore } from '@/stores/topup'

const topupStore = useTopUpStore()

// Fetch transactions
await topupStore.fetchTransactions()

// Get transactions from state
const transactions = topupStore.getTransactions
```

### 2. Create Transaction (Customer)
```typescript
await topupStore.createTransaction({
  customerId: authStore.getUserId,
  amount: 500000,
  paymentMethodId: 'pm-001'
})
```

### 3. Approve Transaction (Superadmin)
```typescript
await topupStore.updateTransactionStatus(transactionId, {
  status: 'Approved'
})
```

### 4. Get Payment Methods
```typescript
await topupStore.fetchPaymentMethods()
const methods = topupStore.getPaymentMethods
```

---

## 📦 Data Structure

### TopUpTransaction
```typescript
{
  id: string
  customerId: string
  amount: number
  status: 'Pending' | 'Approved' | 'Rejected'
  paymentMethodName: string
  paymentMethodProvider: string
  createdAt: string
  approvedAt: string | null
}
```

### PaymentMethod
```typescript
{
  id: string
  methodName: string     // "Bank Transfer", "E-Wallet"
  provider: string       // "BCA", "GoPay", "OVO"
  status: 'Active' | 'Inactive'
}
```

---

## 🚦 Status Flow
```
Customer creates → [Pending] → Admin reviews → [Approved/Rejected]
                                                      ↓
                                              Balance updated (if Approved)
```

---

## 📱 Frontend Routes
- `/topup` - Transaction list
- `/topup/create` - Create transaction form

---

## 🔐 Authentication
All requests automatically include JWT token via Axios interceptor.

---

## 📝 Files Location
- Store: `src/stores/topup.ts`
- Service: `src/services/topup.service.ts`
- Interfaces: `src/interfaces/topup.interface.ts`
- Views: `src/views/TopUpView.vue`, `src/views/CreateTopUpView.vue`

---

**Full Documentation**: See `TOPUP-FRONTEND-API-ENDPOINTS.md`

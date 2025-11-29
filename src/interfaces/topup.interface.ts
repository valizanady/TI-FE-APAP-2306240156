// src/interfaces/topup.interface.ts

/**
 * Payment Method Interface
 */
export interface PaymentMethod {
  id: string
  methodName: string
  provider: string
  status: 'Active' | 'Inactive'
  createdAt: string
  updatedAt: string
}

/**
 * Top-Up Transaction Interface
 */
export interface TopUpTransaction {
  id: string
  customerId: string
  amount: number
  paymentMethod: PaymentMethod
  status: 'Pending' | 'Success' | 'Failed'
  createdAt: string
  updatedAt: string
}

/**
 * Request DTO for creating Top-Up Transaction
 */
export interface CreateTopUpRequest {
  customerId: string
  amount: number
  paymentMethodId: string
}

/**
 * Request DTO for updating Top-Up Transaction status
 */
export interface UpdateTopUpStatusRequest {
  status: 'Success' | 'Failed'
}

/**
 * User Profile from Auth Service
 */
export interface UserProfile {
  id: string
  username: string
  email: string
  role: string
  balance?: number
}

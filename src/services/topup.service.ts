// src/services/topup.service.ts
import axios from 'axios'
import type {
  TopUpTransaction,
  CreateTopUpRequest,
  UpdateTopUpStatusRequest,
  PaymentMethod,
} from '@/interfaces/topup.interface'
import type { CommonResponse } from '@/interfaces/common.response.interface'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class TopUpService {
  /**
   * Get all top-up transactions (filtered by role in backend)
   */
  async getAllTransactions(): Promise<TopUpTransaction[]> {
    const url = `${BASE_URL}transactions`
    console.log('🔗 GET all transactions:', url)

    try {
      const res = await axios.get<CommonResponse<TopUpTransaction[]>>(url)
      console.log('✅ Transactions retrieved:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to fetch transactions:', error)
      throw error
    }
  }

  /**
   * Get transaction by ID (Superadmin only)
   */
  async getTransactionById(id: string): Promise<TopUpTransaction> {
    const url = `${BASE_URL}transactions/${id}`
    console.log('🔗 GET transaction by ID:', url)

    try {
      const res = await axios.get<CommonResponse<TopUpTransaction>>(url)
      console.log('✅ Transaction retrieved:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to fetch transaction:', error)
      throw error
    }
  }

  /**
   * Create new top-up transaction (Customer only)
   */
  async createTransaction(data: CreateTopUpRequest): Promise<TopUpTransaction> {
    const url = `${BASE_URL}transactions`
    console.log('🔗 POST create transaction:', url)
    console.log('📦 Data:', data)

    try {
      const res = await axios.post<CommonResponse<TopUpTransaction>>(url, data)
      console.log('✅ Transaction created:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to create transaction:', error)
      throw error
    }
  }

  /**
   * Update transaction status (Superadmin only)
   */
  async updateTransactionStatus(
    id: string,
    data: UpdateTopUpStatusRequest
  ): Promise<TopUpTransaction> {
    const url = `${BASE_URL}transactions/${id}/status`
    console.log('🔗 PUT update transaction status:', url)
    console.log('📦 Data:', data)

    try {
      const res = await axios.put<CommonResponse<TopUpTransaction>>(url, data)
      console.log('✅ Transaction status updated:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to update transaction status:', error)
      throw error
    }
  }

  /**
   * Delete transaction (Superadmin only)
   */
  async deleteTransaction(id: string): Promise<void> {
    const url = `${BASE_URL}transactions/${id}`
    console.log('🔗 DELETE transaction:', url)

    try {
      await axios.delete(url)
      console.log('✅ Transaction deleted')
    } catch (error) {
      console.error('❌ Failed to delete transaction:', error)
      throw error
    }
  }

  /**
   * Get all payment methods
   */
  async getAllPaymentMethods(): Promise<PaymentMethod[]> {
    const url = `${BASE_URL}payment-methods`
    console.log('🔗 GET all payment methods:', url)

    try {
      const res = await axios.get<CommonResponse<PaymentMethod[]>>(url)
      console.log('✅ Payment methods retrieved:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to fetch payment methods:', error)
      throw error
    }
  }

  /**
   * Get payment method by ID
   */
  async getPaymentMethodById(id: string): Promise<PaymentMethod> {
    const url = `${BASE_URL}payment-methods/${id}`
    console.log('🔗 GET payment method by ID:', url)

    try {
      const res = await axios.get<CommonResponse<PaymentMethod>>(url)
      console.log('✅ Payment method retrieved:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to fetch payment method:', error)
      throw error
    }
  }

  /**
   * Create new payment method (Superadmin only)
   */
  async createPaymentMethod(data: { methodName: string; provider: string }): Promise<PaymentMethod> {
    const url = `${BASE_URL}payment-methods`
    console.log('🔗 POST create payment method:', url)
    console.log('📦 Data:', data)

    try {
      const res = await axios.post<CommonResponse<PaymentMethod>>(url, data)
      console.log('✅ Payment method created:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to create payment method:', error)
      throw error
    }
  }

  /**
   * Update payment method status (toggle Active/Inactive)
   */
  async updatePaymentMethodStatus(
    id: string,
    status: 'Active' | 'Inactive'
  ): Promise<PaymentMethod> {
    const url = `${BASE_URL}payment-methods/${id}/status`
    console.log('🔗 PUT update payment method status:', url)
    console.log('📦 Status:', status)

    try {
      const res = await axios.put<CommonResponse<PaymentMethod>>(url, { status })
      console.log('✅ Payment method status updated:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to update payment method status:', error)
      throw error
    }
  }

  /**
   * Delete payment method (Superadmin only)
   */
  async deletePaymentMethod(id: string): Promise<void> {
    const url = `${BASE_URL}payment-methods/${id}`
    console.log('🔗 DELETE payment method:', url)

    try {
      await axios.delete(url)
      console.log('✅ Payment method deleted')
    } catch (error) {
      console.error('❌ Failed to delete payment method:', error)
      throw error
    }
  }
}

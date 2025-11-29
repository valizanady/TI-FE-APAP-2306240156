// src/stores/topup.ts
import { defineStore } from 'pinia'
import { TopUpService } from '@/services/topup.service'
import type { TopUpTransaction, CreateTopUpRequest, PaymentMethod } from '@/interfaces/topup.interface'

const topupService = new TopUpService()

interface TopUpState {
  transactions: TopUpTransaction[]
  paymentMethods: PaymentMethod[]
  isLoading: boolean
  error: string | null
}

export const useTopUpStore = defineStore('topup', {
  state: (): TopUpState => ({
    transactions: [],
    paymentMethods: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    getTransactions: (state) => state.transactions,
    getAllPaymentMethods: (state) => state.paymentMethods,
    getPaymentMethods: (state) => state.paymentMethods.filter((pm) => pm.status === 'Active'),
    getPendingTransactions: (state) =>
      state.transactions.filter((t) => t.status === 'Pending'),
    getSuccessTransactions: (state) =>
      state.transactions.filter((t) => t.status === 'Success'),
  },

  actions: {
    /**
     * Fetch all transactions
     */
    async fetchTransactions() {
      this.isLoading = true
      this.error = null

      try {
        this.transactions = await topupService.getAllTransactions()
        console.log('✅ Transactions loaded:', this.transactions.length)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to load transactions'
        }
        console.error('❌ Error loading transactions:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch all payment methods
     */
    async fetchPaymentMethods() {
      this.isLoading = true
      this.error = null

      try {
        this.paymentMethods = await topupService.getAllPaymentMethods()
        console.log('✅ Payment methods loaded:', this.paymentMethods.length)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to load payment methods'
        }
        console.error('❌ Error loading payment methods:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create new top-up transaction
     */
    async createTransaction(data: CreateTopUpRequest): Promise<TopUpTransaction> {
      this.isLoading = true
      this.error = null

      try {
        const newTransaction = await topupService.createTransaction(data)
        console.log('✅ Transaction created:', newTransaction)

        // Refresh transactions list
        await this.fetchTransactions()

        return newTransaction
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to create transaction'
        }
        console.error('❌ Error creating transaction:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update transaction status (Admin only)
     */
    async updateTransactionStatus(id: string, status: 'Success' | 'Failed') {
      this.isLoading = true
      this.error = null

      try {
        await topupService.updateTransactionStatus(id, { status })
        console.log('✅ Transaction status updated')

        // Refresh transactions list
        await this.fetchTransactions()
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to update transaction status'
        }
        console.error('❌ Error updating transaction status:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete transaction (Admin only)
     */
    async deleteTransaction(id: string) {
      this.isLoading = true
      this.error = null

      try {
        await topupService.deleteTransaction(id)
        console.log('✅ Transaction deleted')

        // Refresh transactions list
        await this.fetchTransactions()
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to delete transaction'
        }
        console.error('❌ Error deleting transaction:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create new payment method (Superadmin only)
     */
    async createPaymentMethod(data: { methodName: string; provider: string }): Promise<PaymentMethod> {
      this.isLoading = true
      this.error = null

      try {
        const newMethod = await topupService.createPaymentMethod(data)
        console.log('✅ Payment method created:', newMethod)

        // Refresh payment methods list
        await this.fetchPaymentMethods()

        return newMethod
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to create payment method'
        }
        console.error('❌ Error creating payment method:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update payment method status (toggle Active/Inactive)
     */
    async updatePaymentMethodStatus(id: string, status: 'Active' | 'Inactive') {
      this.isLoading = true
      this.error = null

      try {
        await topupService.updatePaymentMethodStatus(id, status)
        console.log('✅ Payment method status updated')

        // Refresh payment methods list
        await this.fetchPaymentMethods()
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to update payment method status'
        }
        console.error('❌ Error updating payment method status:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete payment method (Superadmin only)
     */
    async deletePaymentMethod(id: string) {
      this.isLoading = true
      this.error = null

      try {
        await topupService.deletePaymentMethod(id)
        console.log('✅ Payment method deleted')

        // Refresh payment methods list
        await this.fetchPaymentMethods()
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to delete payment method'
        }
        console.error('❌ Error deleting payment method:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})

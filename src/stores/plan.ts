/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/plan.ts

import { defineStore } from 'pinia'
import { PlanService } from '@/services/plan.service'
import type { CreatePlanRequest, PlanDetail, UpdatePlanRequest } from '@/interfaces/plan.interface'

const planService = new PlanService()

export const usePlanStore = defineStore('plan', {
  state: () => ({
    currentPlan: null as PlanDetail | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async createPlan(packageId: string, data: CreatePlanRequest) {
      this.loading = true
      this.error = null
      try {
        const result = await planService.create(packageId, data)
        console.log('✅ Plan created in store:', result)
        return result
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to create plan'
        console.error('❌ Store error:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async getPlanDetail(id: string) {
      this.loading = true
      this.error = null
      try {
        this.currentPlan = await planService.getById(id)
        console.log('✅ Plan detail loaded in store:', this.currentPlan)
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to fetch plan detail'
        console.error('❌ Store error:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async getPlanForEdit(id: string) {
      this.loading = true
      this.error = null
      try {
        this.currentPlan = await planService.getForEdit(id)
        console.log('✅ Plan edit data loaded in store:', this.currentPlan)
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to fetch plan for edit'
        console.error('❌ Store error:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updatePlan(id: string, data: UpdatePlanRequest) {
      this.loading = true
      this.error = null
      try {
        const result = await planService.update(id, data)
        console.log('✅ Plan updated in store:', result)
        // Update current plan after successful update
        this.currentPlan = result as any
        return result
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to update plan'
        console.error('❌ Store error:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

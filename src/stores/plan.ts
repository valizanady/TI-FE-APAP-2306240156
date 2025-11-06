/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Plan, CreatePlanRequest, UpdatePlanRequest } from '@/interfaces/plan.interface'
import { toLocalDateTimeString } from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/assets/utils/dateTimeHelper.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const usePlanStore = defineStore('plan', {
  state: () => ({
    plans: [] as Plan[],
    currentPlan: null as Plan | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createPlan(packageId: string, data: CreatePlanRequest) {
      this.loading = true
      this.error = null

      try {
        // Convert dates to local datetime strings (remove timezone)
        const requestData = {
          ...data,
          startDate: toLocalDateTimeString(data.startDate),
          endDate: toLocalDateTimeString(data.endDate),
        }

        console.log('📤 Sending request:', requestData)

        const res = await axios.post(`${BASE_URL}package/${packageId}/plans/create`, requestData)

        console.log('✅ Plan created:', res.data)
        return res.data.data
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
        console.error('❌ Failed to create plan:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updatePlan(planId: string, data: UpdatePlanRequest) {
      this.loading = true
      this.error = null

      try {
        // Convert dates to local datetime strings (remove timezone)
        const requestData = {
          ...data,
          startDate: toLocalDateTimeString(data.startDate),
          endDate: toLocalDateTimeString(data.endDate),
        }

        console.log('📤 Sending update request:', requestData)

        const res = await axios.put(`${BASE_URL}plans/${planId}/edit`, requestData)

        console.log('✅ Plan updated:', res.data)
        return res.data.data
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
        console.error('❌ Failed to update plan:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async getPlanDetail(planId: string) {
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(`${BASE_URL}plans/${planId}`)
        this.currentPlan = res.data.data
        return res.data.data
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async getPlanForEdit(planId: string) {
      this.loading = true
      this.error = null

      try {
        const res = await axios.get(`${BASE_URL}plans/${planId}`)
        const plan = res.data.data

        // Check if plan is deleted
        if (plan.isDeleted) {
          throw new Error('This plan has been deleted and cannot be edited')
        }

        this.currentPlan = plan
        return plan
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
        throw e
      } finally {
        this.loading = false
      }
    },

    async deletePlan(planId: string) {
      this.loading = true
      this.error = null

      try {
        console.log('🗑️ Soft deleting plan:', planId)
        const res = await axios.delete(`${BASE_URL}plans/${planId}`)
        console.log('✅ Plan soft deleted:', res.data)
        return res.data.data
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
        console.error('❌ Failed to delete plan:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    },
  },
})

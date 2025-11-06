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

        // Debug: Log activity capacities
        console.log('📊 Plan Detail Retrieved:', {
          planId: res.data.data.id,
          packageStatus: res.data.data.packageStatus,
          activitiesCount: res.data.data.orderedQuantities?.length,
        })

        if (res.data.data.orderedQuantities?.length > 0) {
          console.log('📋 Activity Capacities:')
          res.data.data.orderedQuantities.forEach((activity: any, index: number) => {
            console.log(`  ${index + 1}. ${activity.activityName}:`, {
              activityId: activity.activityId,
              quota: activity.quota,
              orderedQuota: activity.orderedQuota,
              remaining: activity.quota - activity.orderedQuota,
            })
          })
        }

        return res.data.data
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
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

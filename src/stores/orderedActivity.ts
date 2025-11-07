/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/orderedActivity.store.ts

import { defineStore } from 'pinia'
import { OrderedActivityService } from '@/services/orderedActivity.service'
import type {
  Activity,
  CreateOrderedActivityRequest
} from '@/interfaces/activity.interface'

const service = new OrderedActivityService()

export const useOrderedActivityStore = defineStore('orderedActivity', {
  state: () => ({
    eligibleActivities: [] as Activity[],
    selectedActivity: null as Activity | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchEligibleActivities(planId: string) {
      this.loading = true
      this.error = null

      try {
        const activities = await service.getEligibleActivities(planId)
        console.log('🔍 Raw activities from service:', activities)
        console.log('🔍 Type of activities:', typeof activities)
        console.log('🔍 Is array?', Array.isArray(activities))
        this.eligibleActivities = Array.isArray(activities) ? activities : []
        console.log('✅ Fetched eligible activities:', this.eligibleActivities.length)
      } catch (e: any) {
        this.eligibleActivities = []
        this.error = e.response?.data?.message || e.message || 'Failed to fetch activities'
        console.error('❌ Store error:', this.error)
      } finally {
        this.loading = false
      }
    },

    async addActivityToPlan(planId: string, data: CreateOrderedActivityRequest) {
      this.loading = true
      this.error = null

      try {
        const result = await service.addActivityToPlan(planId, data)
        console.log('✅ Activity added successfully')
        return result
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to add activity'
        console.error('❌ Failed to add activity:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateOrderedActivity(orderedActivityId: string, quantity: number) {
      this.loading = true
      this.error = null

      try {
        const result = await service.updateOrderedActivity(orderedActivityId, quantity)
        console.log('✅ Activity updated successfully')
        return result
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to update activity'
        console.error('❌ Failed to update activity:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteOrderedActivity(orderedActivityId: string) {
      this.loading = true
      this.error = null

      try {
        await service.deleteOrderedActivity(orderedActivityId)
        console.log('✅ Activity deleted successfully')
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to delete activity'
        console.error('❌ Failed to delete activity:', this.error)
        throw e
      } finally {
        this.loading = false
      }
    },

    setSelectedActivity(activity: Activity | null) {
      this.selectedActivity = activity
    },

    clearError() {
      this.error = null
    }
  }
})

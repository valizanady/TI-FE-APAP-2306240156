/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/orderedActivity.service.ts

import axios from 'axios'
import type {
  Activity,
  OrderedActivity,
  CreateOrderedActivityRequest,
} from '@/interfaces/activity.interface'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class OrderedActivityService {
  /**
   * Get eligible activities for a plan
   */
  async getEligibleActivities(planId: string): Promise<Activity[]> {
    const url = `${BASE_URL}ordered-activities/eligible?planId=${planId}`
    console.log('🔗 Fetching eligible activities:', url)

    try {
      const res = await axios.get(url)
      console.log('✅ Eligible activities retrieved:', res.data)
      return res.data.activities || []
    } catch (error: any) {
      console.error('❌ Failed to fetch activities:', error)
      throw error
    }
  }

  /**
   * Add activity to plan
   */
  async addActivityToPlan(
    planId: string,
    data: CreateOrderedActivityRequest,
  ): Promise<OrderedActivity> {
    const url = `${BASE_URL}ordered-activities/create?planId=${planId}`
    console.log('🔗 Request URL:', url)
    console.log('📦 Request Data:', JSON.stringify(data, null, 2))

    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('✅ Response:', res.data)
      return res.data.data
    } catch (error: any) {
      console.error('❌ Request failed:', {
        url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
      throw error
    }
  }

  /**
   * Update ordered activity quantity
   */
  async updateOrderedActivity(
    orderedActivityId: string,
    quantity: number,
  ): Promise<OrderedActivity> {
    const url = `${BASE_URL}ordered-activities/${orderedActivityId}?quantity=${quantity}`
    console.log('🔗 Updating ordered activity:', url)

    try {
      const res = await axios.put(url)
      console.log('✅ Ordered activity updated:', res.data)
      return res.data.data
    } catch (error: any) {
      console.error('❌ Failed to update:', error)
      throw error
    }
  }

  /**
   * Delete ordered activity
   */
  async deleteOrderedActivity(orderedActivityId: string): Promise<void> {
    const url = `${BASE_URL}ordered-activities/${orderedActivityId}`
    console.log('🔗 Deleting ordered activity:', url)

    try {
      await axios.delete(url)
      console.log('✅ Ordered activity deleted')
    } catch (error: any) {
      console.error('❌ Failed to delete:', error)
      throw error
    }
  }
}

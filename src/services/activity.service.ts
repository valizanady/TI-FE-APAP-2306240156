// src/services/activity.service.ts
import axios from 'axios'
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityFilters,
} from '@/interfaces/activity.interface'
import type { CommonResponse } from '@/interfaces/common.response.interface'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * Activity Service
 * Handles all API calls related to activities
 */
export class ActivityService {
  /**
   * Get all activities with optional filters
   * @param filters Optional filters for activities
   * @returns List of activities
   */
  async getAllActivities(filters?: ActivityFilters): Promise<Activity[]> {
    const url = `${BASE_URL}activities`
    console.log('🔗 GET all activities:', url, filters)

    try {
      const params = new URLSearchParams()

      // Add filters if provided
      if (filters) {
        if (filters.isDeleted !== undefined) {
          params.append('isDeleted', String(filters.isDeleted))
        }
        if (filters.activityType) {
          params.append('activityType', filters.activityType)
        }
        if (filters.startLocation) {
          params.append('startLocation', filters.startLocation)
        }
        if (filters.endLocation) {
          params.append('endLocation', filters.endLocation)
        }
        if (filters.startDate) {
          params.append('startDate', filters.startDate)
        }
        if (filters.endDate) {
          params.append('endDate', filters.endDate)
        }
        if (filters.search) {
          params.append('search', filters.search)
        }
      }

      const res = await axios.get<CommonResponse<Activity[]>>(url, { params })
      console.log('✅ Activities retrieved:', res.data.data.length)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to fetch activities:', error)
      throw error
    }
  }

  /**
   * Get activity by ID
   * Only returns activities with isDeleted = false
   * @param id Activity ID
   * @returns Activity detail
   */
  async getActivityById(id: string): Promise<Activity> {
    const url = `${BASE_URL}activities/${id}`
    console.log('🔗 GET activity by ID:', url)

    try {
      const res = await axios.get<CommonResponse<Activity>>(url)
      console.log('✅ Activity retrieved:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to fetch activity:', error)
      throw error
    }
  }

  /**
   * Create new activity
   * @param data Create activity request
   * @returns Created activity
   */
  async createActivity(data: CreateActivityRequest): Promise<Activity> {
    const url = `${BASE_URL}activities`
    console.log('🔗 POST create activity:', url)
    console.log('📦 Data:', data)

    try {
      const res = await axios.post<CommonResponse<Activity>>(url, data)
      console.log('✅ Activity created:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to create activity:', error)
      throw error
    }
  }

  /**
   * Update activity
   * Note: activityType cannot be changed
   * @param id Activity ID
   * @param data Update activity request
   * @returns Updated activity
   */
  async updateActivity(id: string, data: UpdateActivityRequest): Promise<Activity> {
    const url = `${BASE_URL}activities/${id}`
    console.log('🔗 PUT update activity:', url)
    console.log('📦 Data:', data)

    try {
      const res = await axios.put<CommonResponse<Activity>>(url, data)
      console.log('✅ Activity updated:', res.data.data)
      return res.data.data
    } catch (error) {
      console.error('❌ Failed to update activity:', error)
      throw error
    }
  }

  /**
   * Delete activity (soft delete)
   * Sets isDeleted = true
   * @param id Activity ID
   */
  async deleteActivity(id: string): Promise<void> {
    const url = `${BASE_URL}activities/${id}`
    console.log('🔗 DELETE activity:', url)

    try {
      await axios.delete(url)
      console.log('✅ Activity deleted (soft delete)')
    } catch (error) {
      console.error('❌ Failed to delete activity:', error)
      throw error
    }
  }
}

// src/stores/activity.ts
import { defineStore } from 'pinia'
import { ActivityService } from '@/services/activity.service'
import type {
  Activity,
  CreateActivityRequest,
  UpdateActivityRequest,
  ActivityFilters,
} from '@/interfaces/activity.interface'

const activityService = new ActivityService()

interface ActivityState {
  activities: Activity[]
  currentActivity: Activity | null
  isLoading: boolean
  error: string | null
}

export const useActivityStore = defineStore('activity', {
  state: (): ActivityState => ({
    activities: [],
    currentActivity: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    /**
     * Get all activities
     */
    getActivities: (state) => state.activities,

    /**
     * Get current activity
     */
    getCurrentActivity: (state) => state.currentActivity,

    /**
     * Get active activities (isDeleted = false)
     */
    getActiveActivities: (state) => state.activities.filter((a) => !a.isDeleted),

    /**
     * Get activities by type
     */
    getActivitiesByType: (state) => (type: string) =>
      state.activities.filter((a) => a.activityType === type && !a.isDeleted),

    /**
     * Get unique activity types
     */
    getActivityTypes: (state) => {
      const types = new Set(state.activities.map((a) => a.activityType))
      return Array.from(types)
    },

    /**
     * Get unique locations (both start and end)
     */
    getLocations: (state) => {
      const locations = new Set<string>()
      state.activities.forEach((a) => {
        if (a.startLocation) locations.add(a.startLocation)
        if (a.endLocation) locations.add(a.endLocation)
      })
      return Array.from(locations).sort()
    },
  },

  actions: {
    /**
     * Fetch all activities with optional filters
     */
    async fetchActivities(filters?: ActivityFilters) {
      this.isLoading = true
      this.error = null

      try {
        this.activities = await activityService.getAllActivities(filters)
        console.log('✅ Activities loaded:', this.activities.length)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to load activities'
        }
        console.error('❌ Error loading activities:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch activity by ID
     */
    async fetchActivityById(id: string) {
      this.isLoading = true
      this.error = null

      try {
        this.currentActivity = await activityService.getActivityById(id)
        console.log('✅ Activity loaded:', this.currentActivity)
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to load activity'
        }
        console.error('❌ Error loading activity:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Create new activity
     */
    async createActivity(data: CreateActivityRequest): Promise<Activity> {
      this.isLoading = true
      this.error = null

      try {
        const newActivity = await activityService.createActivity(data)
        console.log('✅ Activity created:', newActivity)

        // Refresh activities list
        await this.fetchActivities({ isDeleted: false })

        return newActivity
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to create activity'
        }
        console.error('❌ Error creating activity:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Update activity
     */
    async updateActivity(id: string, data: UpdateActivityRequest): Promise<Activity> {
      this.isLoading = true
      this.error = null

      try {
        const updatedActivity = await activityService.updateActivity(id, data)
        console.log('✅ Activity updated:', updatedActivity)

        // Refresh activities list
        await this.fetchActivities({ isDeleted: false })

        // Update current activity if it's the one being updated
        if (this.currentActivity?.id === id) {
          this.currentActivity = updatedActivity
        }

        return updatedActivity
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to update activity'
        }
        console.error('❌ Error updating activity:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Delete activity (soft delete)
     */
    async deleteActivity(id: string) {
      this.isLoading = true
      this.error = null

      try {
        await activityService.deleteActivity(id)
        console.log('✅ Activity deleted')

        // Refresh activities list
        await this.fetchActivities({ isDeleted: false })

        // Clear current activity if it's the one being deleted
        if (this.currentActivity?.id === id) {
          this.currentActivity = null
        }
      } catch (error) {
        if (error instanceof Error) {
          this.error = error.message
        } else {
          this.error = 'Failed to delete activity'
        }
        console.error('❌ Error deleting activity:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Clear current activity
     */
    clearCurrentActivity() {
      this.currentActivity = null
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null
    },
  },
})

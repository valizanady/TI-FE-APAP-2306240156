import { defineStore } from 'pinia'
import { StatisticsService } from '@/services/statistics.service'
import type { StatisticsResponse } from '@/interfaces/statistics.interface'

const service = new StatisticsService()

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    currentStatistics: null as StatisticsResponse | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    /**
     * Fetch statistics using general endpoint
     * @param year - Required year parameter
     * @param month - Optional month parameter (1-12)
     */
    async fetchStatistics(year: number, month?: number | null) {
      this.loading = true
      this.error = null

      try {
        this.currentStatistics = await service.getPotentialRevenue(year, month)
        console.log('✅ Statistics fetched:', this.currentStatistics)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to fetch statistics'
        console.error('❌ Store error:', this.error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch yearly revenue statistics (revenue per month)
     * @param year - Year to fetch statistics for
     */
    async fetchYearlyRevenue(year: number) {
      this.loading = true
      this.error = null

      try {
        this.currentStatistics = await service.getYearlyRevenue(year)
        console.log('✅ Yearly statistics fetched:', this.currentStatistics)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to fetch yearly statistics'
        console.error('❌ Store error:', this.error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch monthly revenue detail with breakdown per activityType
     * @param year - Year to fetch statistics for
     * @param month - Month to fetch statistics for (1-12)
     */
    async fetchMonthlyRevenue(year: number, month: number) {
      this.loading = true
      this.error = null

      try {
        this.currentStatistics = await service.getMonthlyRevenue(year, month)
        console.log('✅ Monthly statistics fetched:', this.currentStatistics)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message || 'Failed to fetch monthly statistics'
        console.error('❌ Store error:', this.error)
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})

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

    clearError() {
      this.error = null
    }
  }
})

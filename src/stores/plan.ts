/* eslint-disable @typescript-eslint/no-explicit-any */


import { defineStore } from 'pinia'
import { PlanService } from '@/services/plan.service'
import { LocationService } from '@/services/location.service'
import type {
  CreatePlanRequest,
  Province,
  Regency,
  PlanDetail
} from '@/interfaces/plan.interface'

const planService = new PlanService()
const locationService = new LocationService()

export const usePlanStore = defineStore('plan', {
  state: () => ({
    provinces: [] as Province[],
    startRegencies: [] as Regency[],
    endRegencies: [] as Regency[],
    currentPlan: null as PlanDetail | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchProvinces() {
      this.loading = true
      try {
        this.provinces = await locationService.getProvinces()
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async fetchStartRegencies(provinceCode: string) {
      try {
        this.startRegencies = await locationService.getRegencies(provinceCode)
      } catch (e: any) {
        this.error = e.message
      }
    },

    async fetchEndRegencies(provinceCode: string) {
      try {
        this.endRegencies = await locationService.getRegencies(provinceCode)
      } catch (e: any) {
        this.error = e.message
      }
    },

    async createPlan(packageId: string, data: CreatePlanRequest) {
      this.loading = true
      try {
        await planService.create(packageId, data)
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
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
      } catch (e: any) {
        this.error = e.response?.data?.message || e.message
        throw e
      } finally {
        this.loading = false
      }
    },
  },
})

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/plan/plan.store.ts

import { defineStore } from 'pinia'
import { PlanService } from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/services/plan.service.ts'
import { LocationService } from '@/services/location.service'
import type { CreatePlanRequest, Province, Regency } from '@/interfaces/plan.interface'

const planService = new PlanService()
const locationService = new LocationService()

export const usePlanStore = defineStore('plan', {
  state: () => ({
    provinces: [] as Province[],
    startRegencies: [] as Regency[],
    endRegencies: [] as Regency[],
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
  },
})

/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/plan.service.ts

import axios from 'axios'
import type { CreatePlanRequest, PlanDetail, UpdatePlanRequest } from '@/interfaces/plan.interface'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class PlanService {
  /**
   * Create new plan for package
   */
  async create(packageId: string, data: CreatePlanRequest) {
    const url = `${BASE_URL}packages/${packageId}/plans/create`
    console.log('🔗 Request URL:', url)
    console.log('📦 Request Data:', JSON.stringify(data, null, 2))

    try {
      const res = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('✅ Response:', res.data)
      return res.data.data
    } catch (error: any) {
      console.error('❌ Request failed:', {
        url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      })
      throw error
    }
  }

  /**
   * Get plan detail by ID
   */
  async getById(id: string): Promise<PlanDetail> {
    const url = `${BASE_URL}plans/${id}`
    console.log('🔗 Fetching plan detail:', url)

    try {
      const res = await axios.get(url)
      console.log('✅ Plan detail retrieved:', res.data)
      return res.data.data
    } catch (error: any) {
      console.error('❌ Failed to fetch plan:', {
        url,
        status: error.response?.status,
        message: error.message
      })
      throw error
    }
  }

  /**
   * Get plan for editing
   */
  async getForEdit(id: string): Promise<PlanDetail> {
    const url = `${BASE_URL}plans/${id}/edit`
    console.log('🔗 Fetching plan for edit:', url)

    try {
      const res = await axios.get(url)
      console.log('✅ Plan edit data retrieved:', res.data)
      console.log('📦 Package Status:', res.data.data?.packageStatus)
      return res.data.data
    } catch (error: any) {
      console.error('❌ Failed to fetch plan for edit:', {
        url,
        status: error.response?.status,
        message: error.message
      })
      throw error
    }
  }

  /**
   * Update plan
   */
  async update(id: string, data: UpdatePlanRequest): Promise<PlanDetail> {
    const url = `${BASE_URL}plans/${id}/edit`
    console.log('🔗 Updating plan:', url)
    console.log('📦 Update data:', JSON.stringify(data, null, 2))

    try {
      const res = await axios.put(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('✅ Plan updated:', res.data)
      return res.data.data
    } catch (error: any) {
      console.error('❌ Failed to update plan:', {
        url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      })
      throw error
    }
  }
}

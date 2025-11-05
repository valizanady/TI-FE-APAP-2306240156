// src/services/plan.service.ts

import axios from 'axios'
import type { CreatePlanRequest } from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/interfaces/plan.interface.ts'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class PlanService {
  async create(packageId: string, data: CreatePlanRequest) {
    // Sesuai requirement: POST /packages/{id}/plans/create
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
}

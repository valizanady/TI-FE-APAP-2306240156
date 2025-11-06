// src/services/statistics.service.ts

import axios from 'axios'
import type { StatisticsResponse } from '@/interfaces/statistics.interface'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class StatisticsService {
  async getPotentialRevenue(year: number, month?: number | null): Promise<StatisticsResponse> {
    let url = `${BASE_URL}statistics?year=${year}`

    if (month !== null && month !== undefined) {
      url += `&month=${month}`
    }

    console.log('🔗 Fetching statistics:', url)

    const res = await axios.get(url)
    console.log('✅ Statistics retrieved:', res.data)

    return res.data.data
  }
}

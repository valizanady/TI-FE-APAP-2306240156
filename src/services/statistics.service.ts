// src/services/statistics.service.ts

import axios from 'axios'
import type { StatisticsResponse } from '@/interfaces/statistics.interface'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class StatisticsService {
  /**
   * GET /api/statistics/revenue?year={year}&month={month}
   * General endpoint - year required, month optional
   */
  async getPotentialRevenue(year: number, month?: number | null): Promise<StatisticsResponse> {
    let url = `${BASE_URL}statistics/revenue?year=${year}`

    if (month !== null && month !== undefined) {
      url += `&month=${month}`
    }

    console.log('🔗 Fetching statistics:', url)

    const res = await axios.get(url)
    console.log('✅ Statistics retrieved:', res.data)

    return res.data.data
  }

  /**
   * GET /api/statistics/revenue/yearly/{year}
   * Get yearly revenue statistics (revenue per month in a year)
   */
  async getYearlyRevenue(year: number): Promise<StatisticsResponse> {
    const url = `${BASE_URL}statistics/revenue/yearly/${year}`

    console.log('🔗 Fetching yearly statistics:', url)

    const res = await axios.get(url)
    console.log('✅ Yearly statistics retrieved:', res.data)

    return res.data.data
  }

  /**
   * GET /api/statistics/revenue/monthly/{year}/{month}
   * Get monthly revenue detail with breakdown per activityType
   */
  async getMonthlyRevenue(year: number, month: number): Promise<StatisticsResponse> {
    const url = `${BASE_URL}statistics/revenue/monthly/${year}/${month}`

    console.log('🔗 Fetching monthly statistics:', url)

    const res = await axios.get(url)
    console.log('✅ Monthly statistics retrieved:', res.data)

    return res.data.data
  }
}

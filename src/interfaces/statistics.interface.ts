export interface StatisticsRequest {
  year: number
  month?: number | null // null = all months
}

export interface StatisticsResponse {
  year: number
  month?: number | null
  revenueByActivityType: Record<string, number>
  totalRevenue: number
}

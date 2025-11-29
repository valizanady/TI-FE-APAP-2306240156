export interface StatisticsRequest {
  year: number
  month?: number | null // null = all months
}

export interface StatisticsResponse {
  period: string // "YYYY" for yearly, "YYYY-MM" for monthly
  totalRevenue: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  breakdown: Record<string, any> // Can be numbers (monthly) or nested objects (yearly)
}

// For Monthly Statistics (breakdown per activityType)
export interface MonthlyBreakdown {
  [activityType: string]: number // Flight: 10000, Accommodation: 20000, etc.
}

// For Yearly Statistics (breakdown per month)
export interface YearlyBreakdown {
  [month: string]: MonthRevenue // January: {...}, February: {...}, etc.
}

export interface MonthRevenue {
  Flight?: number
  Accommodation?: number
  'Vehicle Rental'?: number
  totalRevenue: number
}

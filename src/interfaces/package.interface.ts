export interface Plan {
  id: string
  planName: string
  activityType: string
  price: number
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
  status: string
}

export interface Package {
  id: string
  userId: string
  packageName: string
  quota: number
  price: number
  status: string
  startDate: string
  endDate: string
  isDeleted?: boolean
  plans: Plan[] // ✅ tambahkan ini
}

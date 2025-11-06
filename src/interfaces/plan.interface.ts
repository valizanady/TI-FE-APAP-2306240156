// src/interfaces/plan.interface.ts

export interface Plan {
  id?: string
  planName: string
  activityType: string
  status: string
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
  price: number
  packageId: string
  isDeleted?: boolean
}

export interface CreatePlanRequest {
  planName: string
  activityType: string
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
}

export interface UpdatePlanRequest {
  planName: string
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
}

export interface Province {
  code: string
  name: string
}

export interface Regency {
  code: string
  name: string
  province_code: string
}

export interface OrderedQuantity {
  id: string
  activityName: string
  activityId: string
  startDate: string
  endDate: string
  price: number
  quota: number
  orderedQuota: number
  total: number
}

export interface PlanDetail {
  id: string
  planName: string
  activityType: string
  status: string
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
  price: number
  packageId: string
  packageName: string
  packageStatus: string // Remove optional, make it required
  orderedQuantities: OrderedQuantity[]
  isDeleted?: boolean
}

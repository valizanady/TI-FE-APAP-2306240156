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
  price: number
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
  remaining?: number // Add remaining field
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
  price: number // Total calculated price (from ordered activities)
  planPrice?: number // Original plan price (for edit form)
  packageId: string
  packageName: string
  packageStatus: string // Remove optional, make it required
  packageUserId?: string // Add userId from package (optional for backward compatibility)
  orderedQuantities: OrderedQuantity[]
}

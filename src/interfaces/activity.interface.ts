// src/interfaces/activity.interface.ts

export interface Activity {
  id: string
  activityName: string
  activityItem: string
  capacity: number
  price: number
  activityType: string
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
}

export interface OrderedActivity {
  id: string
  activityId: string
  activityName: string
  quota: number
  orderedQuota: number
  price: number
  total: number
  startDate: string
  endDate: string
  planId: string
  planName: string
}

export interface CreateOrderedActivityRequest {
  activityId: string
  orderedQuantity: number
}

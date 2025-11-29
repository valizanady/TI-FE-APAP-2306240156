// src/interfaces/activity.interface.ts

/**
 * Activity Interface
 * Represents an activity that can be added to tour packages
 */
export interface Activity {
  id: string
  vendorId: string
  activityName: string
  activityItem: string
  activityType: 'Flight' | 'Accommodation' | 'Vehicle Rental' | 'Tour Activity'
  capacity: number
  price: number
  startDate: string
  endDate: string
  startLocation: string
  endLocation: string
  isDeleted: boolean
  orderedQuantities?: OrderedActivity[]
}

/**
 * Request DTO for creating a new Activity
 */
export interface CreateActivityRequest {
  activityName: string
  activityItem: string
  activityType: 'Flight' | 'Accommodation' | 'Vehicle Rental' | 'Tour Activity'
  capacity: number
  price: number
  startDate: string // ISO DateTime string
  endDate: string // ISO DateTime string
  startLocation: string
  endLocation: string
}

/**
 * Request DTO for updating an Activity
 * Note: activityType cannot be changed after creation
 */
export interface UpdateActivityRequest {
  activityName: string
  activityItem: string
  capacity: number
  price: number
  startDate: string // ISO DateTime string
  endDate: string // ISO DateTime string
  startLocation: string
  endLocation: string
}

/**
 * Activity filters for search and filter
 */
export interface ActivityFilters {
  isDeleted?: boolean
  activityType?: string
  startLocation?: string
  endLocation?: string
  startDate?: string
  endDate?: string
  search?: string
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
  isDeleted?: boolean
  plan?: {
    tourPackage?: {
      status: string
    }
  }
}

export interface CreateOrderedActivityRequest {
  activityId: string
  orderedQuantity: number
}

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

  // ✅ NEW: Creator role from backend (for authorization)
  creatorRole?: string  // 'Customer' | 'Superadmin' | 'TourPackageVendor'

  packageName: string
  quota: number
  price: number
  status: string
  startDate: string
  endDate: string
  isDeleted?: boolean
  plans: Plan[] // ✅ tambahkan ini

  // ✅ Authorization metadata from backend
  canViewPlans?: boolean   // Can current user see plan details?
  canProcess?: boolean     // Can current user process this package?
  accessMessage?: string   // Message about access restrictions
}

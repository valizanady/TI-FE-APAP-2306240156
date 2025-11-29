import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PackageView from '@/views/PackageView.vue'
import PackageDetailView from '@/views/PackageDetailView.vue'
import CreatePackageView from '@/views/CreatePackageView.vue'
import EditPackageView from '@/views/EditPackageView.vue'
import CreatePlanView from '@/views/CreatePlanView.vue'
import ViewPlanView from '@/views/ViewPlanView.vue'
import StatisticsView from '@/views/StatisticsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/package',
      name: 'package',
      component: PackageView,
    },
    // ⚠️ IMPORTANT: Static routes MUST come BEFORE dynamic routes
    {
      path: '/package/create',
      name: 'package-create',
      component: CreatePackageView,
    },
    {
      path: '/package/:id',
      name: 'PackageDetail',
      component: PackageDetailView,
    },
    {
      path: '/package/:id/edit',
      name: 'EditPackage',
      component: EditPackageView,
    },
    {
      path: '/package/:id/plans/create',
      name: 'create-plan',
      component: CreatePlanView,
    },

    {
      path: '/plans/:id',
      name: 'view-plan',
      component: ViewPlanView,
    },

    {
      path: '/plans/:id/edit',
      name: 'EditPlan',
      component: () => import('@/views/EditPlanView.vue'),
    },

    // Activity Management routes
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/ActivityListView.vue'),
    },
    {
      path: '/activities/create',
      name: 'create-activity',
      component: () => import('../views/CreateActivityView.vue'),
    },
    {
      path: '/activities/:id',
      name: 'activity-detail',
      component: () => import('../views/ActivityDetailView.vue'),
    },
    {
      path: '/activities/:id/edit',
      name: 'edit-activity',
      component: () => import('../views/EditActivityView.vue'),
    },

    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsView,
      meta: {
        title: 'Statistics - Tour Package Management',
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/AboutView.vue'), // temporary placeholder
    },

    // ========================================
    // Auth Routes
    // ========================================
    {
      path: '/login-success',
      name: 'login-success',
      component: () => import('@/views/LoginSuccessView.vue'),
      meta: {
        title: 'Login Success',
      },
    },
    {
      // Handle SSO redirect with /auth suffix (Nabeel's SSO adds this)
      path: '/login-success/auth',
      name: 'login-success-auth',
      component: () => import('@/views/LoginSuccessView.vue'),
      meta: {
        title: 'Login Success',
      },
    },

    // ========================================
    // Top-Up Routes
    // ========================================
    {
      path: '/topup',
      name: 'topup',
      component: () => import('@/views/TopUpView.vue'),
      meta: {
        title: 'Top-Up Transactions',
        requiresAuth: true,
      },
    },
    {
      path: '/topup/create',
      name: 'topup-create',
      component: () => import('@/views/CreateTopUpView.vue'),
      meta: {
        title: 'Create Top-Up',
        requiresAuth: true,
        requiresRole: 'Customer',
      },
    },

    // ========================================
    // Payment Method Routes (Superadmin only)
    // ========================================
    {
      path: '/payment-methods',
      name: 'payment-methods',
      component: () => import('@/views/PaymentMethodView.vue'),
      meta: {
        title: 'Payment Methods',
        requiresAuth: true,
        requiresRole: 'SUPERADMIN',
      },
    },
    {
      path: '/payment-methods/create',
      name: 'payment-methods-create',
      component: () => import('@/views/CreatePaymentMethodView.vue'),
      meta: {
        title: 'Add Payment Method',
        requiresAuth: true,
        requiresRole: 'SUPERADMIN',
      },
    },
  ],
})

export default router

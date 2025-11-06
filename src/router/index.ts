import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PackageView from '@/views/PackageView.vue'
import PackageDetailView from '@/views/PackageDetailView.vue'
import CreatePackageView from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/views/CreatePackageView.vue'
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

    {
      path: '/package/:id',
      name: 'PackageDetail',
      component: PackageDetailView,
    },
    {
      path: '/package/create',
      name: 'package-create',
      component: CreatePackageView,
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
      component: ViewPlanView
    },

    {
      path: '/plans/:id/edit',
      name: 'EditPlan',
      component: () => import('@/views/EditPlanView.vue')
    },

    // Placeholder routes (will be implemented later)
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/AboutView.vue'), // temporary placeholder
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

  ],
})

export default router

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PackageView from '@/views/PackageView.vue'
import PackageDetailView from '@/views/PackageDetailView.vue'
import CreatePackageView from '/Users/valizanadya/Documents/SMT 5/APAP/tugas individu/tour-package-2306240156-fe/src/views/CreatePackageView.vue'
import EditPackageView from '@/views/EditPackageView.vue'

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

    // Placeholder routes (will be implemented later)
    {
      path: '/activities',
      name: 'activities',
      component: () => import('../views/AboutView.vue'), // temporary placeholder
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/AboutView.vue'), // temporary placeholder
    },
  ],
})

export default router

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

const isLoggedIn = computed(() => authStore.isLoggedIn)
const username = computed(() => authStore.getUsername)
const userRole = computed(() => authStore.getUserRole)

// ✅ Role access checks
const canAccessPackages = computed(() => {
  const role = userRole.value
  return role === 'Superadmin' || role === 'Customer' || role === 'TourPackageVendor'
})

const canAccessStatistics = computed(() => {
  const role = userRole.value
  return role === 'Superadmin' || role === 'TourPackageVendor'
})

const handleLogin = () => {
  authStore.loginRedirect()
}

const handleLogout = async () => {
  if (confirm('Are you sure you want to logout?')) {
    await authStore.logout()
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Left side: brand -->
      <RouterLink to="/" class="brand">Tour Package Management</RouterLink>

      <!-- Right side: menu -->
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link" :class="{ active: route.name === 'home' }">
          Home
        </RouterLink>

        <!-- Activities: All logged in users -->
        <RouterLink
          v-if="isLoggedIn"
          to="/activities"
          class="nav-link"
          :class="{ active: route.name === 'activities' }"
        >
          Activities
        </RouterLink>

        <!-- Packages: Only Superadmin, Customer, TourPackageVendor -->
        <RouterLink
          v-if="isLoggedIn && canAccessPackages"
          to="/package"
          class="nav-link"
          :class="{ active: route.name === 'package' }"
        >
          Packages
        </RouterLink>

        <!-- Statistics: Only Superadmin & TourPackageVendor -->
        <RouterLink
          v-if="isLoggedIn && canAccessStatistics"
          to="/statistics"
          class="nav-link"
          :class="{ active: route.name === 'statistics' }"
        >
          Statistics
        </RouterLink>

        <!-- Top-Up Menu (only for logged in users) -->
        <RouterLink v-if="isLoggedIn" to="/topup" class="nav-link" :class="{ active: route.name === 'topup' }">
          💳 Top-Up
        </RouterLink>

        <!-- Payment Methods Menu (only for Superadmin) -->
        <RouterLink
          v-if="isLoggedIn && userRole === 'Superadmin'"
          to="/payment-methods"
          class="nav-link"
          :class="{ active: route.name === 'payment-methods' }"
        >
          💰 Payment Methods
        </RouterLink>

        <!-- Auth Section -->
        <div v-if="!isLoggedIn" class="auth-section">
          <button @click="handleLogin" class="btn-login">
            🔐 Login
          </button>
        </div>
        <div v-else class="auth-section">
          <span class="user-info">
            👤 {{ username }}
            <span v-if="userRole" class="user-role">{{ userRole }}</span>
          </span>
          <button @click="handleLogout" class="btn-logout">
            Logout
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 75px;
  padding: 0 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Brand name */
.brand {
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  color: #6d28d9;
  font-family: 'Inter', sans-serif;
}

/* Navigation links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  color: #374151;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  transition: all 0.25s ease;
}

.nav-link:hover {
  background-color: #f3e8ff;
  color: #6d28d9;
}

/* Active tab */
.nav-link.active {
  background-color: #6d28d9;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(109, 40, 217, 0.3);
}

/* Auth Section */
.auth-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid #e5e7eb;
}

.user-info {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-role {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background-color: #dbeafe;
  color: #1e40af;
  border-radius: 9999px;
  font-weight: 600;
}

.btn-login {
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(109, 40, 217, 0.3);
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.4);
}

.btn-logout {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-logout:hover {
  background-color: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    height: auto;
    padding: 1rem 1.5rem;
  }

  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.5rem;
  }
}
</style>

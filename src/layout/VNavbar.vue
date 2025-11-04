<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Left side: brand -->
      <RouterLink to="/" class="brand">Tour Package Management</RouterLink>

      <!-- Right side: menu -->
      <nav class="nav-links">
        <RouterLink
          to="/"
          class="nav-link"
          :class="{ active: route.name === 'home' }"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/activities"
          class="nav-link"
          :class="{ active: route.name === 'activities' }"
        >
          Activities
        </RouterLink>
        <RouterLink
          to="/package"
          class="nav-link"
          :class="{ active: route.name === 'package' }"
        >
          Packages
        </RouterLink>
        <RouterLink
          to="/reports"
          class="nav-link"
          :class="{ active: route.name === 'reports' }"
        >
          Statistics
        </RouterLink>
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

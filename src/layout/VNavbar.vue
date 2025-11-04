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
          to="/packages"
          class="nav-link"
          :class="{ active: route.name === 'packages' }"
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
  transition: all 0.3s ease;
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
  color: #c026d3; /* 🎨 fuchsia tua */
  font-family: 'Inter', sans-serif;
  transition: color 0.25s ease;
}

.brand:hover {
  color: #a21caf; /* sedikit lebih gelap pas hover */
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
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.25s ease;
  position: relative;
}

/* Hover fuchsia glow */
.nav-link:hover {
  color: #c026d3;
  background-color: rgba(240, 171, 252, 0.15);
  box-shadow: 0 2px 10px rgba(192, 38, 211, 0.25);
  transform: translateY(-1px);
}

/* Active tab (pressed / current route) */
.nav-link.active {
  background-color: #c026d3;
  color: #ffffff;
  box-shadow: 0 3px 10px rgba(192, 38, 211, 0.4);
  transform: translateY(-1px);
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

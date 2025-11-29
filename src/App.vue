<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import VNavbar from './layout/VNavbar.vue'
import { Toaster } from 'vue-sonner'

const authStore = useAuthStore()

// Initialize auth state on app mount
onMounted(() => {
  authStore.initialize()
  console.log('✅ Auth store initialized')
})
</script>

<template>
  <VNavbar />
  <RouterView />
  <Toaster position="top-right" richColors />
</template>

<style>
#app {
  display: flex;
  flex-direction: column; /* 🔥 stack vertically, not side-by-side */
  width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}

.hero {
  width: 80%;
  max-width: 900px;
}

.cards {
  width: 80%;
  max-width: 1000px;
}
</style>

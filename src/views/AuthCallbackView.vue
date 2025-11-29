<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="text-6xl mb-4">⚠️</div>
      <h2 class="text-2xl font-semibold text-gray-800">Deprecated Route</h2>
      <p class="text-gray-500 mt-2">This authentication callback is deprecated.</p>
      <p class="text-gray-500">Please use the new login flow.</p>
      <button @click="goHome" class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
        Go to Home
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

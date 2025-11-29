<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="isLoading" class="space-y-4">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
        <h2 class="text-2xl font-semibold text-gray-800">Processing Login...</h2>
        <p class="text-gray-500">Exchanging token, please wait...</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="text-6xl">❌</div>
        <h2 class="text-2xl font-semibold text-red-600">Login Failed</h2>
        <p class="text-gray-600">{{ error }}</p>
        <button @click="goHome" class="btn-primary mt-4">
          Go to Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // Get OTT from URL query parameter
    const ott = route.query.ott as string

    console.log('🌐 Current URL:', window.location.href)
    console.log('📍 Current Path:', route.path)
    console.log('🔍 Query params:', route.query)
    console.log('🎫 OTT value:', ott)

    if (!ott) {
      throw new Error('No OTT found in URL. Please login again.')
    }

    console.log('🔄 Exchanging OTT for JWT token...')

    // Exchange OTT for JWT token
    const success = await authStore.exchangeToken(ott)

    if (success) {
      console.log('✅ Login successful! Token saved to localStorage')
      console.log('👤 User info:', authStore.user)
      console.log('🎫 Token:', authStore.token?.substring(0, 20) + '...')

      toast.success('Login Berhasil!')

      // Redirect to home
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      throw new Error('Failed to exchange token')
    }
  } catch (err) {
    console.error('❌ Login failed:', err)
    error.value = err instanceof Error ? err.message : 'Authentication failed'
    toast.error('Gagal Login SSO')
    isLoading.value = false
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(109, 40, 217, 0.4);
}
</style>

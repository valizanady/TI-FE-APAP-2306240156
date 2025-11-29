import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import './assets/main.css'
import App from './App.vue'
import router from './router'  // <--- ini penting
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// ========================================
// Axios Interceptor - Attach JWT Token
// ========================================

// Request Interceptor: Add JWT token to every request
axios.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔑 Token attached to request:', config.url)
    }

    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor: Handle 401 Unauthorized
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // If 401 Unauthorized, clear token and redirect to login
      if (error.response?.status === 401) {
        console.warn('⚠️  401 Unauthorized - clearing token')
        const authStore = useAuthStore()
        authStore.logout()
      }
    }
    return Promise.reject(error)
  }
)

app.mount('#app')

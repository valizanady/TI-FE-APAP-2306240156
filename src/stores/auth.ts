// src/stores/auth.ts
import axios from 'axios'
import { defineStore } from 'pinia'
import { toast } from 'vue-sonner'

const AUTH_URL_API = import.meta.env.VITE_AUTH_BACKEND_URL || 'http://localhost:8080/api/auth'
const PROFILE_FE_LOGIN_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'https://acc-fe.beel.my.id'

interface User {
  id: number | string
  username: string
  role: string
  email: string
  name: string
  balance: number
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    getUserRole: (state) => state.user?.role || null,
    getUserId: (state) => state.user?.id || null,
    getUsername: (state) => state.user?.username || state.user?.name || null,
  },

  actions: {
    // Decode JWT
    parseJwt(token: string) {
      try {
        const parts = token.split('.')
        if (parts.length < 3) return null // JWT tidak valid

        const base64Url = parts[1]
        if (!base64Url) return null

        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        )

        return JSON.parse(jsonPayload)
      } catch {
        return null
      }
    },

    // Fungsi Init (Dipanggil saat refresh halaman)
    initialize() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        // Ambil data user dari token yang tersimpan
        const payload = this.parseJwt(token)
        if (payload) {
          this.user = {
            id: payload.userId || payload.id || payload.sub,
            username: payload.username || payload.sub,
            role: payload.role,
            email: payload.email,
            name: payload.name || payload.username || payload.sub, // Pakai nama kalau ada, kalau gak ada pakai username
            balance: payload.balance || 0,
          }
        }
      }
    },

    loginRedirect() {
      const callbackUrl = 'http://2306240156-fe.hafizmuh.site/login-success'

      const encodedCallback = encodeURIComponent(callbackUrl)

      console.log('Redirecting to:', `${PROFILE_FE_LOGIN_URL}/auth/login?redirect=${encodedCallback}`)
      window.location.href = `${PROFILE_FE_LOGIN_URL}/auth/login?redirect=${encodedCallback}`
    },

    // Exchange token
    async exchangeToken(ott: string) {
      this.loading = true
      this.error = null

      console.log('🔄 [AUTH] Starting token exchange...')
      console.log('🎫 [AUTH] OTT:', ott)
      console.log('🌐 [AUTH] Backend URL:', AUTH_URL_API)

      try {
        const payload = { ott: ott }
        console.log('📤 [AUTH] Sending request to:', `${AUTH_URL_API}/exchange`)
        console.log('📦 [AUTH] Request payload:', payload)

        const response = await axios.post(`${AUTH_URL_API}/exchange`, payload)

        console.log('📥 [AUTH] Response status:', response.status)
        console.log('📥 [AUTH] Response data:', response.data)

        const data = response.data.data

        // Backend kita return "jwt" bukan "token"
        if (data && data.jwt) {
          console.log('✅ [AUTH] JWT received from backend')

          // SIMPAN TOKEN
          this.token = data.jwt
          localStorage.setItem('token', data.jwt)
          console.log('💾 [AUTH] Token saved to localStorage')

          // Parse user info dari JWT
          const tokenPayload = this.parseJwt(data.jwt)
          console.log('🔍 [AUTH] Parsed JWT payload:', tokenPayload)

          if (tokenPayload) {
            this.user = {
              id: tokenPayload.userId || tokenPayload.id || tokenPayload.sub,
              username: tokenPayload.username || tokenPayload.sub,
              role: tokenPayload.role || 'Customer',
              email: tokenPayload.email || '',
              name: tokenPayload.name || tokenPayload.username || tokenPayload.sub,
              balance: tokenPayload.balance || 0,
            }
            console.log('👤 [AUTH] User info saved:', this.user)
          }

          toast.success('Login Berhasil!')
          return true
        } else {
          console.error('❌ [AUTH] No JWT in response data:', data)
          throw new Error('Token tidak ditemukan di response')
        }
      } catch (err) {
        console.error('❌ [AUTH] Exchange failed:', err)
        if (axios.isAxiosError(err)) {
          console.error('📛 [AUTH] Axios error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
          })
        }
        this.error = 'Gagal login'
        toast.error('Gagal Login SSO')
        return false
      } finally {
        this.loading = false
        console.log('🏁 [AUTH] Exchange process finished')
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      window.location.href = '/'
    },
  },
})

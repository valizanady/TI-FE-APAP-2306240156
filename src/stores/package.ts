// src/stores/package.ts
import { defineStore } from 'pinia'
import axios from 'axios'
import type { Package } from '@/interfaces/package.interface'
import type { CommonResponse } from '@/interfaces/common.response.interface'

const API = import.meta.env.VITE_API_BASE_URL

export const usePackageStore = defineStore('package', {
  state: () => ({
    items: [] as Package[],
    isLoading: false,
    error: ''
  }),

  actions: {
    async fetchAll() {
      this.isLoading = true
      this.error = ''
      console.log('🌍 API BASE:', API)

      try {
        const res = await axios.get<CommonResponse<Package[]>>(`${API}package`)
        console.log('🧩 Raw API response:', res.data)

        // FIX: ambil data dari "res.data.data"
        this.items = Array.isArray(res.data.data) ? res.data.data : []
        console.log('✅ stored items:', this.items)
     } catch (e) {
        if (e instanceof Error) {
          this.error = e.message
        } else {
          this.error = 'Failed to fetch packages'
        }
        console.error('🚨 Fetch error:', e)
      } finally {
        this.isLoading = false
        console.log('🎯 Final items count:', this.items.length)
      }
      console.log('🧭 All env:', import.meta.env)
    }
  }
})

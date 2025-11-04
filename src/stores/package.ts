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
    error: '',
  }),

  actions: {
    // ✅ Fetch all packages
    async fetchAll() {
      this.isLoading = true
      this.error = ''
      console.log('🌍 API BASE:', API)

      try {
        const res = await axios.get<CommonResponse<Package[]>>(`${API}package`)
        console.log('🧩 Raw API response:', res.data)

        // ambil data dari res.data.data dan filter yang tidak deleted
        const allPackages = Array.isArray(res.data.data) ? res.data.data : []

        // Filter out soft deleted packages (status !== 'DELETED')
        this.items = allPackages.filter((pkg) => pkg.status !== 'DELETED' && !pkg.isDeleted)

        console.log('✅ stored items (after filtering deleted):', this.items)
        console.log(
          `📊 Total: ${allPackages.length}, Active: ${this.items.length}, Deleted: ${allPackages.length - this.items.length}`,
        )
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
    },

    // ✅ Delete package (soft delete)
    async deletePackage(id: string) {
      this.isLoading = true
      this.error = ''

      try {
        console.log('🗑️  Soft deleting package:', id)

        // Soft delete endpoint
        await axios.delete(`${API}package/${id}/delete`)

        console.log('✅ Package soft deleted successfully')

        // Refresh the list
        await this.fetchAll()

        return true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error('❌ Delete error:', e)
        this.error = e.response?.data?.message || 'Failed to delete package'
        throw new Error(this.error)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Update package
    async update(
      id: string,
      data: {
        packageName: string
        startDate: string
        endDate: string
        quota: number
      },
    ) {
      this.isLoading = true
      this.error = ''

      try {
        console.log('� Updating package:', id, data)

        const response = await axios.put(`${API}package/${id}/edit`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        console.log('✅ Package updated successfully:', response.data)

        // Refresh the list
        await this.fetchAll()

        return response.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error('❌ Update error:', e)
        console.error('❌ Error response:', e.response?.data)
        this.error = e.response?.data?.message || 'Failed to update package'
        throw new Error(this.error)
      } finally {
        this.isLoading = false
      }
    },

    // ✅ Create new package
    async create(payload: {
      packageName: string
      userId: string
      quota: number
      startDate: string
      endDate: string
    }) {
      this.isLoading = true
      this.error = ''

      try {
        console.log('🚀 Creating package:', payload)
        const res = await axios.post<CommonResponse<Package>>(`${API}package/create`, payload)

        console.log('✅ Package created:', res.data)
        await this.fetchAll()
        return res.data.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error('❌ Create error:', e)
        this.error = e.response?.data?.message ?? e.message ?? 'Failed to create package'
        throw e
      } finally {
        this.isLoading = false
      }
    },
  },
})

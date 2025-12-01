import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePackageStore } from '../package'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

interface Package {
  id: string
  packageName: string
  startDate: string
  endDate: string
  quota: number
  status: string
  userId: string
  isDeleted?: boolean
  createdAt: string
  updatedAt: string
}

describe('Package Store - Enhanced Coverage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const mockPackage: Package = {
    id: '1',
    packageName: 'Bali Tour',
    startDate: '2024-01-01',
    endDate: '2024-01-10',
    quota: 10,
    status: 'PENDING',
    userId: 'user123',
    isDeleted: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  }

  describe('fetchAll - All Branches', () => {
    it('should filter packages with status DELETED', async () => {
      const store = usePackageStore()
      const mockPackages = [
        { ...mockPackage, id: '1', status: 'PENDING' },
        { ...mockPackage, id: '2', status: 'DELETED' },
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: mockPackages,
        },
      })

      await store.fetchAll()

      expect(store.items).toHaveLength(1)
      expect(store.items[0].status).not.toBe('DELETED')
    })

    it('should filter packages with isDeleted true', async () => {
      const store = usePackageStore()
      const mockPackages = [
        { ...mockPackage, id: '1', isDeleted: false },
        { ...mockPackage, id: '2', isDeleted: true },
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: mockPackages,
        },
      })

      await store.fetchAll()

      expect(store.items).toHaveLength(1)
      expect(store.items[0].isDeleted).toBe(false)
    })

    it('should handle non-array response data', async () => {
      const store = usePackageStore()

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: null,
        },
      })

      await store.fetchAll()

      expect(store.items).toEqual([])
    })

    it('should handle error without Error instance', async () => {
      const store = usePackageStore()

      mockedAxios.get.mockRejectedValueOnce('String error')

      await store.fetchAll()

      expect(store.error).toBe('Failed to fetch packages')
      expect(store.items).toEqual([])
    })
  })

  describe('deletePackage - Error Handling', () => {
    it('should handle error without response', async () => {
      const store = usePackageStore()
      const packageId = '1'

      mockedAxios.delete.mockRejectedValueOnce(new Error('Network error'))

      await expect(store.deletePackage(packageId)).rejects.toThrow('Failed to delete package')
      expect(store.error).toBe('Failed to delete package')
    })

    it('should refresh list after successful delete', async () => {
      const store = usePackageStore()
      const packageId = '1'

      mockedAxios.delete.mockResolvedValueOnce({})
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{ ...mockPackage, id: '2' }],
        },
      })

      const result = await store.deletePackage(packageId)

      expect(result).toBe(true)
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(store.items).toHaveLength(1)
    })
  })

  describe('update - Error Handling', () => {
    it('should handle error without response data', async () => {
      const store = usePackageStore()
      const packageId = '1'
      const updateData = {
        packageName: 'Updated Tour',
        startDate: '2024-02-01',
        endDate: '2024-02-10',
        quota: 15,
      }

      mockedAxios.put.mockRejectedValueOnce(new Error('Network error'))

      await expect(store.update(packageId, updateData)).rejects.toThrow('Failed to update package')
      expect(store.error).toBe('Failed to update package')
    })
  })

  describe('create - Error Handling', () => {
    it('should handle error with response message', async () => {
      const store = usePackageStore()
      const newPackageData = {
        packageName: 'Invalid Tour',
        quota: -1,
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      }

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { message: 'Invalid quota value' },
        },
      })

      await expect(store.create(newPackageData)).rejects.toThrow()
      expect(store.error).toContain('Invalid quota value')
    })

    it('should handle error without response but with message', async () => {
      const store = usePackageStore()
      const newPackageData = {
        packageName: 'Test',
        quota: 10,
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      }

      mockedAxios.post.mockRejectedValueOnce({
        message: 'Connection refused',
      })

      await expect(store.create(newPackageData)).rejects.toThrow()
      expect(store.error).toBe('Connection refused')
    })

    it('should handle error without response or message', async () => {
      const store = usePackageStore()
      const newPackageData = {
        packageName: 'Test',
        quota: 10,
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      }

      mockedAxios.post.mockRejectedValueOnce({})

      await expect(store.create(newPackageData)).rejects.toThrow()
      expect(store.error).toBe('Failed to create package')
    })
  })

  describe('processPackage - Error Handling', () => {
    it('should handle error without response data', async () => {
      const store = usePackageStore()
      const packageId = '1'

      mockedAxios.put.mockRejectedValueOnce(new Error('Network error'))

      await expect(store.processPackage(packageId)).rejects.toThrow('Failed to process package')
      expect(store.error).toBe('Failed to process package')
    })

    it('should refresh list after successful process', async () => {
      const store = usePackageStore()
      const packageId = '1'

      mockedAxios.put.mockResolvedValueOnce({
        data: {
          data: { ...mockPackage, status: 'PROCESSED' },
        },
      })
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{ ...mockPackage, status: 'PROCESSED' }],
        },
      })

      await store.processPackage(packageId)

      expect(mockedAxios.get).toHaveBeenCalled()
      expect(store.items[0].status).toBe('PROCESSED')
    })
  })

  describe('State Management - Loading States', () => {
    it('should set isLoading during fetchAll', async () => {
      const store = usePackageStore()
      let loadingDuringFetch = false

      mockedAxios.get.mockImplementation(() => {
        loadingDuringFetch = store.isLoading
        return Promise.resolve({ data: { data: [] } })
      })

      await store.fetchAll()

      expect(loadingDuringFetch).toBe(true)
      expect(store.isLoading).toBe(false)
    })

    it('should set isLoading during delete', async () => {
      const store = usePackageStore()
      let loadingDuringDelete = false

      mockedAxios.delete.mockImplementation(() => {
        loadingDuringDelete = store.isLoading
        return Promise.resolve({})
      })
      mockedAxios.get.mockResolvedValue({ data: { data: [] } })

      await store.deletePackage('1')

      expect(loadingDuringDelete).toBe(true)
      expect(store.isLoading).toBe(false)
    })

    it('should set isLoading during update', async () => {
      const store = usePackageStore()
      let loadingDuringUpdate = false

      mockedAxios.put.mockImplementation(() => {
        loadingDuringUpdate = store.isLoading
        return Promise.resolve({ data: {} })
      })
      mockedAxios.get.mockResolvedValue({ data: { data: [] } })

      await store.update('1', {
        packageName: 'Test',
        startDate: '2024-01-01',
        endDate: '2024-01-10',
        quota: 10,
      })

      expect(loadingDuringUpdate).toBe(true)
      expect(store.isLoading).toBe(false)
    })

    it('should set isLoading during create', async () => {
      const store = usePackageStore()
      let loadingDuringCreate = false

      mockedAxios.post.mockImplementation(() => {
        loadingDuringCreate = store.isLoading
        return Promise.resolve({ data: { data: mockPackage } })
      })
      mockedAxios.get.mockResolvedValue({ data: { data: [] } })

      await store.create({
        packageName: 'Test',
        quota: 10,
        startDate: '2024-01-01',
        endDate: '2024-01-10',
      })

      expect(loadingDuringCreate).toBe(true)
      expect(store.isLoading).toBe(false)
    })

    it('should set isLoading during processPackage', async () => {
      const store = usePackageStore()
      let loadingDuringProcess = false

      mockedAxios.put.mockImplementation(() => {
        loadingDuringProcess = store.isLoading
        return Promise.resolve({ data: {} })
      })
      mockedAxios.get.mockResolvedValue({ data: { data: [] } })

      await store.processPackage('1')

      expect(loadingDuringProcess).toBe(true)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('Error State Management', () => {
    it('should clear error on successful fetchAll', async () => {
      const store = usePackageStore()
      store.error = 'Previous error'

      mockedAxios.get.mockResolvedValueOnce({ data: { data: [] } })

      await store.fetchAll()

      expect(store.error).toBe('')
    })

    it('should clear error on successful delete', async () => {
      const store = usePackageStore()
      store.error = 'Previous error'

      mockedAxios.delete.mockResolvedValueOnce({})
      mockedAxios.get.mockResolvedValueOnce({ data: { data: [] } })

      await store.deletePackage('1')

      expect(store.error).toBe('')
    })
  })
})

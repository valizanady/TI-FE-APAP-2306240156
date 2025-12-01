import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePackageStore } from '../package'
import axios from 'axios'

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

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

describe('Package Store', () => {
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

  describe('fetchAll', () => {
    it('should fetch all packages and filter deleted ones', async () => {
      const store = usePackageStore()
      const mockPackages = [
        { ...mockPackage, id: '1', status: 'PENDING' },
        { ...mockPackage, id: '2', status: 'PROCESSED' },
        { ...mockPackage, id: '3', status: 'DELETED' }, // Should be filtered
        { ...mockPackage, id: '4', isDeleted: true }, // Should be filtered
      ]

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: mockPackages,
          status: 'success',
        },
      })

      await store.fetchAll()

      expect(store.items).toHaveLength(2)
      expect(store.items.find((p: Package) => p.id === '3')).toBeUndefined()
      expect(store.items.find((p: Package) => p.id === '4')).toBeUndefined()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('')
    })

    it('should handle fetch error', async () => {
      const store = usePackageStore()
      const errorMessage = 'Network error'

      mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage))

      await store.fetchAll()

      expect(store.error).toBe(errorMessage)
      expect(store.items).toEqual([])
      expect(store.isLoading).toBe(false)
    })

    it('should handle empty response', async () => {
      const store = usePackageStore()

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [],
          status: 'success',
        },
      })

      await store.fetchAll()

      expect(store.items).toEqual([])
      expect(store.error).toBe('')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('deletePackage', () => {
    it('should soft delete a package and refresh list', async () => {
      const store = usePackageStore()
      const packageId = '1'

      mockedAxios.delete.mockResolvedValueOnce({
        data: { status: 'success' },
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{ ...mockPackage, id: '2' }],
          status: 'success',
        },
      })

      const result = await store.deletePackage(packageId)

      expect(result).toBe(true)
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining(`/package/${packageId}/delete`)
      )
      expect(mockedAxios.get).toHaveBeenCalled()
      expect(store.isLoading).toBe(false)
    })

    it('should handle delete error', async () => {
      const store = usePackageStore()
      const packageId = '1'
      const errorMessage = 'Package not found'

      mockedAxios.delete.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      })

      await expect(store.deletePackage(packageId)).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('update', () => {
    it('should update a package successfully', async () => {
      const store = usePackageStore()
      const packageId = '1'
      const updateData = {
        packageName: 'Updated Tour',
        startDate: '2024-02-01',
        endDate: '2024-02-10',
        quota: 15,
      }

      mockedAxios.put.mockResolvedValueOnce({
        data: {
          data: { ...mockPackage, ...updateData },
          status: 'success',
        },
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{ ...mockPackage, ...updateData }],
          status: 'success',
        },
      })

      const result = await store.update(packageId, updateData)

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/package/${packageId}/edit`),
        updateData,
        expect.any(Object)
      )
      expect(result).toBeDefined()
      expect(store.isLoading).toBe(false)
    })

    it('should handle update error', async () => {
      const store = usePackageStore()
      const packageId = '1'
      const updateData = {
        packageName: 'Updated Tour',
        startDate: '2024-02-01',
        endDate: '2024-02-10',
        quota: 15,
      }
      const errorMessage = 'Validation failed'

      mockedAxios.put.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      })

      await expect(store.update(packageId, updateData)).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('create', () => {
    it('should create a new package successfully', async () => {
      const store = usePackageStore()
      const newPackageData = {
        packageName: 'New Tour',
        quota: 20,
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      }

      mockedAxios.post.mockResolvedValueOnce({
        data: {
          data: { ...mockPackage, ...newPackageData, id: '5' },
          status: 'success',
        },
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{ ...mockPackage, ...newPackageData, id: '5' }],
          status: 'success',
        },
      })

      const result = await store.create(newPackageData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/package/create'),
        newPackageData
      )
      expect(result).toBeDefined()
      expect(result?.packageName).toBe(newPackageData.packageName)
      expect(store.isLoading).toBe(false)
    })

    it('should handle create error', async () => {
      const store = usePackageStore()
      const newPackageData = {
        packageName: 'Invalid Tour',
        quota: -1,
        startDate: '2024-03-01',
        endDate: '2024-03-10',
      }
      const errorMessage = 'Invalid quota'

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
        message: errorMessage,
      })

      await expect(store.create(newPackageData)).rejects.toThrow()
      expect(store.error).toContain(errorMessage)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('processPackage', () => {
    it('should process a package successfully', async () => {
      const store = usePackageStore()
      const packageId = '1'

      mockedAxios.put.mockResolvedValueOnce({
        data: {
          data: { ...mockPackage, status: 'PROCESSED' },
          status: 'success',
        },
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{ ...mockPackage, status: 'PROCESSED' }],
          status: 'success',
        },
      })

      const result = await store.processPackage(packageId)

      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining(`/package/${packageId}/process`)
      )
      expect(result).toBeDefined()
      expect(store.isLoading).toBe(false)
    })

    it('should handle process error', async () => {
      const store = usePackageStore()
      const packageId = '1'
      const errorMessage = 'Cannot process package'

      mockedAxios.put.mockRejectedValueOnce({
        response: {
          data: { message: errorMessage },
        },
      })

      await expect(store.processPackage(packageId)).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
      expect(store.isLoading).toBe(false)
    })
  })

  describe('state management', () => {
    it('should have correct initial state', () => {
      const store = usePackageStore()

      expect(store.items).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('')
    })

    it('should set loading state during async operations', async () => {
      const store = usePackageStore()

      mockedAxios.get.mockImplementation(
        () =>
          new Promise((resolve) => {
            expect(store.isLoading).toBe(true)
            setTimeout(
              () =>
                resolve({
                  data: { data: [], status: 'success' },
                }),
              10
            )
          })
      )

      await store.fetchAll()

      expect(store.isLoading).toBe(false)
    })
  })
})

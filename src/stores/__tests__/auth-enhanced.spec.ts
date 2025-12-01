import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios, true)

// Mock vue-sonner
vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

describe('Auth Store - Enhanced Coverage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('parseJwt - Edge Cases', () => {
    it('should parse valid JWT token with all fields', () => {
      const store = useAuthStore()
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJiYWxhbmNlIjoxMDAwfQ.xyz'

      const result = store.parseJwt(token)

      expect(result).toEqual({
        userId: 1,
        username: 'test',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
      })
    })

    it('should return null for JWT with less than 3 parts', () => {
      const store = useAuthStore()
      const invalidToken = 'invalid.token'

      const result = store.parseJwt(invalidToken)

      expect(result).toBeNull()
    })

    it('should return null for JWT with empty payload', () => {
      const store = useAuthStore()
      const invalidToken = 'header..signature'

      const result = store.parseJwt(invalidToken)

      expect(result).toBeNull()
    })

    it('should return null for JWT with invalid base64', () => {
      const store = useAuthStore()
      const invalidToken = 'header.invalid!!!base64.signature'

      const result = store.parseJwt(invalidToken)

      expect(result).toBeNull()
    })

    it('should handle JWT with special characters in payload', () => {
      const store = useAuthStore()
      // JWT with payload: {"sub": "user@test.com", "role": "Admin"}
      const token =
        'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQHRlc3QuY29tIiwicm9sZSI6IkFkbWluIn0.xyz'

      const result = store.parseJwt(token)

      expect(result).toBeDefined()
      expect(result?.sub).toBe('user@test.com')
    })
  })

  describe('initialize - Edge Cases', () => {
    it('should initialize with token from localStorage with all JWT fields', () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJiYWxhbmNlIjoxMDAwfQ.xyz'
      localStorageMock.setItem('token', token)

      const store = useAuthStore()
      store.initialize()

      expect(store.token).toBe(token)
      expect(store.user?.name).toBe('Test User')
    })

    it('should initialize with minimal JWT payload (only sub)', () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIn0.xyz'
      localStorageMock.setItem('token', token)

      const store = useAuthStore()
      store.initialize()

      expect(store.user?.username).toBe('user123')
      expect(store.user?.name).toBe('user123') // Fallback to username
    })

    it('should initialize with JWT using "id" instead of "userId"', () => {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6NDU2LCJ1c2VybmFtZSI6InRlc3QyIn0.xyz'
      localStorageMock.setItem('token', token)

      const store = useAuthStore()
      store.initialize()

      expect(store.user?.id).toBe(456)
    })

    it('should not initialize if JWT parse fails', () => {
      const invalidToken = 'invalid.token'
      localStorageMock.setItem('token', invalidToken)

      const store = useAuthStore()
      store.initialize()

      expect(store.token).toBe(invalidToken)
      expect(store.user).toBeNull() // parseJwt failed, no user set
    })

    it('should handle missing balance in JWT', () => {
      const token =
        'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciJ9.xyz'
      localStorageMock.setItem('token', token)

      const store = useAuthStore()
      store.initialize()

      expect(store.user?.balance).toBe(0) // Default to 0
    })
  })

  describe('exchangeToken - All Branches', () => {
    it('should successfully exchange OTT with full user data', async () => {
      const store = useAuthStore()
      const ott = 'test-ott-123'
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJiYWxhbmNlIjoxMDAwfQ.xyz'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            jwt: jwt,
          },
        },
      })

      const result = await store.exchangeToken(ott)

      expect(result).toBe(true)
      expect(store.user?.email).toBe('test@example.com')
      expect(store.user?.balance).toBe(1000)
    })

    it('should handle exchange with minimal JWT payload', async () => {
      const store = useAuthStore()
      const ott = 'test-ott'
      const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMTIzIiwicm9sZSI6IkN1c3RvbWVyIn0.xyz'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: { jwt },
        },
      })

      const result = await store.exchangeToken(ott)

      expect(result).toBe(true)
      expect(store.user?.username).toBe('user123')
      expect(store.user?.role).toBe('Customer')
    })

    it('should handle Axios error with response', async () => {
      const store = useAuthStore()
      const ott = 'invalid-ott'

      const axiosError = {
        isAxiosError: true,
        message: 'Invalid OTT',
        response: {
          status: 401,
          data: { message: 'Invalid OTT' },
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const result = await store.exchangeToken(ott)

      expect(result).toBe(false)
      expect(store.error).toBe('Gagal login')
    })

    it('should handle non-Axios error', async () => {
      const store = useAuthStore()
      const ott = 'test-ott'

      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))
      vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)

      const result = await store.exchangeToken(ott)

      expect(result).toBe(false)
      expect(store.error).toBe('Gagal login')
    })

    it('should handle response with no data object', async () => {
      const store = useAuthStore()
      const ott = 'test-ott'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {},
      })

      const result = await store.exchangeToken(ott)

      expect(result).toBe(false)
      expect(store.error).toBe('Gagal login')
    })

    it('should handle parseJwt failure after receiving JWT', async () => {
      const store = useAuthStore()
      const ott = 'test-ott'
      const invalidJwt = 'invalid.jwt.token'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: { jwt: invalidJwt },
        },
      })

      const result = await store.exchangeToken(ott)

      expect(result).toBe(true) // Still returns true because JWT was saved
      expect(store.user).toBeNull() // But user is null due to parse failure
    })
  })

  describe('getters - All Cases', () => {
    it('should return null for getUserRole when no user', () => {
      const store = useAuthStore()
      expect(store.getUserRole).toBeNull()
    })

    it('should return null for getUserId when no user', () => {
      const store = useAuthStore()
      expect(store.getUserId).toBeNull()
    })

    it('should return null for getUsername when no user', () => {
      const store = useAuthStore()
      expect(store.getUsername).toBeNull()
    })

    it('should prioritize username over name in getUsername', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        username: 'testuser',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test Name',
        balance: 0,
      }

      expect(store.getUsername).toBe('testuser')
    })

    it('should fallback to name if username is missing', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        username: '',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test Name',
        balance: 0,
      }

      // Since username is empty string (falsy), it should use name
      expect(store.getUsername).toBe('Test Name')
    })
  })

  describe('logout - All Scenarios', () => {
    it('should clear all data and redirect', () => {
      const store = useAuthStore()
      store.token = 'test-token'
      store.user = {
        id: 1,
        username: 'test',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
      }
      localStorageMock.setItem('token', 'test-token')

      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
        configurable: true,
      })

      store.logout()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(localStorageMock.getItem('token')).toBeNull()
    })
  })

  describe('State Consistency', () => {
    it('should maintain loading state false after successful operation', async () => {
      const store = useAuthStore()
      const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.xyz'

      mockedAxios.post.mockResolvedValueOnce({
        data: { data: { jwt } },
      })

      await store.exchangeToken('ott')

      expect(store.loading).toBe(false)
    })

    it('should maintain loading state false after failed operation', async () => {
      const store = useAuthStore()

      mockedAxios.post.mockRejectedValueOnce(new Error('Fail'))

      await store.exchangeToken('ott')

      expect(store.loading).toBe(false)
    })
  })
})

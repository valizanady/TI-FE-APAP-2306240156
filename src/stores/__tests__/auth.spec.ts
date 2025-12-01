import { describe, it, expect, beforeEach, vi } from 'vitest'
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
})

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('parseJwt', () => {
    it('should parse valid JWT token', () => {
      const store = useAuthStore()
      // JWT with payload: {"userId": 1, "username": "test", "role": "Customer"}
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciJ9.xyz'

      const result = store.parseJwt(token)

      expect(result).toEqual({
        userId: 1,
        username: 'test',
        role: 'Customer',
      })
    })

    it('should return null for invalid JWT token', () => {
      const store = useAuthStore()
      const invalidToken = 'invalid.token'

      const result = store.parseJwt(invalidToken)

      expect(result).toBeNull()
    })
  })

  describe('initialize', () => {
    it('should initialize with token from localStorage', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJiYWxhbmNlIjoxMDAwfQ.xyz'
      localStorageMock.setItem('token', token)

      const store = useAuthStore()
      store.initialize()

      expect(store.token).toBe(token)
      expect(store.user).toEqual({
        id: 1,
        username: 'test',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
      })
    })

    it('should not initialize if no token in localStorage', () => {
      const store = useAuthStore()
      store.initialize()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('loginRedirect', () => {
    it('should redirect to profile service login', () => {
      const store = useAuthStore()

      // Spy on window.location assignment
      const hrefSpy = vi.fn()
      Object.defineProperty(window, 'location', {
        value: { href: hrefSpy },
        writable: true,
      })

      store.loginRedirect()

      expect(hrefSpy).toBeDefined()
    })
  })

  describe('exchangeToken', () => {
    it('should successfully exchange OTT for JWT', async () => {
      const store = useAuthStore()
      const ott = 'test-ott-123'
      const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidGVzdCIsInJvbGUiOiJDdXN0b21lciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJiYWxhbmNlIjoxMDAwfQ.xyz'

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
      expect(store.token).toBe(jwt)
      expect(store.user?.username).toBe('test')
      expect(localStorageMock.getItem('token')).toBe(jwt)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/exchange'),
        { ott: ott }
      )
    })

    it('should handle exchange failure', async () => {
      const store = useAuthStore()
      const ott = 'invalid-ott'

      mockedAxios.post.mockRejectedValueOnce({
        isAxiosError: true,
        message: 'Invalid OTT',
        response: {
          status: 401,
          data: { message: 'Invalid OTT' },
        },
      })

      const result = await store.exchangeToken(ott)

      expect(result).toBe(false)
      expect(store.error).toBe('Gagal login')
      expect(store.token).toBeNull()
    })

    it('should handle missing JWT in response', async () => {
      const store = useAuthStore()
      const ott = 'test-ott'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {}, // No JWT
        },
      })

      const result = await store.exchangeToken(ott)

      expect(result).toBe(false)
      expect(store.error).toBe('Gagal login')
    })
  })

  describe('logout', () => {
    it('should clear token and user data', () => {
      const store = useAuthStore()
      const token = 'test-token'

      // Set up logged in state
      store.token = token
      store.user = {
        id: 1,
        username: 'test',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
      }
      localStorageMock.setItem('token', token)

      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
      })

      store.logout()

      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
      expect(localStorageMock.getItem('token')).toBeNull()
    })
  })

  describe('getters', () => {
    it('isLoggedIn should return true when token exists', () => {
      const store = useAuthStore()
      store.token = 'test-token'

      expect(store.isLoggedIn).toBe(true)
    })

    it('isLoggedIn should return false when no token', () => {
      const store = useAuthStore()

      expect(store.isLoggedIn).toBe(false)
    })

    it('getUserRole should return user role', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        username: 'test',
        role: 'Manager',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
      }

      expect(store.getUserRole).toBe('Manager')
    })

    it('getUserId should return user id', () => {
      const store = useAuthStore()
      store.user = {
        id: 123,
        username: 'test',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test User',
        balance: 1000,
      }

      expect(store.getUserId).toBe(123)
    })

    it('getUsername should return username', () => {
      const store = useAuthStore()
      store.user = {
        id: 1,
        username: 'testuser',
        role: 'Customer',
        email: 'test@example.com',
        name: 'Test Name',
        balance: 1000,
      }

      expect(store.getUsername).toBe('testuser')
    })
  })
})

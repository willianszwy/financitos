import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage with persistent data store
const store: Record<string, string> = {}

const localStorageMock = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key]
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach(key => delete store[key])
  }),
  length: 0,
  key: vi.fn()
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock console methods to reduce noise in tests
const consoleMock = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
}
vi.stubGlobal('console', consoleMock)

// Mock date functions for consistent testing
const mockDate = '2024-01-15T10:00:00.000Z'
vi.setSystemTime(new Date(mockDate))

// Clean up mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  Object.keys(store).forEach(key => delete store[key])
})
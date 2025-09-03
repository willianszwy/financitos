import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFinancialData } from '../useLocalStorage'
import { StorageService } from '@/services/storage'
import { MonthlyFinancialData } from '@/types'

// Mock the StorageService
vi.mock('@/services/storage', () => ({
  StorageService: {
    getMonthlyFinancialData: vi.fn(),
    saveMonthlyFinancialData: vi.fn()
  }
}))

// Mock other dependencies
vi.mock('@/utils/calculations', () => ({
  calculateFinancialSummary: vi.fn(() => ({
    totalIncome: 0,
    totalExpenses: 0,
    fixedExpenses: 0,
    uniqueExpenses: 0,
    totalInvestments: 0,
    savingsTotal: 0,
    cdiTotal: 0,
    netBalance: 0
  }))
}))

describe('useFinancialData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load existing data when month already exists', async () => {
    const existingData: MonthlyFinancialData = {
      month: '2024-04',
      income: [],
      expenses: [],
      investments: [],
      summary: {
        totalIncome: 0,
        totalExpenses: 0,
        fixedExpenses: 0,
        uniqueExpenses: 0,
        totalInvestments: 0,
        savingsTotal: 0,
        cdiTotal: 0,
        netBalance: 0
      }
    }

    vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(existingData)

    const { result } = renderHook(() => useFinancialData('2024-04'))

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual(existingData)
    expect(StorageService.saveMonthlyFinancialData).not.toHaveBeenCalled()
  })

  it('should create empty month data when month does not exist', async () => {
    vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(null)

    const { result } = renderHook(() => useFinancialData('2024-04'))

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should create empty data structure
    expect(result.current.data?.month).toBe('2024-04')
    expect(result.current.data?.expenses).toHaveLength(0)
    expect(result.current.data?.income).toHaveLength(0)
    expect(result.current.data?.investments).toHaveLength(0)
    expect(result.current.data?.summary).toEqual({
      totalIncome: 0,
      totalExpenses: 0,
      fixedExpenses: 0,
      uniqueExpenses: 0,
      totalInvestments: 0,
      savingsTotal: 0,
      cdiTotal: 0,
      netBalance: 0
    })

    // Should not auto-save empty data
    expect(StorageService.saveMonthlyFinancialData).not.toHaveBeenCalled()
  })

})
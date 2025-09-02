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
vi.mock('@/utils/dates', () => ({
  getPreviousMonthKey: vi.fn((monthKey: string) => {
    const [year, month] = monthKey.split('-')
    const prevMonth = parseInt(month) - 1
    if (prevMonth < 1) {
      return `${parseInt(year) - 1}-12`
    }
    return `${year}-${prevMonth.toString().padStart(2, '0')}`
  })
}))

vi.mock('@/utils/calculations', () => ({
  calculateFinancialSummary: vi.fn(() => ({
    totalIncome: 0,
    totalExpenses: 150,
    fixedExpenses: 150,
    uniqueExpenses: 0,
    totalInvestments: 0,
    savingsTotal: 0,
    cdiTotal: 0,
    netBalance: -150
  }))
}))

vi.mock('@/utils/helpers', () => ({
  generateId: vi.fn(() => 'generated-id-123')
}))

describe('useFinancialData - Auto-loading recurrent expenses', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load existing data without copying expenses when month already exists', async () => {
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
    expect(result.current.recurrentExpensesCopied).toBe(false)
    expect(StorageService.saveMonthlyFinancialData).not.toHaveBeenCalled()
  })

  it('should create new month data and copy recurrent expenses from previous month', async () => {
    const previousMonthData: MonthlyFinancialData = {
      month: '2024-03',
      income: [],
      expenses: [
        {
          id: 'expense-1',
          description: 'Rent',
          type: 'Recorrente',
          deadline: '05/03/2024',
          status: 'Pago',
          paymentMethod: 'PIX',
          amount: 800,
          createdAt: '2024-03-01T10:00:00Z',
          updatedAt: '2024-03-05T14:00:00Z'
        },
        {
          id: 'expense-2',
          description: 'Groceries',
          type: 'Única',
          deadline: '10/03/2024',
          status: 'Pago',
          paymentMethod: 'Crédito',
          amount: 150,
          createdAt: '2024-03-01T10:00:00Z',
          updatedAt: '2024-03-10T12:00:00Z'
        },
        {
          id: 'expense-3',
          description: 'Internet',
          type: 'Recorrente',
          deadline: '15/03/2024',
          status: 'Pago',
          paymentMethod: 'Débito',
          amount: 100,
          createdAt: '2024-03-01T10:00:00Z',
          updatedAt: '2024-03-15T16:00:00Z'
        }
      ],
      investments: [],
      summary: {
        totalIncome: 0,
        totalExpenses: 1050,
        fixedExpenses: 900,
        uniqueExpenses: 150,
        totalInvestments: 0,
        savingsTotal: 0,
        cdiTotal: 0,
        netBalance: -1050
      }
    }

    // Mock calls: first for new month (returns null), then for previous month
    vi.mocked(StorageService.getMonthlyFinancialData)
      .mockReturnValueOnce(null) // New month doesn't exist
      .mockReturnValueOnce(previousMonthData) // Previous month exists

    vi.mocked(StorageService.saveMonthlyFinancialData).mockReturnValue(true)

    const { result } = renderHook(() => useFinancialData('2024-04'))

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should have copied only recurrent expenses
    expect(result.current.data?.expenses).toHaveLength(2)
    expect(result.current.data?.expenses[0].description).toBe('Rent')
    expect(result.current.data?.expenses[0].type).toBe('Recorrente')
    expect(result.current.data?.expenses[0].status).toBe('Pendente')
    expect(result.current.data?.expenses[0].deadline).toBe('05/04/2024') // Date adjusted to April
    expect(result.current.data?.expenses[0].id).toBe('generated-id-123') // New ID

    expect(result.current.data?.expenses[1].description).toBe('Internet')
    expect(result.current.data?.expenses[1].type).toBe('Recorrente')
    expect(result.current.data?.expenses[1].status).toBe('Pendente')
    expect(result.current.data?.expenses[1].deadline).toBe('15/04/2024') // Date adjusted to April

    // Should indicate that expenses were copied
    expect(result.current.recurrentExpensesCopied).toBe(true)

    // Should have saved the new month data
    expect(StorageService.saveMonthlyFinancialData).toHaveBeenCalledWith(
      expect.objectContaining({
        month: '2024-04',
        expenses: expect.arrayContaining([
          expect.objectContaining({
            description: 'Rent',
            type: 'Recorrente',
            status: 'Pendente',
            deadline: '05/04/2024'
          })
        ])
      })
    )
  })

  it('should create empty month data when no previous month exists', async () => {
    vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(null)

    const { result } = renderHook(() => useFinancialData('2024-01'))

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.expenses).toHaveLength(0)
    expect(result.current.recurrentExpensesCopied).toBe(false)
    expect(StorageService.saveMonthlyFinancialData).not.toHaveBeenCalled()
  })

  it('should create empty month data when previous month has no recurrent expenses', async () => {
    const previousMonthData: MonthlyFinancialData = {
      month: '2024-03',
      income: [],
      expenses: [
        {
          id: 'expense-1',
          description: 'Groceries',
          type: 'Única',
          deadline: '10/03/2024',
          status: 'Pago',
          paymentMethod: 'Crédito',
          amount: 150,
          createdAt: '2024-03-01T10:00:00Z',
          updatedAt: '2024-03-10T12:00:00Z'
        }
      ],
      investments: [],
      summary: {
        totalIncome: 0,
        totalExpenses: 150,
        fixedExpenses: 0,
        uniqueExpenses: 150,
        totalInvestments: 0,
        savingsTotal: 0,
        cdiTotal: 0,
        netBalance: -150
      }
    }

    vi.mocked(StorageService.getMonthlyFinancialData)
      .mockReturnValueOnce(null) // New month doesn't exist
      .mockReturnValueOnce(previousMonthData) // Previous month exists but no recurrent expenses

    const { result } = renderHook(() => useFinancialData('2024-04'))

    // Wait for loading to complete
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data?.expenses).toHaveLength(0)
    expect(result.current.recurrentExpensesCopied).toBe(false)
    expect(StorageService.saveMonthlyFinancialData).not.toHaveBeenCalled()
  })
})
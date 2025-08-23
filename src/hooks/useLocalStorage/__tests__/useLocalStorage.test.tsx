import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFinancialData, useShoppingList, useAppSettings } from '../index'
import { StorageService } from '@/services/storage'
import { MonthlyFinancialData, ShoppingList, AppSettings } from '@/types'

// Mock StorageService
vi.mock('@/services/storage', () => ({
  StorageService: {
    getMonthlyFinancialData: vi.fn(),
    saveMonthlyFinancialData: vi.fn(),
    getShoppingList: vi.fn(),
    saveShoppingList: vi.fn(),
    getAppSettings: vi.fn(),
    saveAppSettings: vi.fn()
  }
}))

describe('useLocalStorage hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useFinancialData', () => {
    const mockFinancialData: MonthlyFinancialData = {
      month: '2024-01',
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
        cdiTotal: 0
      }
    }

    it('should load financial data on mount', async () => {
      vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(mockFinancialData)

      const { result } = renderHook(() => useFinancialData('2024-01'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 3000 })

      expect(result.current.data).toEqual(mockFinancialData)
      expect(result.current.error).toBeNull()
    })

    it('should create empty data when none exists', async () => {
      vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(null)

      const { result } = renderHook(() => useFinancialData('2024-01'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data?.month).toBe('2024-01')
      expect(result.current.data?.income).toEqual([])
      expect(result.current.data?.expenses).toEqual([])
      expect(result.current.data?.investments).toEqual([])
    })

    it('should save data successfully', async () => {
      vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(mockFinancialData)
      vi.mocked(StorageService.saveMonthlyFinancialData).mockReturnValue(true)

      const { result } = renderHook(() => useFinancialData('2024-01'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      act(() => {
        result.current.saveData(mockFinancialData)
      })

      expect(StorageService.saveMonthlyFinancialData).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockFinancialData,
          summary: expect.any(Object)
        })
      )
    })

    it('should handle save errors', async () => {
      vi.mocked(StorageService.getMonthlyFinancialData).mockReturnValue(mockFinancialData)
      vi.mocked(StorageService.saveMonthlyFinancialData).mockReturnValue(false)

      const { result } = renderHook(() => useFinancialData('2024-01'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.saveData(mockFinancialData)
        expect(success).toBe(false)
      })

      expect(result.current.error).toBeTruthy()
    })
  })

  describe('useShoppingList', () => {
    const mockShoppingList: ShoppingList = {
      items: [],
      lastUpdated: '2024-01-15T10:00:00.000Z'
    }

    it('should load shopping list on mount', async () => {
      vi.mocked(StorageService.getShoppingList).mockReturnValue(mockShoppingList)

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 3000 })

      expect(result.current.shoppingList).toEqual(mockShoppingList)
      expect(result.current.error).toBeNull()
    })

    it('should save shopping list successfully', async () => {
      vi.mocked(StorageService.getShoppingList).mockReturnValue(mockShoppingList)
      vi.mocked(StorageService.saveShoppingList).mockReturnValue(true)

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.saveShoppingList(mockShoppingList)
        expect(success).toBe(true)
      })

      expect(StorageService.saveShoppingList).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockShoppingList,
          lastUpdated: expect.any(String)
        })
      )
    })

    it('should update items', async () => {
      vi.mocked(StorageService.getShoppingList).mockReturnValue(mockShoppingList)
      vi.mocked(StorageService.saveShoppingList).mockReturnValue(true)

      const { result } = renderHook(() => useShoppingList())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const newItems = [
        {
          id: '1',
          description: 'Test Item',
          priority: 'Alta' as const,
          purchased: false,
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z'
        }
      ]

      act(() => {
        result.current.updateItems(newItems)
      })

      expect(StorageService.saveShoppingList).toHaveBeenCalledWith(
        expect.objectContaining({
          items: newItems,
          lastUpdated: expect.any(String)
        })
      )
    })
  })

  describe('useAppSettings', () => {
    const mockSettings: AppSettings = {
      googleDriveEnabled: false,
      notificationsEnabled: false,
      notificationTime: '10:00',
      autoSync: false
    }

    it('should load app settings on mount', async () => {
      vi.mocked(StorageService.getAppSettings).mockReturnValue(mockSettings)

      const { result } = renderHook(() => useAppSettings())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 3000 })

      expect(result.current.settings).toEqual(mockSettings)
      expect(result.current.error).toBeNull()
    })

    it('should save settings successfully', async () => {
      vi.mocked(StorageService.getAppSettings).mockReturnValue(mockSettings)
      vi.mocked(StorageService.saveAppSettings).mockReturnValue(true)

      const { result } = renderHook(() => useAppSettings())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        const success = await result.current.saveSettings(mockSettings)
        expect(success).toBe(true)
      })

      expect(StorageService.saveAppSettings).toHaveBeenCalledWith(mockSettings)
    })

    it('should update individual setting', async () => {
      vi.mocked(StorageService.getAppSettings).mockReturnValue(mockSettings)
      vi.mocked(StorageService.saveAppSettings).mockReturnValue(true)

      const { result } = renderHook(() => useAppSettings())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      act(() => {
        result.current.updateSetting('googleDriveEnabled', true)
      })

      expect(StorageService.saveAppSettings).toHaveBeenCalledWith({
        ...mockSettings,
        googleDriveEnabled: true
      })
    })
  })
})
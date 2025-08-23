import { describe, it, expect, beforeEach, vi } from 'vitest'
import { StorageService } from '../storage'
import { MonthlyFinancialData, ShoppingList, AppSettings } from '@/types'

describe('StorageService', () => {
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

  const mockShoppingList: ShoppingList = {
    items: [],
    lastUpdated: '2024-01-15T10:00:00.000Z'
  }

  const mockAppSettings: AppSettings = {
    googleDriveEnabled: false,
    notificationsEnabled: false,
    notificationTime: '10:00',
    autoSync: false
  }

  beforeEach(() => {
    localStorage.clear()
  })

  describe('Monthly Financial Data', () => {
    it('should save and retrieve financial data', () => {
      const success = StorageService.saveMonthlyFinancialData(mockFinancialData)
      expect(success).toBe(true)

      const retrieved = StorageService.getMonthlyFinancialData('2024-01')
      expect(retrieved).toEqual(mockFinancialData)
    })

    it('should return null for non-existent data', () => {
      const result = StorageService.getMonthlyFinancialData('2024-02')
      expect(result).toBeNull()
    })

    it('should handle localStorage errors gracefully', () => {
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })

      const result = StorageService.getMonthlyFinancialData('2024-01')
      expect(result).toBeNull()
    })

    it('should delete financial data', () => {
      StorageService.saveMonthlyFinancialData(mockFinancialData)
      const success = StorageService.deleteMonthlyFinancialData('2024-01')
      expect(success).toBe(true)

      const result = StorageService.getMonthlyFinancialData('2024-01')
      expect(result).toBeNull()
    })
  })

  describe('Shopping List', () => {
    it('should save and retrieve shopping list', () => {
      const success = StorageService.saveShoppingList(mockShoppingList)
      expect(success).toBe(true)

      const retrieved = StorageService.getShoppingList()
      expect(retrieved).toEqual(mockShoppingList)
    })

    it('should return default shopping list when none exists', () => {
      const result = StorageService.getShoppingList()
      expect(result.items).toEqual([])
      expect(result.lastUpdated).toBeDefined()
    })
  })

  describe('App Settings', () => {
    it('should save and retrieve app settings', () => {
      const success = StorageService.saveAppSettings(mockAppSettings)
      expect(success).toBe(true)

      const retrieved = StorageService.getAppSettings()
      expect(retrieved).toEqual(mockAppSettings)
    })

    it('should return default settings when none exist', () => {
      const result = StorageService.getAppSettings()
      expect(result.googleDriveEnabled).toBe(false)
      expect(result.notificationsEnabled).toBe(false)
      expect(result.notificationTime).toBe('10:00')
      expect(result.autoSync).toBe(false)
    })
  })

  describe('Utility Functions', () => {
    it('should clear all data', () => {
      localStorage.setItem('financitos_financial_2024-01', JSON.stringify(mockFinancialData))
      localStorage.setItem('financitos_shopping', JSON.stringify(mockShoppingList))
      localStorage.setItem('financitos_settings', JSON.stringify(mockAppSettings))

      const success = StorageService.clearAllData()
      expect(success).toBe(true)

      expect(StorageService.getMonthlyFinancialData('2024-01')).toBeNull()
      expect(StorageService.getShoppingList().items).toEqual([])
    })

    it('should handle import errors gracefully', () => {
      const success = StorageService.importAllData('invalid json')
      expect(success).toBe(false)
    })
  })
})
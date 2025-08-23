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
    it('should get all financial data keys', () => {
      StorageService.saveMonthlyFinancialData({ ...mockFinancialData, month: '2024-01' })
      StorageService.saveMonthlyFinancialData({ ...mockFinancialData, month: '2024-02' })

      const keys = StorageService.getAllFinancialDataKeys()
      expect(keys).toContain('2024-01')
      expect(keys).toContain('2024-02')
      expect(keys).toHaveLength(2)
    })

    it('should clear all data', () => {
      StorageService.saveMonthlyFinancialData(mockFinancialData)
      StorageService.saveShoppingList(mockShoppingList)
      StorageService.saveAppSettings(mockAppSettings)

      const success = StorageService.clearAllData()
      expect(success).toBe(true)

      expect(StorageService.getMonthlyFinancialData('2024-01')).toBeNull()
      expect(StorageService.getShoppingList().items).toEqual([])
    })

    it('should export all data', () => {
      StorageService.saveMonthlyFinancialData(mockFinancialData)
      StorageService.saveShoppingList(mockShoppingList)
      StorageService.saveAppSettings(mockAppSettings)

      const exported = StorageService.exportAllData()
      expect(exported).toBeTruthy()
      
      const data = JSON.parse(exported)
      expect(data.financialData['2024-01']).toEqual(mockFinancialData)
      expect(data.shoppingList).toEqual(mockShoppingList)
      expect(data.settings).toEqual(mockAppSettings)
      expect(data.exportedAt).toBeDefined()
    })

    it('should import all data', () => {
      const exportData = {
        financialData: {
          '2024-01': mockFinancialData
        },
        shoppingList: mockShoppingList,
        settings: mockAppSettings,
        exportedAt: '2024-01-15T10:00:00.000Z'
      }

      const success = StorageService.importAllData(JSON.stringify(exportData))
      expect(success).toBe(true)

      expect(StorageService.getMonthlyFinancialData('2024-01')).toEqual(mockFinancialData)
      expect(StorageService.getShoppingList()).toEqual(mockShoppingList)
      expect(StorageService.getAppSettings()).toEqual(mockAppSettings)
    })

    it('should handle import errors gracefully', () => {
      const success = StorageService.importAllData('invalid json')
      expect(success).toBe(false)
    })
  })
})
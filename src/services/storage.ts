import { MonthlyFinancialData, ShoppingList, AppSettings } from '@/types'

const STORAGE_KEYS = {
  FINANCIAL_DATA: 'financitos_financial_',
  SHOPPING_LIST: 'financitos_shopping',
  APP_SETTINGS: 'financitos_settings'
} as const

export class StorageService {
  static getMonthlyFinancialData(monthKey: string): MonthlyFinancialData | null {
    try {
      const data = localStorage.getItem(`${STORAGE_KEYS.FINANCIAL_DATA}${monthKey}`)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error('Error loading financial data:', error)
      return null
    }
  }

  static saveMonthlyFinancialData(data: MonthlyFinancialData): boolean {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.FINANCIAL_DATA}${data.month}`,
        JSON.stringify(data)
      )
      return true
    } catch (error) {
      console.error('Error saving financial data:', error)
      return false
    }
  }

  static getShoppingList(): ShoppingList {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHOPPING_LIST)
      return data ? JSON.parse(data) : { items: [], lastUpdated: new Date().toISOString() }
    } catch (error) {
      console.error('Error loading shopping list:', error)
      return { items: [], lastUpdated: new Date().toISOString() }
    }
  }

  static saveShoppingList(shoppingList: ShoppingList): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.SHOPPING_LIST, JSON.stringify(shoppingList))
      return true
    } catch (error) {
      console.error('Error saving shopping list:', error)
      return false
    }
  }

  static getAppSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS)
      return data ? JSON.parse(data) : {
        googleDriveEnabled: false,
        notificationsEnabled: false,
        notificationTime: '10:00',
        autoSync: false
      }
    } catch (error) {
      console.error('Error loading app settings:', error)
      return {
        googleDriveEnabled: false,
        notificationsEnabled: false,
        notificationTime: '10:00',
        autoSync: false
      }
    }
  }

  static saveAppSettings(settings: AppSettings): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings))
      return true
    } catch (error) {
      console.error('Error saving app settings:', error)
      return false
    }
  }

  static getAllFinancialDataKeys(): string[] {
    try {
      const keys = Object.keys(localStorage)
      return keys
        .filter(key => key.startsWith(STORAGE_KEYS.FINANCIAL_DATA))
        .map(key => key.replace(STORAGE_KEYS.FINANCIAL_DATA, ''))
        .sort()
    } catch (error) {
      console.error('Error getting financial data keys:', error)
      return []
    }
  }

  static deleteMonthlyFinancialData(monthKey: string): boolean {
    try {
      localStorage.removeItem(`${STORAGE_KEYS.FINANCIAL_DATA}${monthKey}`)
      return true
    } catch (error) {
      console.error('Error deleting financial data:', error)
      return false
    }
  }

  static clearAllData(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith('financitos_')
      )
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Error clearing all data:', error)
      return false
    }
  }

  static exportAllData(): string {
    try {
      const allData = {
        financialData: {} as Record<string, any>,
        shoppingList: this.getShoppingList(),
        settings: this.getAppSettings(),
        exportedAt: new Date().toISOString()
      }

      const financialKeys = this.getAllFinancialDataKeys()
      financialKeys.forEach(monthKey => {
        const data = this.getMonthlyFinancialData(monthKey)
        if (data) {
          allData.financialData[monthKey] = data
        }
      })

      return JSON.stringify(allData, null, 2)
    } catch (error) {
      console.error('Error exporting data:', error)
      return ''
    }
  }

  static importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      // Import financial data
      if (data.financialData) {
        Object.entries(data.financialData || {}).forEach(([, monthData]) => {
          this.saveMonthlyFinancialData(monthData as MonthlyFinancialData)
        })
      }

      // Import shopping list
      if (data.shoppingList) {
        this.saveShoppingList(data.shoppingList)
      }

      // Import settings
      if (data.settings) {
        this.saveAppSettings(data.settings)
      }

      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}
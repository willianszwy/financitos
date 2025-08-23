import { useState, useEffect, useCallback } from 'react'
import { MonthlyFinancialData, ShoppingList, AppSettings } from '@/types'
import { StorageService } from '@/services/storage'
import { getCurrentMonthKey } from '@/utils/dates'
import { calculateFinancialSummary } from '@/utils/calculations'

export const useFinancialData = (monthKey: string) => {
  const [data, setData] = useState<MonthlyFinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      let financialData = StorageService.getMonthlyFinancialData(monthKey)
      
      if (!financialData) {
        // Create empty data structure for new months
        financialData = {
          month: monthKey,
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
      }
      
      setData(financialData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load financial data')
    } finally {
      setLoading(false)
    }
  }, [monthKey])

  const saveData = useCallback(async (newData: MonthlyFinancialData) => {
    try {
      // Recalculate summary before saving
      const summary = calculateFinancialSummary(
        newData.income,
        newData.expenses,
        newData.investments
      )
      
      const dataToSave = {
        ...newData,
        summary
      }
      
      const success = StorageService.saveMonthlyFinancialData(dataToSave)
      if (success) {
        setData(dataToSave)
        return true
      } else {
        throw new Error('Failed to save data to storage')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save financial data')
      return false
    }
  }, [])

  const updateIncome = useCallback((income: typeof data.income) => {
    if (data) {
      saveData({ ...data, income })
    }
  }, [data, saveData])

  const updateExpenses = useCallback((expenses: typeof data.expenses) => {
    if (data) {
      saveData({ ...data, expenses })
    }
  }, [data, saveData])

  const updateInvestments = useCallback((investments: typeof data.investments) => {
    if (data) {
      saveData({ ...data, investments })
    }
  }, [data, saveData])

  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loading,
    error,
    updateIncome,
    updateExpenses,
    updateInvestments,
    saveData,
    reload: loadData
  }
}

export const useShoppingList = () => {
  const [shoppingList, setShoppingList] = useState<ShoppingList>({ items: [], lastUpdated: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadShoppingList = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = StorageService.getShoppingList()
      setShoppingList(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shopping list')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveShoppingList = useCallback(async (newList: ShoppingList) => {
    try {
      const dataToSave = {
        ...newList,
        lastUpdated: new Date().toISOString()
      }
      
      const success = StorageService.saveShoppingList(dataToSave)
      if (success) {
        setShoppingList(dataToSave)
        return true
      } else {
        throw new Error('Failed to save shopping list to storage')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save shopping list')
      return false
    }
  }, [])

  const updateItems = useCallback((items: typeof shoppingList.items) => {
    saveShoppingList({ ...shoppingList, items })
  }, [shoppingList, saveShoppingList])

  useEffect(() => {
    loadShoppingList()
  }, [loadShoppingList])

  return {
    shoppingList,
    loading,
    error,
    updateItems,
    saveShoppingList,
    reload: loadShoppingList
  }
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    googleDriveEnabled: false,
    notificationsEnabled: false,
    notificationTime: '10:00',
    autoSync: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = StorageService.getAppSettings()
      setSettings(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app settings')
    } finally {
      setLoading(false)
    }
  }, [])

  const saveSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      const success = StorageService.saveAppSettings(newSettings)
      if (success) {
        setSettings(newSettings)
        return true
      } else {
        throw new Error('Failed to save settings to storage')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save app settings')
      return false
    }
  }, [])

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    saveSettings({ ...settings, [key]: value })
  }, [settings, saveSettings])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return {
    settings,
    loading,
    error,
    saveSettings,
    updateSetting,
    reload: loadSettings
  }
}
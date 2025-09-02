import { useState, useEffect, useCallback } from 'react'
import { MonthlyFinancialData, ShoppingList, AppSettings, Expense } from '@/types'
import { StorageService } from '@/services/storage'
import { getPreviousMonthKey } from '@/utils/dates'
import { calculateFinancialSummary } from '@/utils/calculations'
import { adjustExpenseDate } from '@/utils/sorting'
import { generateId } from '@/utils/helpers'

const copyRecurrentExpensesFromPreviousMonth = (monthKey: string): Expense[] => {
  try {
    const previousMonth = getPreviousMonthKey(monthKey)
    const previousData = StorageService.getMonthlyFinancialData(previousMonth)
    
    if (!previousData || !previousData.expenses) {
      return []
    }
    
    // Filter only recurrent expenses and copy them with adjusted dates
    const recurrentExpenses = previousData.expenses
      .filter(expense => expense.type === 'Recorrente')
      .map(expense => ({
        ...expense,
        id: generateId(), // New ID for the copied expense
        deadline: adjustExpenseDate(expense.deadline, monthKey),
        status: 'Pendente' as const, // Reset status to pending
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    
    return recurrentExpenses
  } catch (error) {
    console.error('Error copying recurrent expenses:', error)
    return []
  }
}

export const useFinancialData = (monthKey: string) => {
  const [data, setData] = useState<MonthlyFinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [recurrentExpensesCopied, setRecurrentExpensesCopied] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    setRecurrentExpensesCopied(false)
    
    try {
      let financialData = StorageService.getMonthlyFinancialData(monthKey)
      
      if (!financialData) {
        // Create empty data structure for new months
        const copiedRecurrentExpenses = copyRecurrentExpensesFromPreviousMonth(monthKey)
        
        financialData = {
          month: monthKey,
          income: [],
          expenses: copiedRecurrentExpenses,
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
        
        // Auto-save the new month data with copied recurrent expenses
        if (copiedRecurrentExpenses.length > 0) {
          const summary = calculateFinancialSummary(
            financialData.income,
            financialData.expenses,
            financialData.investments
          )
          
          const dataToSave = {
            ...financialData,
            summary
          }
          
          StorageService.saveMonthlyFinancialData(dataToSave)
          setRecurrentExpensesCopied(true)
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

  const updateIncome = useCallback((income: MonthlyFinancialData['income']) => {
    if (data) {
      saveData({ ...data, income })
    }
  }, [data, saveData])

  const updateExpenses = useCallback((expenses: MonthlyFinancialData['expenses']) => {
    if (data) {
      saveData({ ...data, expenses })
    }
  }, [data, saveData])

  const updateInvestments = useCallback((investments: MonthlyFinancialData['investments']) => {
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
    recurrentExpensesCopied,
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

  const updateItems = useCallback((items: ShoppingList['items']) => {
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
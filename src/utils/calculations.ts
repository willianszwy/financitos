import { Income, Expense, Investment, FinancialSummary } from '@/types'

export const calculateFinancialSummary = (
  income: Income[],
  expenses: Expense[],
  investments: Investment[]
): FinancialSummary => {
  const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)
  
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
  const fixedExpenses = expenses
    .filter(item => item.type === 'Recorrente')
    .reduce((sum, item) => sum + item.amount, 0)
  const uniqueExpenses = expenses
    .filter(item => item.type === 'Única')
    .reduce((sum, item) => sum + item.amount, 0)
  
  const totalInvestments = investments.reduce((sum, item) => sum + item.currentValue, 0)
  const savingsTotal = investments
    .filter(item => item.type === 'Poupança')
    .reduce((sum, item) => sum + item.currentValue, 0)
  const cdiTotal = investments
    .filter(item => item.type === 'CDI')
    .reduce((sum, item) => sum + item.currentValue, 0)
  
  const netBalance = totalIncome - totalExpenses

  return {
    totalIncome,
    totalExpenses,
    fixedExpenses,
    uniqueExpenses,
    totalInvestments,
    savingsTotal,
    cdiTotal,
    netBalance
  }
}

export const calculateInvestmentGrowth = (currentValue: number, previousValue: number): number => {
  if (previousValue === undefined || previousValue === null) return 0
  return currentValue - previousValue
}

export const calculateInvestmentProjection = (currentValue: number, rate: number): number => {
  return currentValue + (currentValue * rate / 100)
}

export const calculateDueTodayExpenses = (expenses: Expense[]): Expense[] => {
  const today = new Date().toLocaleDateString('pt-BR')
  return expenses.filter(expense => 
    expense.status === 'Pendente' && 
    expense.deadline === today
  )
}

export const calculateOverdueExpenses = (expenses: Expense[]): Expense[] => {
  const today = new Date()
  return expenses.filter(expense => {
    if (expense.status !== 'Pendente') return false
    
    try {
      const [day, month, year] = expense.deadline.split('/')
      const expenseDate = new Date(Number(year), Number(month) - 1, Number(day))
      return expenseDate < today
    } catch {
      return false
    }
  })
}
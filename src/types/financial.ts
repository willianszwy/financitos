export interface Income {
  id: string
  source: string
  deadline: string // dd/mm/yyyy format
  amount: number
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  description: string
  type: 'Recorrente' | 'Única'
  deadline: string // dd/mm/yyyy format
  status: 'Pago' | 'Pendente'
  paymentMethod: 'Crédito' | 'Débito' | 'PIX' | 'Dinheiro'
  amount: number
  receiptPath?: string
  createdAt: string
  updatedAt: string
}

export interface Investment {
  id: string
  type: 'Poupança' | 'CDI'
  bank: string
  currentValue: number
  previousValue?: number
  growth: number
  rate: number
  projection: number
  createdAt: string
  updatedAt: string
}

export interface MonthlyFinancialData {
  month: string // YYYY-MM format
  income: Income[]
  expenses: Expense[]
  investments: Investment[]
  summary: {
    totalIncome: number
    totalExpenses: number
    fixedExpenses: number
    uniqueExpenses: number
    totalInvestments: number
    savingsTotal: number
    cdiTotal: number
    netBalance: number
  }
}

export interface FinancialSummary {
  totalIncome: number
  totalExpenses: number
  fixedExpenses: number
  uniqueExpenses: number
  totalInvestments: number
  savingsTotal: number
  cdiTotal: number
  netBalance: number
}
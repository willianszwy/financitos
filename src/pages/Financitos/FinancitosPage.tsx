import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from 'lucide-react'
import { getCurrentMonthKey, getNextMonthKey, getPreviousMonthKey, formatMonthName } from '@/utils/dates'
import { useFinancialData } from '@/hooks/useLocalStorage'
import { FinancialSummaryCard } from '@/components/cards/FinancialSummaryCard'
import { IncomeSection } from './components/IncomeSection'
import { ExpenseSection } from './components/ExpenseSection'
import { InvestmentSection } from './components/InvestmentSection'

export const FinancitosPage = () => {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey())
  const { data: financialData, loading, error, updateIncome, updateExpenses, updateInvestments } = useFinancialData(currentMonth)

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? getPreviousMonthKey(currentMonth)
      : getNextMonthKey(currentMonth)
    
    setCurrentMonth(newMonth)
  }

  const getCurrentYear = () => {
    return currentMonth.split('-')[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-income-primary mx-auto mb-2" />
          <p className="text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!financialData) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-800 capitalize">
              {formatMonthName(currentMonth)}
            </h1>
            <div className="flex items-center space-x-1 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{getCurrentYear()}</span>
            </div>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummaryCard summary={financialData.summary} />

      {/* Income Section */}
      <IncomeSection 
        income={financialData.income}
        onIncomeChange={updateIncome}
      />

      {/* Expense Section */}
      <ExpenseSection 
        expenses={financialData.expenses}
        onExpenseChange={updateExpenses}
      />

      {/* Investment Section */}
      <InvestmentSection 
        investments={financialData.investments}
        onInvestmentChange={updateInvestments}
      />

      {/* Save to Google Drive Button */}
      <div className="pb-6">
        <button className="w-full btn-primary flex items-center justify-center space-x-2">
          <span>💾</span>
          <span>Salvar no Google Drive</span>
        </button>
      </div>
    </div>
  )
}
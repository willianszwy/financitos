import { FinancialSummary } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface FinancialSummaryCardProps {
  summary: FinancialSummary
}

export const FinancialSummaryCard = ({ summary }: FinancialSummaryCardProps) => {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Resumo Financeiro</h2>
      
      <div className="space-y-3">
        {/* Income */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">💚</span>
            <span className="font-medium text-gray-700">ENTRADAS</span>
          </div>
          <span className="font-semibold text-income-primary">
            {formatCurrency(summary.totalIncome)}
          </span>
        </div>

        {/* Expenses */}
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">❤️</span>
              <span className="font-medium text-gray-700">SAÍDAS</span>
            </div>
            <span className="font-semibold text-expense-primary">
              {formatCurrency(summary.totalExpenses)}
            </span>
          </div>
          
          <div className="ml-6 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>• Recorrente</span>
              <span>{formatCurrency(summary.fixedExpenses)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>• Única</span>
              <span>{formatCurrency(summary.uniqueExpenses)}</span>
            </div>
          </div>
        </div>

        {/* Investments */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">💙</span>
              <span className="font-medium text-gray-700">INVESTIMENTOS</span>
            </div>
            <span className="font-semibold text-investment-primary">
              {formatCurrency(summary.totalInvestments)}
            </span>
          </div>
          
          <div className="ml-6 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>• Poupança</span>
              <span>{formatCurrency(summary.savingsTotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>• CDI</span>
              <span>{formatCurrency(summary.cdiTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
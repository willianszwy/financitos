import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FinancialSummaryCard } from '../FinancialSummaryCard'
import { FinancialSummary } from '@/types'

describe('FinancialSummaryCard', () => {
  const mockSummary: FinancialSummary = {
    totalIncome: 6500,
    totalExpenses: 1550,
    fixedExpenses: 1200,
    uniqueExpenses: 350,
    totalInvestments: 13000,
    savingsTotal: 8000,
    cdiTotal: 5000,
    netBalance: 4950
  }

  it('should render financial summary correctly', () => {
    render(<FinancialSummaryCard summary={mockSummary} />)

    // Check title
    expect(screen.getByText('Resumo Financeiro')).toBeInTheDocument()

    // Check income
    expect(screen.getByText('ENTRADAS')).toBeInTheDocument()
    expect(screen.getByText(/R\$.*6\.500,00/)).toBeInTheDocument()

    // Check expenses
    expect(screen.getByText('SAÍDAS')).toBeInTheDocument()
    expect(screen.getByText(/R\$.*1\.550,00/)).toBeInTheDocument()
    expect(screen.getByText(/R\$.*1\.200,00/)).toBeInTheDocument() // Fixed expenses
    expect(screen.getByText(/R\$.*350,00/)).toBeInTheDocument() // Unique expenses

    // Check investments
    expect(screen.getByText('INVESTIMENTOS')).toBeInTheDocument()
    expect(screen.getByText(/R\$.*13\.000,00/)).toBeInTheDocument()
    expect(screen.getByText(/R\$.*8\.000,00/)).toBeInTheDocument() // Savings
    expect(screen.getByText(/R\$.*5\.000,00/)).toBeInTheDocument() // CDI
  })

  it('should handle zero values', () => {
    const zeroSummary: FinancialSummary = {
      totalIncome: 0,
      totalExpenses: 0,
      fixedExpenses: 0,
      uniqueExpenses: 0,
      totalInvestments: 0,
      savingsTotal: 0,
      cdiTotal: 0,
      netBalance: 0
    }

    render(<FinancialSummaryCard summary={zeroSummary} />)

    const zeroValues = screen.getAllByText(/R\$.*0,00/)
    expect(zeroValues).toHaveLength(8) // All monetary values should be R$ 0,00 (including Saldo)
  })

  it('should apply correct CSS classes', () => {
    render(<FinancialSummaryCard summary={mockSummary} />)

    // Check if sections have correct background colors
    const incomeSection = screen.getByText('ENTRADAS').closest('.bg-green-50')
    const expenseSection = screen.getByText('SAÍDAS').closest('.bg-red-50')
    const investmentSection = screen.getByText('INVESTIMENTOS').closest('.bg-blue-50')

    expect(incomeSection).toBeInTheDocument()
    expect(expenseSection).toBeInTheDocument()
    expect(investmentSection).toBeInTheDocument()
  })
})
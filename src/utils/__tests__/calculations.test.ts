import { describe, it, expect } from 'vitest'
import {
  calculateFinancialSummary,
  calculateInvestmentGrowth,
  calculateInvestmentProjection,
  calculateDueTodayExpenses,
  calculateOverdueExpenses
} from '../calculations'
import { Income, Expense, Investment } from '@/types'

describe('calculations', () => {
  const mockIncome: Income[] = [
    {
      id: '1',
      source: 'Salário',
      deadline: '15/01/2024',
      amount: 5000,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2', 
      source: 'Freelancer',
      deadline: '20/01/2024',
      amount: 1500,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]

  const mockExpenses: Expense[] = [
    {
      id: '1',
      description: 'Aluguel',
      type: 'Recorrente',
      deadline: '05/01/2024',
      status: 'Pago',
      paymentMethod: 'PIX',
      amount: 1200,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      description: 'Mercado',
      type: 'Única',
      deadline: '15/01/2024',
      status: 'Pendente',
      paymentMethod: 'Crédito',
      amount: 350,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]

  const mockInvestments: Investment[] = [
    {
      id: '1',
      type: 'Poupança',
      bank: 'Itaú',
      currentValue: 8000,
      previousValue: 7500,
      growth: 500,
      rate: 0.5,
      projection: 8040,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      type: 'CDI',
      bank: 'Nubank',
      currentValue: 5000,
      growth: 60,
      rate: 1.2,
      projection: 5060,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]

  describe('calculateFinancialSummary', () => {
    it('should calculate correct financial summary', () => {
      const summary = calculateFinancialSummary(mockIncome, mockExpenses, mockInvestments)
      
      expect(summary.totalIncome).toBe(6500)
      expect(summary.totalExpenses).toBe(1550)
      expect(summary.fixedExpenses).toBe(1200)
      expect(summary.uniqueExpenses).toBe(350)
      expect(summary.totalInvestments).toBe(13000)
      expect(summary.savingsTotal).toBe(8000)
      expect(summary.cdiTotal).toBe(5000)
      expect(summary.netBalance).toBe(4950)
    })

    it('should handle empty arrays', () => {
      const summary = calculateFinancialSummary([], [], [])
      
      expect(summary.totalIncome).toBe(0)
      expect(summary.totalExpenses).toBe(0)
      expect(summary.fixedExpenses).toBe(0)
      expect(summary.uniqueExpenses).toBe(0)
      expect(summary.totalInvestments).toBe(0)
      expect(summary.savingsTotal).toBe(0)
      expect(summary.cdiTotal).toBe(0)
      expect(summary.netBalance).toBe(0)
    })
  })

  describe('calculateInvestmentGrowth', () => {
    it('should calculate positive growth', () => {
      const growth = calculateInvestmentGrowth(8000, 7500)
      expect(growth).toBe(500)
    })

    it('should calculate negative growth', () => {
      const growth = calculateInvestmentGrowth(7000, 7500)
      expect(growth).toBe(-500)
    })

    it('should return 0 for undefined previous value', () => {
      const growth = calculateInvestmentGrowth(8000, undefined as any)
      expect(growth).toBe(0)
    })

    it('should return 0 for null previous value', () => {
      const growth = calculateInvestmentGrowth(8000, null as any)
      expect(growth).toBe(0)
    })

    it('should calculate growth from zero previous value', () => {
      const growth = calculateInvestmentGrowth(8000, 0)
      expect(growth).toBe(8000)
    })
  })

  describe('calculateInvestmentProjection', () => {
    it('should calculate correct projection', () => {
      const projection = calculateInvestmentProjection(10000, 1.5)
      expect(projection).toBe(10150)
    })

    it('should handle zero rate', () => {
      const projection = calculateInvestmentProjection(10000, 0)
      expect(projection).toBe(10000)
    })
  })

  describe('calculateDueTodayExpenses', () => {
    it('should return expenses due today', () => {
      const todayExpenses = calculateDueTodayExpenses(mockExpenses)
      expect(todayExpenses).toHaveLength(1)
      expect(todayExpenses[0].description).toBe('Mercado')
    })

    it('should return empty array when no expenses due today', () => {
      const expensesNotDueToday = mockExpenses.map(expense => ({
        ...expense,
        deadline: '10/01/2024'
      }))
      const todayExpenses = calculateDueTodayExpenses(expensesNotDueToday)
      expect(todayExpenses).toHaveLength(0)
    })
  })

  describe('calculateOverdueExpenses', () => {
    it('should return overdue expenses', () => {
      const overdueExpenses = calculateOverdueExpenses([
        {
          ...mockExpenses[0],
          deadline: '10/01/2024',
          status: 'Pendente'
        }
      ])
      expect(overdueExpenses).toHaveLength(1)
    })

    it('should not include paid expenses', () => {
      const overdueExpenses = calculateOverdueExpenses([
        {
          ...mockExpenses[0],
          deadline: '10/01/2024',
          status: 'Pago'
        }
      ])
      expect(overdueExpenses).toHaveLength(0)
    })
  })
})
import { describe, it, expect } from 'vitest'
import { parseBRDate, sortByDateAscending, adjustExpenseDate } from '../sorting'
import { Income, Expense } from '@/types'

describe('Sorting utilities', () => {
  describe('parseBRDate', () => {
    it('should parse Brazilian date format correctly', () => {
      const date = parseBRDate('15/03/2024')
      expect(date.getDate()).toBe(15)
      expect(date.getMonth()).toBe(2) // March is month 2 (0-indexed)
      expect(date.getFullYear()).toBe(2024)
    })

    it('should handle invalid date format gracefully', () => {
      const date = parseBRDate('invalid-date')
      expect(isNaN(date.getTime())).toBe(true)
    })
  })

  describe('sortByDateAscending', () => {
    it('should sort income items by deadline in ascending order', () => {
      const income: Income[] = [
        { 
          id: '1', 
          source: 'Salary', 
          deadline: '30/03/2024', 
          amount: 1000, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        },
        { 
          id: '2', 
          source: 'Freelance', 
          deadline: '15/03/2024', 
          amount: 500, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        },
        { 
          id: '3', 
          source: 'Investment', 
          deadline: '01/03/2024', 
          amount: 200, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        }
      ]

      const sorted = sortByDateAscending(income)
      
      expect(sorted[0].deadline).toBe('01/03/2024')
      expect(sorted[1].deadline).toBe('15/03/2024')
      expect(sorted[2].deadline).toBe('30/03/2024')
    })

    it('should sort expense items by deadline in ascending order', () => {
      const expenses: Expense[] = [
        {
          id: '1',
          description: 'Rent',
          type: 'Recorrente',
          deadline: '05/04/2024',
          status: 'Pendente',
          paymentMethod: 'PIX',
          amount: 800,
          createdAt: '2024-04-01T10:00:00Z',
          updatedAt: '2024-04-01T10:00:00Z'
        },
        {
          id: '2',
          description: 'Groceries',
          type: 'Única',
          deadline: '02/04/2024',
          status: 'Pago',
          paymentMethod: 'Crédito',
          amount: 150,
          createdAt: '2024-04-01T10:00:00Z',
          updatedAt: '2024-04-01T10:00:00Z'
        }
      ]

      const sorted = sortByDateAscending(expenses)
      
      expect(sorted[0].deadline).toBe('02/04/2024')
      expect(sorted[1].deadline).toBe('05/04/2024')
    })

    it('should handle items with invalid dates by placing them at the end', () => {
      const income: Income[] = [
        { 
          id: '1', 
          source: 'Valid', 
          deadline: '15/03/2024', 
          amount: 1000, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        },
        { 
          id: '2', 
          source: 'Invalid', 
          deadline: 'invalid-date', 
          amount: 500, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        }
      ]

      const sorted = sortByDateAscending(income)
      
      expect(sorted[0].deadline).toBe('15/03/2024')
      expect(sorted[1].deadline).toBe('invalid-date')
    })

    it('should not mutate the original array', () => {
      const income: Income[] = [
        { 
          id: '1', 
          source: 'Second', 
          deadline: '30/03/2024', 
          amount: 1000, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        },
        { 
          id: '2', 
          source: 'First', 
          deadline: '15/03/2024', 
          amount: 500, 
          createdAt: '2024-03-01T10:00:00Z', 
          updatedAt: '2024-03-01T10:00:00Z' 
        }
      ]

      const original = [...income]
      const sorted = sortByDateAscending(income)
      
      expect(income).toEqual(original)
      expect(sorted).not.toBe(income)
    })
  })

  describe('adjustExpenseDate', () => {
    it('should adjust expense date to target month keeping same day', () => {
      const adjustedDate = adjustExpenseDate('15/03/2024', '2024-04')
      expect(adjustedDate).toBe('15/04/2024')
    })

    it('should handle month transition with different year', () => {
      const adjustedDate = adjustExpenseDate('31/12/2023', '2024-01')
      expect(adjustedDate).toBe('31/01/2024')
    })

    it('should adjust to last day of month when day does not exist', () => {
      // February 30th doesn't exist, should become last day of February
      const adjustedDate = adjustExpenseDate('30/01/2024', '2024-02')
      expect(adjustedDate).toBe('29/02/2024') // 2024 is leap year
    })

    it('should handle non-leap year February correctly', () => {
      const adjustedDate = adjustExpenseDate('29/01/2023', '2023-02')
      expect(adjustedDate).toBe('28/02/2023') // 2023 is not leap year
    })

    it('should return original date if format is invalid', () => {
      const adjustedDate = adjustExpenseDate('invalid-date', '2024-04')
      expect(adjustedDate).toBe('invalid-date')
    })

    it('should handle edge cases gracefully', () => {
      const adjustedDate = adjustExpenseDate('', '2024-04')
      expect(adjustedDate).toBe('')
    })
  })
})
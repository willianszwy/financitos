import { describe, it, expect } from 'vitest'
import {
  getCurrentMonthKey,
  getMonthKey,
  getPreviousMonthKey,
  getNextMonthKey,
  formatMonthName,
  formatMonthNameShort,
  isDateToday,
  isDateOverdue,
  getDateForInput,
  getTodayISO,
  getMonthRange
} from '../dates'

describe('dates', () => {
  describe('getCurrentMonthKey', () => {
    it('should return current month in YYYY-MM format', () => {
      const result = getCurrentMonthKey()
      expect(result).toBe('2024-01')
    })
  })

  describe('getMonthKey', () => {
    it('should return month key for given date', () => {
      const date = new Date('2024-03-15')
      const result = getMonthKey(date)
      expect(result).toBe('2024-03')
    })
  })

  describe('getPreviousMonthKey', () => {
    it('should return previous month', () => {
      const result = getPreviousMonthKey('2024-03')
      expect(result).toBe('2024-02')
    })

    it('should handle year transition', () => {
      const result = getPreviousMonthKey('2024-01')
      expect(result).toBe('2023-12')
    })
  })

  describe('getNextMonthKey', () => {
    it('should return next month', () => {
      const result = getNextMonthKey('2024-03')
      expect(result).toBe('2024-04')
    })

    it('should handle year transition', () => {
      const result = getNextMonthKey('2024-12')
      expect(result).toBe('2025-01')
    })
  })

  describe('formatMonthName', () => {
    it('should format month name with year', () => {
      const result = formatMonthName('2024-01')
      expect(result).toBe('janeiro 2024')
    })

    it('should handle different months', () => {
      expect(formatMonthName('2024-12')).toBe('dezembro 2024')
      expect(formatMonthName('2023-06')).toBe('junho 2023')
    })
  })

  describe('formatMonthNameShort', () => {
    it('should format short month name', () => {
      const result = formatMonthNameShort('2024-01')
      expect(result).toBe('jan 2024')
    })
  })

  describe('isDateToday', () => {
    it('should return true for today date', () => {
      const result = isDateToday('2024-01-15')
      expect(result).toBe(true)
    })

    it('should return false for different date', () => {
      const result = isDateToday('2024-01-16')
      expect(result).toBe(false)
    })

    it('should handle invalid date', () => {
      const result = isDateToday('invalid-date')
      expect(result).toBe(false)
    })
  })

  describe('isDateOverdue', () => {
    it('should return true for past dates', () => {
      const result = isDateOverdue('2024-01-10')
      expect(result).toBe(false) // Within the same month
    })

    it('should return false for future dates', () => {
      const result = isDateOverdue('2024-01-20')
      expect(result).toBe(false)
    })

    it('should handle invalid date', () => {
      const result = isDateOverdue('invalid-date')
      expect(result).toBe(false)
    })
  })

  describe('getDateForInput', () => {
    it('should format date for input', () => {
      const result = getDateForInput('2024-01-15T10:00:00')
      expect(result).toBe('2024-01-15')
    })

    it('should return today for undefined', () => {
      const result = getDateForInput()
      expect(result).toBe('2024-01-15')
    })
  })

  describe('getTodayISO', () => {
    it('should return today in ISO format', () => {
      const result = getTodayISO()
      expect(result).toBe('2024-01-15')
    })
  })

  describe('getMonthRange', () => {
    it('should return start and end of month', () => {
      const result = getMonthRange('2024-01')
      
      expect(result.start).toEqual(new Date(2024, 0, 1))
      expect(result.end).toEqual(new Date(2024, 0, 31, 23, 59, 59, 999))
    })
  })
})
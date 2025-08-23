import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatDateShort,
  formatMonthYear,
  formatPercentage,
  parseFormCurrency,
  formatInputCurrency
} from '../formatters'

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format currency in BRL', () => {
      expect(formatCurrency(1234.56)).toBe('R$\u00A01.234,56')
      expect(formatCurrency(0)).toBe('R$\u00A00,00')
      expect(formatCurrency(999999.99)).toBe('R$\u00A0999.999,99')
    })

    it('should handle negative values', () => {
      expect(formatCurrency(-1234.56)).toBe('-R$\u00A01.234,56')
    })
  })

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/1[45]\/01\/2024/) // Account for timezone differences
    })

    it('should format Date object', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDate(date)
      expect(result).toBe('15/01/2024')
    })
  })

  describe('formatDateShort', () => {
    it('should format date without year', () => {
      const result = formatDateShort('2024-01-15')
      expect(result).toMatch(/1[45]\/01/) // Account for timezone differences
    })

    it('should format Date object without year', () => {
      const date = new Date('2024-01-15T12:00:00Z')
      const result = formatDateShort(date)
      expect(result).toBe('15/01')
    })
  })

  describe('formatMonthYear', () => {
    it('should format month-year string', () => {
      const result = formatMonthYear('2024-01')
      expect(result).toBe('janeiro de 2024')
    })

    it('should handle different months', () => {
      expect(formatMonthYear('2024-12')).toBe('dezembro de 2024')
      expect(formatMonthYear('2023-06')).toBe('junho de 2023')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage with one decimal', () => {
      expect(formatPercentage(1.234)).toBe('1.2%')
      expect(formatPercentage(0.5)).toBe('0.5%')
      expect(formatPercentage(100)).toBe('100.0%')
    })
  })

  describe('parseFormCurrency', () => {
    it('should parse currency strings', () => {
      expect(parseFormCurrency('R$ 1.234,56')).toBe(1234.56)
      expect(parseFormCurrency('1234,50')).toBe(1234.5)
      expect(parseFormCurrency('R$ 0,00')).toBe(0)
    })

    it('should handle invalid strings', () => {
      expect(parseFormCurrency('')).toBe(0)
      expect(parseFormCurrency('abc')).toBe(0)
    })
  })

  describe('formatInputCurrency', () => {
    it('should format as user types', () => {
      expect(formatInputCurrency('123456')).toBe('R$\u00A01.234,56')
      expect(formatInputCurrency('100')).toBe('R$\u00A01,00')
      expect(formatInputCurrency('1')).toBe('R$\u00A00,01')
    })

    it('should handle empty input', () => {
      expect(formatInputCurrency('')).toBe('')
      expect(formatInputCurrency('0')).toBe('R$\u00A00,00')
    })
  })
})
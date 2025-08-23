import { useState, useCallback } from 'react'

interface UseCurrencyMaskReturn {
  value: string
  displayValue: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setValue: (value: number | string) => void
  numericValue: number
}

export const useCurrencyMask = (initialValue: number | string = 0): UseCurrencyMaskReturn => {
  const formatCurrencyMask = (value: string): string => {
    // Remove all non-numeric characters except comma and dot
    const numericValue = value.replace(/[^\d]/g, '')
    
    if (!numericValue) return ''
    
    // Convert to number (cents) and format
    const number = parseInt(numericValue, 10)
    const reais = Math.floor(number / 100)
    const centavos = number % 100
    
    // Format with thousands separator
    const formattedReais = reais.toLocaleString('pt-BR')
    const formattedCentavos = centavos.toString().padStart(2, '0')
    
    return `R$ ${formattedReais},${formattedCentavos}`
  }

  const parseNumericValue = (maskedValue: string): number => {
    const numericValue = maskedValue.replace(/[^\d]/g, '')
    if (!numericValue) return 0
    return parseInt(numericValue, 10) / 100
  }

  // Initialize with formatted value
  const initializeValue = (value: number | string): string => {
    if (typeof value === 'string') {
      // If it's already a masked string, return as is
      if (value.startsWith('R$')) return value
      // If it's empty or "0", return empty
      if (!value || value === '0') return ''
      // If it's a numeric string, treat it as the actual value (not cents)
      const num = parseFloat(value.replace(',', '.')) || 0
      if (num === 0) return ''
      // Convert the value to cents for formatting
      const cents = Math.round(num * 100)
      return formatCurrencyMask(cents.toString())
    }
    // If it's a number, treat it as the actual value (not cents)
    if (value === 0) return ''
    const cents = Math.round(value * 100)
    return formatCurrencyMask(cents.toString())
  }

  const [displayValue, setDisplayValue] = useState<string>(initializeValue(initialValue))

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    
    // Allow clearing the field
    if (inputValue === '') {
      setDisplayValue('')
      return
    }
    
    // Apply mask
    const formatted = formatCurrencyMask(inputValue)
    setDisplayValue(formatted)
  }, [])

  const setValue = useCallback((value: number | string) => {
    setDisplayValue(initializeValue(value))
  }, [])

  // Get numeric value for form submission
  const numericValue = parseNumericValue(displayValue)

  // Get raw value for form libraries (without R$ formatting)
  const rawValue = displayValue

  return {
    value: rawValue,
    displayValue,
    onChange,
    setValue,
    numericValue
  }
}
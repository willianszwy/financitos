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
      // If it's a numeric string, convert to number
      const num = parseFloat(value.replace(',', '.')) || 0
      return formatCurrencyMask((num * 100).toString())
    }
    // If it's a number, format it
    if (value === 0) return ''
    return formatCurrencyMask((value * 100).toString())
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
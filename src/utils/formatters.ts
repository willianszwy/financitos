export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj)
}

export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  }).format(dateObj)
}

export const formatMonthYear = (monthString: string): string => {
  const [year, month] = monthString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`
}

export const parseFormCurrency = (value: string): number => {
  // Remove currency symbols and spaces, then handle Brazilian format
  let cleanValue = value.replace(/[R$\s]/g, '')
  
  // Handle Brazilian number format (1.234,56 -> 1234.56)
  const parts = cleanValue.split(',')
  if (parts.length === 2) {
    // Has decimal part
    const integerPart = parts[0].replace(/\./g, '') // Remove thousand separators
    const decimalPart = parts[1]
    cleanValue = `${integerPart}.${decimalPart}`
  } else {
    // No decimal part, just remove thousand separators
    cleanValue = cleanValue.replace(/\./g, '')
  }
  
  return parseFloat(cleanValue) || 0
}

export const formatInputCurrency = (value: string): string => {
  // Format as user types
  const numericValue = value.replace(/\D/g, '')
  if (!numericValue) return ''
  
  const cents = parseInt(numericValue)
  const reais = (cents / 100).toFixed(2)
  return formatCurrency(parseFloat(reais))
}
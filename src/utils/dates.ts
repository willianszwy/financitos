import { format, addMonths, subMonths, startOfMonth, endOfMonth, isToday, isBefore, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const getCurrentMonthKey = (): string => {
  return format(new Date(), 'yyyy-MM')
}

export const getMonthKey = (date: Date): string => {
  return format(date, 'yyyy-MM')
}

export const getPreviousMonthKey = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return format(subMonths(date, 1), 'yyyy-MM')
}

export const getNextMonthKey = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return format(addMonths(date, 1), 'yyyy-MM')
}

export const formatMonthName = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return format(date, 'MMMM yyyy', { locale: ptBR })
}

export const formatMonthNameShort = (monthKey: string): string => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  return format(date, 'MMM yyyy', { locale: ptBR })
}

export const isDateToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString)
    return isToday(date)
  } catch {
    return false
  }
}

export const isDateOverdue = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString)
    return isBefore(date, startOfMonth(new Date())) && !isToday(date)
  } catch {
    return false
  }
}

export const getDateForInput = (date?: string | Date): string => {
  if (!date) return format(new Date(), 'yyyy-MM-dd')
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}

export const getTodayISO = (): string => {
  return format(new Date(), 'yyyy-MM-dd')
}

export const normalizeDate = (dateString: string): string => {
  // Ensure the date is treated as local date, not UTC
  // This prevents timezone issues with date inputs
  if (!dateString) return dateString
  
  // If it's already in YYYY-MM-DD format, ensure it stays that way
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Parse and format to ensure consistent YYYY-MM-DD format
  try {
    // Handle different date formats that might come from forms
    let date: Date
    
    if (dateString.includes('T')) {
      // For ISO strings with time, parse as is
      date = new Date(dateString)
    } else if (dateString.includes('/')) {
      // Handle MM/DD/YYYY or DD/MM/YYYY formats
      date = new Date(dateString)
    } else {
      // For date-only strings in YYYY-MM-DD format, ensure local time interpretation
      // This is crucial for HTML date inputs which return YYYY-MM-DD strings
      const [year, month, day] = dateString.split('-').map(Number)
      if (year && month && day) {
        // Create date using local timezone (month is 0-indexed in JS)
        date = new Date(year, month - 1, day)
      } else {
        date = new Date(dateString + 'T00:00:00')
      }
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    return format(date, 'yyyy-MM-dd')
  } catch {
    return dateString
  }
}

export const formatDateToBR = (dateString: string): string => {
  // Convert from YYYY-MM-DD (HTML input) to dd/mm/yyyy format
  if (!dateString) return ''
  
  try {
    // Handle different input formats
    let date: Date
    
    if (dateString.includes('/')) {
      // Already in dd/mm/yyyy format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        return dateString
      }
      date = new Date(dateString)
    } else if (dateString.includes('-')) {
      // YYYY-MM-DD format from HTML input
      const [year, month, day] = dateString.split('-').map(Number)
      date = new Date(year, month - 1, day)
    } else {
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    return format(date, 'dd/MM/yyyy')
  } catch {
    return dateString
  }
}

export const formatDateFromBR = (brDateString: string): string => {
  // Convert from dd/mm/yyyy to YYYY-MM-DD format for HTML inputs
  if (!brDateString) return ''
  
  try {
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(brDateString)) {
      const [day, month, year] = brDateString.split('/').map(Number)
      const date = new Date(year, month - 1, day)
      
      if (isNaN(date.getTime())) {
        return brDateString
      }
      
      return format(date, 'yyyy-MM-dd')
    }
    
    return brDateString
  } catch {
    return brDateString
  }
}

export const getTodayBR = (): string => {
  return format(new Date(), 'dd/MM/yyyy')
}

export const getMonthRange = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  }
}
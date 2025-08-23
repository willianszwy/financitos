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

export const getMonthRange = (monthKey: string) => {
  const [year, month] = monthKey.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  
  return {
    start: startOfMonth(date),
    end: endOfMonth(date)
  }
}
export const parseBRDate = (dateString: string): Date => {
  // Convert dd/mm/yyyy to Date object for comparison
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
  }
  
  // Fallback for other date formats
  return new Date(dateString)
}

export const sortByDateAscending = <T extends { deadline: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const dateA = parseBRDate(a.deadline)
    const dateB = parseBRDate(b.deadline)
    
    // Handle invalid dates
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
    if (isNaN(dateA.getTime())) return 1
    if (isNaN(dateB.getTime())) return -1
    
    return dateA.getTime() - dateB.getTime()
  })
}

export const sortByCreatedAtAscending = <T extends { createdAt: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.createdAt)
    const dateB = new Date(b.createdAt)
    
    // Handle invalid dates
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0
    if (isNaN(dateA.getTime())) return 1
    if (isNaN(dateB.getTime())) return -1
    
    return dateA.getTime() - dateB.getTime()
  })
}

export const adjustExpenseDate = (originalDate: string, targetMonth: string): string => {
  // Adjust expense date from previous month to target month
  // Keep the same day but change to target month
  
  try {
    if (!originalDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(originalDate)) {
      return originalDate
    }
    
    const [day] = originalDate.split('/').map(Number)
    const [targetYear, targetMonthNumber] = targetMonth.split('-').map(Number)
    
    // Create date with target year/month but same day
    const targetDate = new Date(targetYear, targetMonthNumber - 1, day)
    
    // Handle cases where day doesn't exist in target month (e.g., Feb 30)
    if (targetDate.getMonth() !== (targetMonthNumber - 1)) {
      // Use last day of target month instead
      const lastDayOfMonth = new Date(targetYear, targetMonthNumber, 0).getDate()
      return `${lastDayOfMonth.toString().padStart(2, '0')}/${targetMonthNumber.toString().padStart(2, '0')}/${targetYear}`
    }
    
    return `${day.toString().padStart(2, '0')}/${targetMonthNumber.toString().padStart(2, '0')}/${targetYear}`
  } catch (error) {
    console.error('Error adjusting expense date:', error)
    return originalDate
  }
}
import { useState, useEffect, useCallback } from 'react'
import { ratesService, RatesData, InterestRate } from '@/services/rates'

interface UseInterestRatesReturn {
  rates: RatesData
  isLoading: boolean
  error: string | null
  lastUpdate: Date | null
  refreshRates: () => Promise<void>
}

export const useInterestRates = (autoFetch: boolean = true): UseInterestRatesReturn => {
  const [rates, setRates] = useState<RatesData>({ cdi: null, selic: null })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const refreshRates = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const fetchedRates = await ratesService.getAllRates()
      
      if (fetchedRates.error) {
        setError(fetchedRates.error)
      } else {
        setRates(fetchedRates)
        setLastUpdate(new Date())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rates')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      refreshRates()
    }
  }, [autoFetch, refreshRates])

  return {
    rates,
    isLoading,
    error,
    lastUpdate,
    refreshRates
  }
}

// Hook específico para buscar apenas CDI
export const useCDIRate = (autoFetch: boolean = true) => {
  const [cdiRate, setCDIRate] = useState<InterestRate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCDI = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const rate = await ratesService.getCDIRate()
      setCDIRate(rate)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch CDI rate')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchCDI()
    }
  }, [autoFetch, fetchCDI])

  return {
    cdiRate,
    isLoading,
    error,
    refreshCDI: fetchCDI
  }
}
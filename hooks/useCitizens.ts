import { useState, useEffect, useRef } from 'react'
import { CitizensData, ApiResponse } from '@/types/citizens'

export function useCitizens(): ApiResponse<CitizensData> {
  const [data, setData] = useState<CitizensData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchCitizens = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }
      setError(null)
      
      const response = await fetch('/api/citizens')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const citizensData = await response.json()
      setData(citizensData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching citizens:', errorMessage)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchCitizens(true)

    // Set up auto-refresh every minute (60000ms)
    intervalRef.current = setInterval(() => {
      fetchCitizens(false)
    }, 60000)

    // Listen for citizen status change events
    const handleCitizenDataUpdated = () => {
      console.log('🔄 Citizen data updated event received, refetching...')
      fetchCitizens(false)
    }

    const handleCitizensCameOnline = (event: CustomEvent) => {
      console.log('🟢 Citizens came online event received, refetching...', event.detail)
      fetchCitizens(false)
    }

    const handleCitizensWentOffline = (event: CustomEvent) => {
      console.log('⚫ Citizens went offline event received, refetching...', event.detail)
      fetchCitizens(false)
    }

    // Add event listeners
    window.addEventListener('citizenDataUpdated', handleCitizenDataUpdated)
    window.addEventListener('citizensCameOnline', handleCitizensCameOnline as EventListener)
    window.addEventListener('citizensWentOffline', handleCitizensWentOffline as EventListener)

    // Cleanup interval and event listeners on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('citizenDataUpdated', handleCitizenDataUpdated)
      window.removeEventListener('citizensCameOnline', handleCitizensCameOnline as EventListener)
      window.removeEventListener('citizensWentOffline', handleCitizensWentOffline as EventListener)
    }
  }, [])

  return {
    data: data || undefined,
    error: error || undefined,
    loading,
    isRefreshing
  }
}

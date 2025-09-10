import { useState, useEffect } from 'react'
import { Citizen } from '@/types/citizens'

interface UseCitizensForSocialReturn {
  citizens: Citizen[]
  loading: boolean
  error: string | null
  isRefreshing: boolean
  refetch: () => Promise<void>
}

export function useCitizensForSocial(): UseCitizensForSocialReturn {
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

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
      
      const data = await response.json()
      setCitizens(data.citizens || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      console.error('Error fetching citizens for social media:', errorMessage)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    // Initial fetch only
    fetchCitizens(true)
  }, [])

  return {
    citizens,
    loading,
    error,
    isRefreshing,
    refetch: () => fetchCitizens(false)
  }
}

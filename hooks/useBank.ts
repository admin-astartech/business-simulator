import { CitizenBankAccount } from '@/types/citizens'
import { useState, useEffect } from 'react'

interface BankData {
  totalBalance: number
  citizensAccounts: CitizenBankAccount[]
}


interface ApiResponse<T> {
  data?: T
  error?: string
  loading: boolean
}

export function useBank(): ApiResponse<BankData> {
  const [data, setData] = useState<BankData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch bank data
        const bankResponse = await fetch('/api/bank')
        
        if (!bankResponse.ok) {
          throw new Error(`HTTP error! status: ${bankResponse.status}`)
        }
        
        const bankData = await bankResponse.json()
        setData(bankData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
        setError(errorMessage)
        console.error('Error fetching bank data:', errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchBankData()
  }, [])

  return {
    data: data || undefined,
    error: error || undefined,
    loading
  }
}

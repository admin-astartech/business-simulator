import { useState, useEffect } from 'react'
import { AppSettings, SettingsApiResponse } from '@/types/settings'

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/settings')
      const data: SettingsApiResponse = await response.json()
      
      if (data.success && data.data) {
        setSettings(data.data)
      } else {
        throw new Error(data.error || 'Failed to fetch settings')
      }
    } catch (err) {
      console.error('Error fetching settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      
      const data: SettingsApiResponse = await response.json()
      
      if (data.success && data.data) {
        setSettings(data.data)
        return { success: true, data: data.data }
      } else {
        throw new Error(data.error || 'Failed to update settings')
      }
    } catch (err) {
      console.error('Error updating settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update settings' }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings
  }
}


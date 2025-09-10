import { useState, useEffect } from 'react'

interface Profile {
  id: string
  name: string
  email: string
  role: string
  age: number
  gender: 'male' | 'female'
  department: string
  location: string
  phone: string
  bio: string
  avatarColor: string
  initials: string
  xp: number
}

interface UseProfileReturn {
  profile: Profile | null
  loading: boolean
  error: string | null
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  updateProfile: (updatedProfile: Partial<Profile>) => Promise<void>
  saveProfile: () => Promise<void>
  cancelEdit: () => void
  tempProfile: Profile | null
  setTempProfile: (profile: Profile | null) => void
  fetchProfile: () => Promise<void>
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tempProfile, setTempProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch profile data on mount
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/profile')
      const result = await response.json()
      
      if (result.success) {
        setProfile(result.data)
        setTempProfile(result.data)
      } else {
        setError(result.error || 'Failed to fetch profile')
      }
    } catch (err) {
      setError('Network error while fetching profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!tempProfile) return
    
    const newProfile = { ...tempProfile, ...updatedProfile }
    setTempProfile(newProfile)
  }

  const saveProfile = async () => {
    if (!tempProfile) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempProfile),
      })

      const result = await response.json()

      if (result.success) {
        // Update both profile states with the server response
        setProfile(result.data)
        setTempProfile(result.data)
        setIsEditing(false)
        
        // Force a re-render by updating the active item if we're on profile page
        // This ensures the sidebar updates immediately
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: result.data }))
        }
      } else {
        setError(result.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('Network error while updating profile')
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    if (profile) {
      setTempProfile(profile)
    }
    setIsEditing(false)
  }

  return {
    profile,
    loading,
    error,
    isEditing,
    setIsEditing,
    updateProfile,
    saveProfile,
    cancelEdit,
    tempProfile,
    setTempProfile,
    fetchProfile,
  }
}

import { useState, useEffect } from 'react'
import { Citizen } from '@/types/citizens'

export interface EngagementLog {
  _id: string
  citizenId: string
  citizenName: string
  platform: string
  postId: string
  postContent: string
  engagementType: 'like' | 'comment'
  engagementReason: string
  likedComment?: string | null
  commentContent?: string | null
  commentId?: string | null
  timestamp: string
  createdAt: string
  updatedAt: string
}

interface UseEngagementLogReturn {
  engagements: EngagementLog[]
  citizens: Map<string, Citizen>
  loading: boolean
  error: string | null
  refetch: () => void
  totalCount: number
  hasMore: boolean
}

export function useEngagementLog(platform?: string, limit: number = 50): UseEngagementLogReturn {
  const [engagements, setEngagements] = useState<EngagementLog[]>([])
  const [citizens, setCitizens] = useState<Map<string, Citizen>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [citizensLoaded, setCitizensLoaded] = useState(false)

  const fetchEngagements = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (platform) params.append('platform', platform)
      params.append('limit', limit.toString())
      params.append('offset', '0')

      const response = await fetch(`/api/engagement-log?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setEngagements(data.engagements)
        setTotalCount(data.totalCount)
        setHasMore(data.hasMore)
        
        // Fetch citizens data for avatars
        const citizensResponse = await fetch('/api/citizens')
        const citizensData = await citizensResponse.json()
        
        if (citizensData.success) {
          const citizensMap = new Map<string, Citizen>()
          citizensData.citizens.forEach((citizen: Citizen) => {
            citizensMap.set(citizen.id, citizen)
          })
          setCitizens(citizensMap)
          setCitizensLoaded(true)
        }
      } else {
        setError(data.error || 'Failed to fetch engagement data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEngagements()
  }, [platform, limit])

  const refetch = () => {
    fetchEngagements()
  }

  return {
    engagements,
    citizens,
    loading: loading || !citizensLoaded,
    error,
    refetch,
    totalCount,
    hasMore
  }
}

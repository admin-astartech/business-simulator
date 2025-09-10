import { useState, useEffect } from 'react'
import { SocialPost } from '@/types/socialMedia'

interface UseTikTokPostsReturn {
  posts: SocialPost[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useTikTokPosts(): UseTikTokPostsReturn {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/tiktok-posts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch TikTok posts')
      }
      
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching TikTok posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    
    // Set up auto-refresh every minute (60000ms)
    const interval = setInterval(() => {
      fetchPosts()
    }, 60000)
    
    // Cleanup interval on unmount
    return () => clearInterval(interval)
  }, [])

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  }
}

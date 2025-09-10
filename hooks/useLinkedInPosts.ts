import { useState, useEffect } from 'react'
import { SocialPost } from '@/types/socialMedia'

interface UseLinkedInPostsReturn {
  posts: SocialPost[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLinkedInPosts(): UseLinkedInPostsReturn {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/linkedin-posts')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch LinkedIn posts')
      }
      
      setPosts(data.posts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching LinkedIn posts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts
  }
}

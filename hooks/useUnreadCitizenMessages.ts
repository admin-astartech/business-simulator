import { useState, useEffect } from 'react'

interface UnreadCitizenMessage {
  citizenId: string
  citizenName: string
  unreadCount: number
  lastUnreadAt: Date | string
}

interface UnreadCitizenMessagesResponse {
  success: boolean
  totalUnreadCount: number
  conversationsWithUnread: UnreadCitizenMessage[]
  totalConversations: number
}

export function useUnreadCitizenMessages() {
  const [data, setData] = useState<UnreadCitizenMessagesResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUnreadMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/conversations/unread-citizen-messages')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching unread citizen messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnreadMessages()
    
    // Set up polling to refresh unread counts every 30 seconds
    const interval = setInterval(fetchUnreadMessages, 30000)
    
    // Listen for unread count updates from other components
    const handleUnreadCountsUpdated = () => {
      fetchUnreadMessages()
    }
    
    // Listen for specific conversation updates
    const handleConversationUpdated = (event: CustomEvent) => {
      const { action } = event.detail || {}
      if (action === 'messagesMarkedAsRead') {
        fetchUnreadMessages()
      }
    }
    
    window.addEventListener('unreadCountsUpdated', handleUnreadCountsUpdated)
    window.addEventListener('conversationUpdated', handleConversationUpdated as EventListener)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('unreadCountsUpdated', handleUnreadCountsUpdated)
      window.removeEventListener('conversationUpdated', handleConversationUpdated as EventListener)
    }
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchUnreadMessages,
    totalUnreadCount: data?.totalUnreadCount || 0,
    conversationsWithUnread: data?.conversationsWithUnread || []
  }
}

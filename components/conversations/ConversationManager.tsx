'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Chat,
  Delete,
  Refresh,
  Visibility,
  Business,
  Schedule,
  Circle,
  Mail
} from '@mui/icons-material'
import { ConversationSummary, Conversation } from '@/types/conversation'
import LoadingSpinner from '../ui/LoadingSpinner'
import CitizenChatModal from '../citizens/CitizenChatModal'
import { Citizen } from '@/types/citizens'
import { getCitizenImage } from '@/lib/citizen'

interface ConversationStats {
  totalConversations: number
  totalMessages: number
  averageMessagesPerConversation: number
}

export default function ConversationManager() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [stats, setStats] = useState<ConversationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null)
  const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
    loadStats()
    
    // Listen for unread count updates from other components
    const handleUnreadCountsUpdated = () => {
      loadConversations()
    }
    
    // Listen for specific conversation updates
    const handleConversationUpdated = (event: CustomEvent) => {
      const { citizenId, action } = event.detail || {}
      if (action === 'messagesMarkedAsRead') {
        loadConversations()
      }
    }
    
    // Listen for notification clicks
    const handleNotificationClick = (event: CustomEvent) => {
      const { citizenId, citizenName, type } = event.detail
      
      if (type === 'auto-response') {
        console.log(`📱 Notification clicked: Opening conversation with ${citizenName}`)
        // Open the chat modal for the citizen
        handleOpenChat(citizenId)
      }
    }
    
    window.addEventListener('unreadCountsUpdated', handleUnreadCountsUpdated)
    window.addEventListener('conversationUpdated', handleConversationUpdated as EventListener)
    window.addEventListener('notificationClicked', handleNotificationClick as EventListener)
    
    return () => {
      window.removeEventListener('unreadCountsUpdated', handleUnreadCountsUpdated)
      window.removeEventListener('conversationUpdated', handleConversationUpdated as EventListener)
      window.removeEventListener('notificationClicked', handleNotificationClick as EventListener)
    }
  }, [])

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations')
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Failed to load conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/conversations?stats=true')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleViewConversation = async (citizenId: string) => {
    try {
      const response = await fetch(`/api/conversations?citizenId=${citizenId}`)
      if (response.ok) {
        const conversation = await response.json()
        setSelectedConversation(conversation)
        setViewDialogOpen(true)
      }
    } catch (error) {
      console.error('Failed to load conversation:', error)
    }
  }

  const handleOpenChat = async (citizenId: string) => {
    try {
      // Fetch citizen data
      const response = await fetch('/api/citizens')
      if (response.ok) {
        const data = await response.json()
        const citizen = data.citizens.find((c: Citizen) => c.id === citizenId)
        if (citizen) {
          setSelectedCitizen(citizen)
          setChatModalOpen(true)
        }
      }
    } catch (error) {
      console.error('Failed to load citizen data:', error)
    }
  }

  const handleDeleteConversation = async (citizenId: string) => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      setDeletingConversationId(citizenId)
      try {
        const response = await fetch(`/api/conversations?citizenId=${citizenId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Optimistically remove the conversation from local state for immediate UI update
          setConversations(prev => prev.filter(conv => conv.citizenId !== citizenId))
          
          // Refetch data to ensure consistency
          await Promise.all([loadConversations(), loadStats()])
          
          // Show success feedback (optional - could be a toast notification)
          console.log('Conversation deleted successfully')
        } else {
          // Handle API error
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to delete conversation:', errorData.error || 'Unknown error')
          alert(`Failed to delete conversation: ${errorData.error || 'Unknown error'}`)
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error)
        alert('Failed to delete conversation. Please try again.')
      } finally {
        setDeletingConversationId(null)
      }
    }
  }


  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString()
  }

  const formatLastSeen = (lastSeen: string | undefined) => {
    if (!lastSeen) return 'Never'
    const dateObj = new Date(lastSeen)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return dateObj.toLocaleDateString()
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <LoadingSpinner message="Loading conversations..." />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Messages
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            loadConversations()
            loadStats()
          }}
        >
          Refresh
        </Button>
      </Box>


      {/* Conversations List */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Conversations ({conversations.length})
      </Typography>

      {conversations.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Chat sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No conversations yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start chatting with citizens to see conversations here
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {conversations.map((conversation, index) => (
              <div key={conversation._id}>
                <ListItem
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    py: 2,
                    px: 3
                  }}
                >
                  {/* Header with citizen info and actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    width: '100%',
                    mb: 2
                  }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Image
                        className='mr-2'
                        src={getCitizenImage(conversation.citizenName, conversation.citizenGender)} alt={conversation.citizenName} width={32} height={32} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {conversation.citizenName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                          <Circle 
                            sx={{ 
                              fontSize: 8, 
                              color: conversation.isOnline ? 'success.main' : 'text.disabled',
                              mr: 0.5
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: conversation.isOnline ? 'success.main' : 'text.disabled',
                              fontWeight: 'bold'
                            }}
                          >
                            {conversation.isOnline ? 'Online' : `Last seen ${formatLastSeen(conversation.lastSeen)}`}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Business sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {conversation.citizenRole} at {conversation.citizenCompany}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Schedule sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          Last message: {formatDate(conversation.lastMessageAt)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Action buttons */}
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      <Button
                        size="small"
                        startIcon={<Chat />}
                        onClick={() => handleOpenChat(conversation.citizenId)}
                        variant="contained"
                        color="primary"
                      >
                        Chat
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewConversation(conversation.citizenId)}
                        variant="outlined"
                      >
                        Transcript
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={deletingConversationId === conversation.citizenId ? (
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              border: '2px solid currentColor',
                              borderTop: '2px solid transparent',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}
                          />
                        ) : (
                          <Delete />
                        )}
                        onClick={() => handleDeleteConversation(conversation.citizenId)}
                        variant="outlined"
                        disabled={deletingConversationId === conversation.citizenId}
                      >
                        {deletingConversationId === conversation.citizenId ? 'Deleting...' : 'Delete'}
                      </Button>
                    </Box>
                  </Box>

                  {/* Message preview and status chips */}
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ 
                      mb: 2, 
                      backgroundColor: conversation.hasUnreadCitizenMessage ? 'warning.50' : 'grey.50',
                      p: 2,
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: conversation.hasUnreadCitizenMessage ? 'warning.200' : 'grey.200',
                      position: 'relative'
                    }}>
                      {conversation.hasUnreadCitizenMessage && (
                        <Box sx={{ 
                          position: 'absolute', 
                          top: -8, 
                          right: -8,
                          backgroundColor: 'warning.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 12,
                          height: 12,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontStyle: 'italic',
                          color: conversation.hasUnreadCitizenMessage ? 'warning.800' : 'text.secondary',
                          fontWeight: conversation.hasUnreadCitizenMessage ? 'bold' : 'normal'
                        }}
                      >
                        "{conversation.preview}"
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 1
                    }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${conversation.totalMessages} messages`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        {conversation.hasUnreadCitizenMessage && (
                          <Chip
                            icon={<Mail />}
                            label="Unread"
                            size="small"
                            color="warning"
                            variant="filled"
                            sx={{ fontWeight: 'bold' }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < conversations.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      )}

      {/* View Conversation Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Conversation with {selectedConversation?.citizenName}
        </DialogTitle>
        <DialogContent>
          {selectedConversation && (
            <List>
              {selectedConversation.messages.map((message, index) => (
                <div key={message.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {message.sender === 'user' ? 'You' : selectedConversation.citizenName}
                          </Typography>
                          <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                            {formatDate(message.timestamp)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontStyle: message.isNoResponse ? 'italic' : 'normal',
                            color: message.isNoResponse ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {message.isNoResponse ? '...' : message.text}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < selectedConversation.messages.length - 1 && <Divider />}
                </div>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Citizen Chat Modal */}
      {selectedCitizen && (
        <CitizenChatModal
          open={chatModalOpen}
          onClose={() => {
            setChatModalOpen(false)
            setSelectedCitizen(null)
          }}
          citizen={selectedCitizen}
        />
      )}
    </Box>
  )
}

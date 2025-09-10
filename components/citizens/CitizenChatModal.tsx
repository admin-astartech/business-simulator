'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Avatar,
  Paper,
  IconButton,
  Divider,
  Tooltip,
  Chip
} from '@mui/material'
import { Send, Close, Refresh, Delete } from '@mui/icons-material'
import { Citizen } from '@/types/citizens'
import { getCitizenImage } from '@/lib/citizen'
import Image from 'next/image'

interface CitizenChatModalProps {
  open: boolean
  onClose: () => void
  citizen: Citizen
}

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'citizen'
  timestamp: Date | string
  isNoResponse?: boolean
  isRead?: boolean
  readAt?: Date | string
  isAutoResponse?: boolean
}

export default function CitizenChatModal({ open, onClose, citizen }: CitizenChatModalProps) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [unreadMessages, setUnreadMessages] = useState<string[]>([])
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  // Load conversation history when modal opens
  useEffect(() => {
    if (open && citizen) {
      loadConversationHistory()
    }
  }, [open, citizen])

  // Auto-mark citizen messages as read when they come into view
  useEffect(() => {
    if (messages.length > 0) {
      const unreadCitizenMessages = messages
        .filter(msg => msg.sender === 'citizen' && !msg.isRead && msg.text !== 'Typing...')
        .map(msg => msg.id)
      
      if (unreadCitizenMessages.length > 0) {
        // Mark as read after a short delay to simulate reading
        const timer = setTimeout(() => {
          markMessagesAsRead(unreadCitizenMessages)
        }, 1000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [messages])

  const loadConversationHistory = async () => {
    setIsLoadingHistory(true)
    setHasLoadedHistory(false)
    try {
      const response = await fetch(`/api/conversations?citizenId=${citizen.id}`)
      if (response.ok) {
        const conversation = await response.json()
        if (conversation && conversation.messages && conversation.messages.length > 0) {
          setMessages(conversation.messages)
          setLastUpdated(new Date(conversation.updatedAt))
          setHasLoadedHistory(true)
          
          // Check if the latest message is from a citizen and is unread
          const latestMessage = conversation.messages[conversation.messages.length - 1]
          if (latestMessage.sender === 'citizen' && !latestMessage.isRead && latestMessage.text !== 'Typing...') {
            // Automatically mark the latest unread citizen message as read
            markMessagesAsRead([latestMessage.id])
          }
        } else {
          // No previous conversation, start fresh
          setMessages([])
          setLastUpdated(null)
          setHasLoadedHistory(true)
        }
      } else {
        // No conversation found, start fresh
        setMessages([])
        setLastUpdated(null)
        setHasLoadedHistory(true)
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error)
      // On error, start fresh but still mark as loaded
      setMessages([])
      setLastUpdated(null)
      setHasLoadedHistory(true)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const handleSendMessage = async () => {
    if (message.trim() && !isLoading) {
      setIsLoading(true)
      
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, newMessage])
      const userMessage = message.trim()
      setMessage('')
      
      // Only add loading indicator if citizen is online
      if (citizen.isOnline) {
        const loadingMessage: ChatMessage = {
          id: 'loading',
          text: 'Typing...',
          sender: 'citizen',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, loadingMessage])
      }
      
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            citizen: citizen,
            conversationHistory: messages // Server will load full history from MongoDB
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to get response')
        }

        const data = await response.json()
        
        // Remove loading message (if it exists)
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => msg.id !== 'loading')
          
          // Check if citizen chose not to respond or is offline
          if (data.noResponse) {
            // If citizen is offline, don't add any response message at all
            if (data.isOffline) {
              return withoutLoading // Just return without adding any citizen message
            }
            
            // If citizen chose not to respond (but is online), show the dots
            const noResponseMessage: ChatMessage = {
              id: Date.now().toString(),
              text: '...',
              sender: 'citizen',
              timestamp: new Date(),
              isNoResponse: true
            }
            return [...withoutLoading, noResponseMessage]
          }
          
          // Add actual response
          const citizenResponse: ChatMessage = {
            id: Date.now().toString(),
            text: data.response,
            sender: 'citizen',
            timestamp: new Date()
          }
          return [...withoutLoading, citizenResponse]
        })
      } catch (error) {
        console.error('Error getting AI response:', error)
        
        // Remove loading message (if it exists) and add error response
        setMessages(prev => {
          const withoutLoading = prev.filter(msg => msg.id !== 'loading')
          const errorResponse: ChatMessage = {
            id: Date.now().toString(),
            text: "I'm sorry, I'm having trouble responding right now. Could you try again?",
            sender: 'citizen',
            timestamp: new Date()
          }
          return [...withoutLoading, errorResponse]
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatLastSeen = (lastSeen: string) => {
    const lastSeenDate = new Date(lastSeen)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) {
      return 'just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours === 1 ? '' : 's'} ago`
    } else if (diffInMinutes < 10080) { // Less than 7 days
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days === 1 ? '' : 's'} ago`
    } else {
      // More than 7 days, show the actual date
      return lastSeenDate.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        year: lastSeenDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      })
    }
  }

  const markMessagesAsRead = async (messageIds: string[]) => {
    try {
      const response = await fetch('/api/conversations/mark-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          citizenId: citizen.id,
          messageIds: messageIds
        })
      })

      if (response.ok) {
        // Update local state to reflect read status
        setMessages(prev => prev.map(msg => 
          messageIds.includes(msg.id) 
            ? { ...msg, isRead: true, readAt: new Date() }
            : msg
        ))
        
        // Remove from unread messages
        setUnreadMessages(prev => prev.filter(id => !messageIds.includes(id)))
        
        // Trigger refetch of unread counts across the app
        window.dispatchEvent(new CustomEvent('unreadCountsUpdated'))
        
        // Also trigger a more specific event for conversation updates
        window.dispatchEvent(new CustomEvent('conversationUpdated', { 
          detail: { citizenId: citizen.id, action: 'messagesMarkedAsRead' } 
        }))
        
        // Add a small delay and trigger again to ensure all components get the update
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('unreadCountsUpdated'))
        }, 100)
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error)
    }
  }

  const handleClearConversation = async () => {
    setIsClearing(true)
    try {
      const response = await fetch('/api/conversations/clear', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          citizenId: citizen.id
        })
      })

      if (response.ok) {
        // Clear local messages
        setMessages([])
        setUnreadMessages([])
        setHasLoadedHistory(false)
        setLastUpdated(null)
        setShowClearDialog(false)
      } else {
        console.error('Failed to clear conversation')
      }
    } catch (error) {
      console.error('Error clearing conversation:', error)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: citizen.avatarColor.replace('bg-', '').replace('-500', '.main'),
              mr: 2,
              width: 40,
              height: 40
            }}
          >
            <Image src={getCitizenImage(citizen.name, citizen.gender)} alt={citizen.name} width={40} height={40} />
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="div">
                Chat with {citizen.name}
              </Typography>
              {/* Online/Offline Status Indicator */}
              <Chip
                label={citizen.isOnline ? '🟢 Online' : '⚫ Offline'}
                size="small"
                color={citizen.isOnline ? 'success' : 'default'}
                variant="filled"
                sx={{
                  bgcolor: citizen.isOnline ? '#4caf50' : '#9e9e9e',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem'
                }}
              />
              {hasLoadedHistory && messages.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${messages.length} messages`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {(() => {
                    const unreadCount = messages.filter(msg => 
                      msg.sender === 'citizen' && 
                      !msg.isRead && 
                      !msg.isAutoResponse && 
                      msg.text !== 'Typing...'
                    ).length
                    return unreadCount > 0 ? (
                      <Chip
                        label={`${unreadCount} unread`}
                        size="small"
                        color="warning"
                        variant="filled"
                        sx={{ 
                          bgcolor: 'warning.main',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    ) : null
                  })()}
                </Box>
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {citizen.role} at {citizen.company}
            </Typography>
            {citizen.lastSeen && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                {citizen.isOnline ? 'Online now' : `Last seen ${formatLastSeen(citizen.lastSeen)}`}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh conversation history">
            <IconButton 
              onClick={loadConversationHistory} 
              size="small"
              disabled={isLoadingHistory}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
          {messages.length > 0 && (
            <Tooltip title="Clear conversation">
              <IconButton 
                onClick={() => setShowClearDialog(true)} 
                size="small"
                disabled={isClearing}
                sx={{ color: 'error.main' }}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          )}
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        p: 0,
        height: '100%'
      }}>
        {/* Messages Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {isLoadingHistory && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  },
                  mb: 2
                }}
              />
              <Typography variant="body2">
                Loading conversation history...
              </Typography>
            </Box>
          )}
          {!isLoadingHistory && hasLoadedHistory && messages.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              flexDirection: 'column',
              textAlign: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" gutterBottom>
                Start a conversation with {citizen.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {citizen.role} at {citizen.company}
              </Typography>
              {/* Online/Offline Status in Empty State */}
              <Chip
                label={citizen.isOnline ? '🟢 Currently Online' : '⚫ Currently Offline'}
                size="medium"
                color={citizen.isOnline ? 'success' : 'default'}
                variant="filled"
                sx={{
                  bgcolor: citizen.isOnline ? '#4caf50' : '#9e9e9e',
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {citizen.isOnline 
                  ? `${citizen.name} is currently online and may respond quickly. All messages will be saved automatically.`
                  : `${citizen.name} is currently offline. They may not respond immediately, but all messages will be saved automatically.`
                }
              </Typography>
            </Box>
          )}
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Tooltip 
                title={msg.isNoResponse ? "Citizen chose not to respond to this message" : ""}
                placement="top"
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: msg.sender === 'user' ? 'primary.main' : 'grey.100',
                    color: msg.sender === 'user' ? 'white' : 'text.primary',
                    borderRadius: msg.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    opacity: msg.isNoResponse ? 0.5 : 1,
                    border: msg.isNoResponse ? '1px dashed #ccc' : 'none',
                    cursor: msg.isNoResponse ? 'help' : 'default'
                  }}
                >
                  <Typography 
                    variant="body1"
                    sx={{
                      fontStyle: msg.isNoResponse ? 'italic' : 'normal',
                      color: msg.isNoResponse ? 'text.secondary' : 'inherit'
                    }}
                  >
                    {msg.isNoResponse ? '...' : msg.text}
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mt: 0.5
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7,
                        fontSize: '0.75rem'
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </Typography>
                    {msg.sender === 'user' && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 1
                      }}>
                        {msg.isRead ? (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'primary.main'
                          }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', mr: 0.5 }}>
                              Read
                            </Typography>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              bgcolor: 'primary.main' 
                            }} />
                          </Box>
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'text.secondary'
                          }}>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem', mr: 0.5 }}>
                              Delivered
                            </Typography>
                            <Box sx={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              bgcolor: 'text.secondary' 
                            }} />
                          </Box>
                        )}
                      </Box>
                    )}
                    {msg.sender === 'citizen' && !msg.isRead && msg.text !== 'Typing...' && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 1,
                        color: 'warning.main'
                      }}>
                        <Typography variant="caption" sx={{ 
                          fontSize: '0.7rem', 
                          mr: 0.5
                        }}>
                          Unread
                        </Typography>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'warning.main',
                          border: '1px solid',
                          borderColor: 'warning.dark'
                        }} />
                      </Box>
                    )}
                    {msg.sender === 'citizen' && msg.isRead && msg.text !== 'Typing...' && (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        ml: 1,
                        color: 'success.main'
                      }}>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', mr: 0.5 }}>
                          Read
                        </Typography>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: 'success.main' 
                        }} />
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Tooltip>
            </Box>
          ))}
        </Box>

        <Divider />

        {/* Message Input */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              variant="outlined"
              size="small"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px'
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              sx={{
                borderRadius: '50%',
                minWidth: '48px',
                height: '48px',
                p: 0
              }}
            >
              {isLoading ? (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid #fff',
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
                <Send />
              )}
            </Button>
          </Box>
        </Box>
      </DialogContent>

      {/* Clear Conversation Confirmation Dialog */}
      <Dialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Clear Conversation
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all messages with {citizen.name}? 
            This action cannot be undone and will permanently delete the conversation history.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowClearDialog(false)}
            disabled={isClearing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearConversation}
            color="error"
            variant="contained"
            disabled={isClearing}
          >
            {isClearing ? 'Clearing...' : 'Clear Conversation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

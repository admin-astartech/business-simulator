import { NextResponse } from 'next/server'
import { ConversationService } from '@/lib/conversationService'
import { ChatMessage } from '@/types/conversation'

// Helper function to determine if conversation has unread citizen messages
// Returns false if the last citizen message was an auto-response
function hasUnreadCitizenMessages(messages: ChatMessage[]): { hasUnread: boolean; unreadCount: number } {
  // Find the last user message index
  let lastUserMessageIndex = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === 'user') {
      lastUserMessageIndex = i
      break
    }
  }
  
  // Find the last citizen message index
  let lastCitizenMessageIndex = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].sender === 'citizen') {
      lastCitizenMessageIndex = i
      break
    }
  }
  
  // Filter unread citizen messages (excluding auto-responses)
  const unreadCitizenMessages = messages.filter((msg, index) => 
    msg.sender === 'citizen' && 
    !msg.isRead && 
    !msg.isAutoResponse && 
    (lastUserMessageIndex === -1 || index > lastUserMessageIndex)
  )
  
  // If the last citizen message was an auto-response, don't mark as unread
  const hasUnread = unreadCitizenMessages.length > 0 && 
    (lastCitizenMessageIndex === -1 || !messages[lastCitizenMessageIndex].isAutoResponse)
  
  return {
    hasUnread,
    unreadCount: unreadCitizenMessages.length
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    // Get all conversations
    const conversations = await ConversationService.getAllConversations()
    
    let totalUnreadCount = 0
    const conversationsWithUnread = []

    // Check each conversation for unread citizen messages since last user message
    for (const conversation of conversations) {
      const fullConversation = await ConversationService.getConversation(conversation.citizenId)
      if (!fullConversation) continue

      // Use helper function to check for unread messages
      const { hasUnread, unreadCount } = hasUnreadCitizenMessages(fullConversation.messages)

      if (hasUnread) {
        // Get the actual unread messages for timestamp
        let lastUserMessageIndex = -1
        for (let i = fullConversation.messages.length - 1; i >= 0; i--) {
          if (fullConversation.messages[i].sender === 'user') {
            lastUserMessageIndex = i
            break
          }
        }
        
        const unreadCitizenMessages = fullConversation.messages.filter((msg, index) => 
          msg.sender === 'citizen' && 
          !msg.isRead && 
          !msg.isAutoResponse && 
          (lastUserMessageIndex === -1 || index > lastUserMessageIndex)
        )

        totalUnreadCount += unreadCount
        conversationsWithUnread.push({
          citizenId: fullConversation.citizenId,
          citizenName: fullConversation.citizenName,
          unreadCount: unreadCount,
          lastUnreadAt: unreadCitizenMessages[unreadCitizenMessages.length - 1].timestamp
        })
      }
    }

    return NextResponse.json({
      success: true,
      totalUnreadCount,
      conversationsWithUnread,
      totalConversations: conversations.length
    })

  } catch (error) {
    console.error('Error fetching unread citizen messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread citizen messages' },
      { status: 500 }
    )
  }
}

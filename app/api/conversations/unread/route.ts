import { NextResponse } from 'next/server'
import { ConversationService } from '@/lib/conversationService'

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
    
    // Filter conversations that have unread messages from citizens
    const conversationsWithUnread = conversations.filter(conversation => {
      // We need to get the full conversation to check for unread messages
      return true // We'll filter this properly in the next step
    })

    // Get detailed conversation data for each conversation with unread messages
    const detailedConversations = await Promise.all(
      conversationsWithUnread.map(async (conversation) => {
        const fullConversation = await ConversationService.getConversation(conversation.citizenId)
        if (!fullConversation) return null

        // Find unread messages from users (messages that are not read and from user)
        const unreadMessages = fullConversation.messages.filter(msg => 
          msg.sender === 'user' && 
          !msg.isRead
        )

        if (unreadMessages.length === 0) return null

        return {
          citizenId: fullConversation.citizenId,
          citizenName: fullConversation.citizenName,
          citizenRole: fullConversation.citizenRole,
          citizenCompany: fullConversation.citizenCompany,
          unreadCount: unreadMessages.length,
          unreadMessages: unreadMessages.map(msg => ({
            id: msg.id,
            text: msg.text,
            timestamp: msg.timestamp,
            isNoResponse: msg.isNoResponse
          })),
          lastUnreadAt: unreadMessages[unreadMessages.length - 1].timestamp,
          totalMessages: fullConversation.totalMessages
        }
      })
    )

    // Filter out null results (conversations with no unread messages)
    const conversationsWithUnreadMessages = detailedConversations.filter(conv => conv !== null)

    return NextResponse.json({
      success: true,
      totalConversations: conversations.length,
      conversationsWithUnread: conversationsWithUnreadMessages.length,
      conversations: conversationsWithUnreadMessages
    })

  } catch (error) {
    console.error('Error fetching unread messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch unread messages' },
      { status: 500 }
    )
  }
}

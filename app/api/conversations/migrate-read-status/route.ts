import { NextResponse } from 'next/server'
import { ConversationService } from '@/lib/conversationService'
import { getDatabase } from '@/lib/mongodb'

export async function POST() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    console.log('🔄 Starting migration of message read status...')
    
    // Get all conversations
    const conversations = await ConversationService.getAllConversations()
    let totalUpdated = 0
    let totalMessages = 0

    for (const conversation of conversations) {
      const fullConversation = await ConversationService.getConversation(conversation.citizenId)
      if (!fullConversation) continue

      let hasUpdates = false
      const updatedMessages = fullConversation.messages.map((message, index) => {
        totalMessages++
        
        // Skip if message already has isRead property
        if (message.isRead !== undefined) {
          return message
        }

        hasUpdates = true
        totalUpdated++

        // Set default read status based on sender
        if (message.sender === 'user') {
          // User messages: check if there's a citizen response after this message
          const hasCitizenResponseAfter = fullConversation.messages
            .slice(index + 1)
            .some(msg => msg.sender === 'citizen' && !msg.isNoResponse)
          
          return {
            ...message,
            isRead: hasCitizenResponseAfter, // Read if citizen responded after this message
            readAt: hasCitizenResponseAfter ? new Date() : undefined
          }
        } else {
          // Citizen messages: default to unread
          return {
            ...message,
            isRead: false,
            readAt: undefined
          }
        }
      })

      // Save updated conversation if there were changes
      if (hasUpdates) {
        await ConversationService.saveConversation(
          fullConversation.citizenId,
          fullConversation.citizenName,
          fullConversation.citizenRole,
          fullConversation.citizenCompany,
          updatedMessages
        )
        console.log(`✅ Updated conversation for ${fullConversation.citizenName}`)
      }
    }

    console.log(`🎯 Migration complete: Updated ${totalUpdated} messages out of ${totalMessages} total messages`)

    return NextResponse.json({
      success: true,
      message: 'Message read status migration completed',
      totalMessages,
      updatedMessages: totalUpdated,
      conversationsProcessed: conversations.length
    })

  } catch (error) {
    console.error('❌ Error migrating message read status:', error)
    return NextResponse.json(
      { error: 'Failed to migrate message read status' },
      { status: 500 }
    )
  }
}

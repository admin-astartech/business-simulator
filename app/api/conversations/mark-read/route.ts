import { NextRequest, NextResponse } from 'next/server'
import { ConversationService } from '@/lib/conversationService'

export async function POST(request: NextRequest) {
  try {
    const { citizenId, messageIds } = await request.json()
    
    if (!citizenId) {
      return NextResponse.json(
        { error: 'citizenId is required' },
        { status: 400 }
      )
    }

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { error: 'messageIds array is required' },
        { status: 400 }
      )
    }

    // Get the current conversation
    const conversation = await ConversationService.getConversation(citizenId)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Update the read status for the specified messages
    const updatedMessages = conversation.messages.map(message => {
      if (messageIds.includes(message.id)) {
        return {
          ...message,
          isRead: true,
          readAt: new Date()
        }
      }
      return message
    })

    // Save the updated conversation
    await ConversationService.saveConversation(
      conversation.citizenId,
      conversation.citizenName,
      conversation.citizenRole,
      conversation.citizenCompany,
      updatedMessages
    )

    return NextResponse.json({
      success: true,
      updatedCount: messageIds.length,
      message: `Successfully marked ${messageIds.length} messages as read`
    })

  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: 'Failed to mark messages as read' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { citizenId, messageId, isRead } = await request.json()
    
    if (!citizenId || !messageId) {
      return NextResponse.json(
        { error: 'citizenId and messageId are required' },
        { status: 400 }
      )
    }

    if (typeof isRead !== 'boolean') {
      return NextResponse.json(
        { error: 'isRead must be a boolean value' },
        { status: 400 }
      )
    }

    // Get the current conversation
    const conversation = await ConversationService.getConversation(citizenId)
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }

    // Update the read status for the specified message
    const updatedMessages = conversation.messages.map(message => {
      if (message.id === messageId) {
        return {
          ...message,
          isRead,
          readAt: isRead ? new Date() : undefined
        }
      }
      return message
    })

    // Save the updated conversation
    await ConversationService.saveConversation(
      conversation.citizenId,
      conversation.citizenName,
      conversation.citizenRole,
      conversation.citizenCompany,
      updatedMessages
    )

    return NextResponse.json({
      success: true,
      message: `Message ${isRead ? 'marked as read' : 'marked as unread'}`
    })

  } catch (error) {
    console.error('Error updating message read status:', error)
    return NextResponse.json(
      { error: 'Failed to update message read status' },
      { status: 500 }
    )
  }
}

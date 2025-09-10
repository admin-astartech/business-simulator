import { NextRequest, NextResponse } from 'next/server'
import { ConversationService } from '@/lib/conversationService'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const citizenId = searchParams.get('citizenId')
    const stats = searchParams.get('stats') === 'true'
    const recent = searchParams.get('recent') === 'true'

    if (stats) {
      // Return conversation statistics
      const conversationStats = await ConversationService.getConversationStats()
      return NextResponse.json(conversationStats)
    }

    if (citizenId) {
      // Return specific conversation
      const conversation = await ConversationService.getConversation(citizenId)
      if (!conversation) {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(conversation)
    }

    if (recent) {
      // Return recent conversations (last 5 minutes) for notification checking
      const conversations = await ConversationService.getRecentConversations()
      return NextResponse.json(conversations)
    }

    // Return all conversations
    const conversations = await ConversationService.getAllConversations()
    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const citizenId = searchParams.get('citizenId')
    const archive = searchParams.get('archive') === 'true'

    if (!citizenId) {
      return NextResponse.json(
        { error: 'Citizen ID is required' },
        { status: 400 }
      )
    }

    if (archive) {
      const success = await ConversationService.archiveConversation(citizenId)
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to archive conversation' },
          { status: 500 }
        )
      }
      return NextResponse.json({ message: 'Conversation archived successfully' })
    } else {
      const success = await ConversationService.deleteConversation(citizenId)
      if (!success) {
        return NextResponse.json(
          { error: 'Failed to delete conversation' },
          { status: 500 }
        )
      }
      return NextResponse.json({ message: 'Conversation deleted successfully' })
    }
  } catch (error) {
    console.error('Error managing conversation:', error)
    return NextResponse.json(
      { error: 'Failed to manage conversation' },
      { status: 500 }
    )
  }
}

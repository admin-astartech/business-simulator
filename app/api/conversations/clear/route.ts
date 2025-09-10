import { NextRequest, NextResponse } from 'next/server'
import { ConversationService } from '@/lib/conversationService'

export async function DELETE(request: NextRequest) {
  try {
    const { citizenId } = await request.json()
    
    if (!citizenId) {
      return NextResponse.json(
        { error: 'Citizen ID is required' },
        { status: 400 }
      )
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    // Delete the conversation from the database
    const deleted = await ConversationService.deleteConversation(citizenId)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Conversation not found or could not be deleted' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Conversation cleared successfully'
    })

  } catch (error) {
    console.error('Error clearing conversation:', error)
    return NextResponse.json(
      { error: 'Failed to clear conversation' },
      { status: 500 }
    )
  }
}

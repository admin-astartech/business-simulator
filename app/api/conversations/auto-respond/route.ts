import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ConversationService } from '@/lib/conversationService'
import { ChatMessage } from '@/types/conversation'
import { getDatabase } from '@/lib/mongodb'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { citizenIds } = await request.json()
    
    if (!citizenIds || !Array.isArray(citizenIds) || citizenIds.length === 0) {
      return NextResponse.json(
        { error: 'citizenIds array is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' },
        { status: 500 }
      )
    }

    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    const results = []
    
    for (const citizenId of citizenIds) {
      try {
        // Get citizen data
        const citizen = await citizens.findOne({ id: citizenId })
        if (!citizen) {
          results.push({ citizenId, success: false, error: 'Citizen not found' })
          continue
        }

        // Only process if citizen is online
        if (!citizen.isOnline) {
          results.push({ citizenId, success: false, error: 'Citizen is offline' })
          continue
        }

        // Get conversation for this citizen
        const conversation = await ConversationService.getConversation(citizenId)
        if (!conversation) {
          results.push({ citizenId, success: false, error: 'No conversation found' })
          continue
        }

        // Check if the last message in the conversation was sent by user and is unread
        const lastMessage = conversation.messages[conversation.messages.length - 1]
        
        if (!lastMessage) {
          results.push({ citizenId, success: true, message: 'No messages in conversation' })
          continue
        }

        // Only auto-respond if the last message was from user and is unread
        if (lastMessage.sender !== 'user' || lastMessage.isRead) {
          results.push({ citizenId, success: true, message: 'Last message was not an unread user message' })
          continue
        }

        // Find all unread user messages for context
        const unreadMessages = conversation.messages.filter(msg => 
          msg.sender === 'user' && !msg.isRead
        )

        if (unreadMessages.length === 0) {
          results.push({ citizenId, success: true, message: 'No unread messages to respond to' })
          continue
        }

        // Use the last message (which we know is an unread user message)
        const latestUnreadMessage = lastMessage
        
        // Create a system prompt for auto-response
        const systemPrompt = `You are ${citizen.name}, a ${citizen.role} at ${citizen.company}. You are ${citizen.age} years old.

Your personality traits: ${citizen.personality.traits.join(', ')}
Your work style: ${citizen.personality.workStyle}
Your social style: ${citizen.personality.socialStyle}
Your motivation: ${citizen.personality.motivation}
Your interests: ${citizen.personality.interests.join(', ')}
Your likes: ${citizen.personality.likes.join(', ')}
Your dislikes: ${citizen.personality.dislikes.join(', ')}
Your values: ${citizen.personality.values.join(', ')}
Your beliefs: ${citizen.personality.beliefs.join(', ')}
Your fears: ${citizen.personality.fears.join(', ')}
Your aspirations: ${citizen.personality.aspirations.join(', ')}
Your goals: ${citizen.personality.goals.join(', ')}
Your challenges: ${citizen.personality.challenges.join(', ')}
Your strengths: ${citizen.personality.strengths.join(', ')}
Your weaknesses: ${citizen.personality.weaknesses.join(', ')}
Your preferences: ${citizen.personality.preferences.join(', ')}
Your behaviors: ${citizen.personality.behaviors.join(', ')}
Your patterns: ${citizen.personality.patterns.join(', ')}
Your triggers: ${citizen.personality.triggers.join(', ')}
Your reactions: ${citizen.personality.reactions.join(', ')}
Your responses: ${citizen.personality.responses.join(', ')}
Your motivations: ${citizen.personality.motivations.join(', ')}
Your frustrations: ${citizen.personality.frustrations.join(', ')}
Your habits: ${citizen.personality.habits.join(', ')}
Your stress triggers: ${citizen.personality.stressTriggers.join(', ')}

Personality summary: ${citizen.personality.summary}

IMPORTANT AUTO-RESPONSE CONTEXT:
You are responding to a message that was sent while you were offline. You just came back online and noticed you have unread messages. 

AUTO-RESPONSE GUIDELINES:
1. Acknowledge that you were offline and just came back
2. Be apologetic for the delay in response
3. Respond naturally to the message content
4. Keep it brief but engaging (1-2 sentences typically)
5. Show that you're back and available now
6. Be authentic to your personality
7. Don't mention that this is an automated response

CONVERSATION CONTEXT:
You have had ${conversation.messages.length} previous messages in this conversation. The user sent you a message while you were offline, and you're now responding to it.

The unread message you're responding to: "${latestUnreadMessage.text}"

Respond naturally as if you just came back online and saw this message.`

        // Prepare conversation history for context (excluding the unread message we're responding to)
        const messagesForContext = conversation.messages
          .filter(msg => msg.id !== latestUnreadMessage.id)
          .map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: msg.text
          }))

        const messages = [
          { role: 'system' as const, content: systemPrompt },
          ...messagesForContext,
          { role: 'user' as const, content: latestUnreadMessage.text }
        ]

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 150,
          temperature: 0.8,
        })

        const response = completion.choices[0]?.message?.content || 'Sorry for the delay! I was offline but I\'m back now.'

        // Create the auto-response message
        const autoResponseMessage: ChatMessage = {
          id: Date.now().toString(),
          text: response.trim(),
          sender: 'citizen',
          timestamp: new Date(),
          isRead: false,
          readAt: undefined,
          isAutoResponse: true
        }

        // Mark the unread user message as read
        const updatedMessages = conversation.messages.map(msg => {
          if (msg.id === latestUnreadMessage.id) {
            return {
              ...msg,
              isRead: true,
              readAt: new Date()
            }
          }
          return msg
        })

        // Add the auto-response message
        updatedMessages.push(autoResponseMessage)

        // Save the updated conversation
        await ConversationService.saveConversation(
          citizen.id,
          citizen.name,
          citizen.role,
          citizen.company,
          updatedMessages
        )

        results.push({ 
          citizenId, 
          success: true, 
          message: 'Auto-response sent successfully',
          response: response.trim(),
          unreadCount: unreadMessages.length,
          citizenName: citizen.name,
          citizenRole: citizen.role,
          citizenCompany: citizen.company
        })

      } catch (error) {
        console.error(`Error processing auto-response for citizen ${citizenId}:`, error)
        results.push({ 
          citizenId, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalProcessed = results.length

    return NextResponse.json({
      success: true,
      totalProcessed,
      successCount,
      results
    })

  } catch (error) {
    console.error('Error in auto-respond endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to process auto-responses' },
      { status: 500 }
    )
  }
}

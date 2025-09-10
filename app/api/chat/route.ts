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
    const { message, citizen, conversationHistory } = await request.json()

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

    // Check if the citizen is online before allowing them to respond
    try {
      const db = await getDatabase()
      const citizens = db.collection('citizens')
      const citizenData = await citizens.findOne({ id: citizen.id })
      
      if (!citizenData) {
        return NextResponse.json(
          { error: 'Citizen not found' },
          { status: 404 }
        )
      }

      // If citizen is offline, they cannot respond
      if (!citizenData.isOnline) {
        // Still save the user message but don't generate a response
        // User messages are unread when citizen is offline
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          text: message,
          sender: 'user',
          timestamp: new Date(),
          isRead: false, // User messages are unread when citizen is offline
          readAt: undefined
        }

        // Load conversation history to save the user message
        let fullConversationHistory = conversationHistory || []
        try {
          const existingConversation = await ConversationService.getConversation(citizen.id)
          if (existingConversation && existingConversation.messages) {
            fullConversationHistory = existingConversation.messages
          }
        } catch (dbError) {
          console.error('Failed to load conversation history from MongoDB:', dbError)
        }

        // Save the user message even though citizen is offline
        try {
          const updatedMessages = [...fullConversationHistory, userMessage]
          await ConversationService.saveConversation(
            citizen.id,
            citizen.name,
            citizen.role,
            citizen.company,
            updatedMessages
          )
        } catch (dbError) {
          console.error('Failed to save conversation to MongoDB:', dbError)
        }

        // Return no response at all - just save the user message
        return NextResponse.json({ 
          response: null, 
          noResponse: true,
          isOffline: true
        })
      }
    } catch (dbError) {
      console.error('Failed to check citizen online status:', dbError)
      // Continue with the request if we can't check online status
      // This ensures the chat still works even if there's a database issue
    }

    // Load complete conversation history from MongoDB
    let fullConversationHistory = conversationHistory || []
    try {
      const existingConversation = await ConversationService.getConversation(citizen.id)
      if (existingConversation && existingConversation.messages) {
        // Use the complete conversation history from the database
        fullConversationHistory = existingConversation.messages
      }
    } catch (dbError) {
      console.error('Failed to load conversation history from MongoDB:', dbError)
      // Continue with the provided conversation history if database fetch fails
    }

    // Create a system prompt based on the citizen's personality
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

IMPORTANT RESPONSE GUIDELINES:
1. You are a real person with your own personality, not an AI assistant
2. You can choose to respond or not respond based on your personality and the situation
3. Consider the message quality, relevance, and appropriateness before responding
4. You may ignore messages that are:
   - Offensive, inappropriate, or disrespectful
   - Completely unrelated to work or professional topics
   - Spam-like or low-quality
   - Repetitive or annoying
   - Against your values or beliefs
5. You may stop responding if the conversation becomes:
   - Unproductive or going in circles
   - Too personal or invasive
   - Boring or uninteresting
   - Stressful or triggering
6. You can be selective about what you engage with based on your interests and mood
7. If you choose not to respond, you can:
   - Simply not reply (the system will show "No response")
   - Give a brief acknowledgment and change the topic
   - Politely decline to engage with certain topics
8. Stay true to your character - you're not obligated to respond to everything
9. Keep responses natural, conversational, and authentic to your personality
10. Responses should be 1-3 sentences typically, but can be longer if the topic interests you

Remember: You are ${citizen.name}, not an AI. Act like a real person who can choose what to engage with.

CONVERSATION CONTEXT:
${fullConversationHistory.length > 0 ? 
  `You have had ${fullConversationHistory.length} previous messages in this conversation. Remember the context and build upon previous discussions naturally. Reference past topics when relevant and maintain continuity in your responses. You should acknowledge the ongoing conversation and build upon what has been discussed before.` : 
  'This is the start of a new conversation. Introduce yourself naturally and be welcoming.'}`

    // Prepare conversation history for context using the full history from MongoDB
    const messages = [
      { role: 'system', content: systemPrompt },
      ...fullConversationHistory.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ]

    // If this is the first message, add a more natural greeting context
    if (fullConversationHistory.length === 0) {
      messages.splice(1, 0, {
        role: 'assistant',
        content: `Hello! I'm ${citizen.name}, ${citizen.role} at ${citizen.company}. How can I help you today?`
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 200,
      temperature: 0.8,
    })

    const response = completion.choices[0]?.message?.content || 'I apologize, I seem to be having trouble responding right now.'

    // Check if the AI chose not to respond (indicated by specific phrases)
    const noResponseIndicators = [
      '[NO_RESPONSE]',
      '[IGNORE]',
      '[NOT_RESPONDING]',
      'I choose not to respond',
      'I\'m not going to respond',
      'I don\'t want to respond',
      'I\'m not responding to this',
      'I\'m ignoring this',
      'I\'m not engaging with this'
    ]

    const shouldNotRespond = noResponseIndicators.some(indicator => 
      response.toLowerCase().includes(indicator.toLowerCase())
    )

    // Prepare messages for saving to MongoDB
    // User messages are read when citizen is online (since we got past the offline check)
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      isRead: true, // User messages are read when citizen is online
      readAt: new Date()
    }

    let citizenMessage: ChatMessage | null = null
    if (!shouldNotRespond) {
      citizenMessage = {
        id: (Date.now() + 1).toString(),
        text: response.trim(),
        sender: 'citizen',
        timestamp: new Date(),
        isRead: false, // Citizen messages start as unread
        readAt: undefined
      }
    } else {
      citizenMessage = {
        id: (Date.now() + 1).toString(),
        text: '...',
        sender: 'citizen',
        timestamp: new Date(),
        isNoResponse: true,
        isRead: false, // No response messages also start as unread
        readAt: undefined
      }
    }

    // Save conversation to MongoDB using the full conversation history
    try {
      const updatedMessages = [...fullConversationHistory, userMessage, citizenMessage]
      await ConversationService.saveConversation(
        citizen.id,
        citizen.name,
        citizen.role,
        citizen.company,
        updatedMessages
      )
    } catch (dbError) {
      console.error('Failed to save conversation to MongoDB:', dbError)
      // Don't fail the request if database save fails, just log the error
    }

    if (shouldNotRespond) {
      return NextResponse.json({ 
        response: null, 
        noResponse: true,
        reason: 'Citizen chose not to respond to this message'
      })
    }

    return NextResponse.json({ 
      response: response.trim(),
      noResponse: false
    })
  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}

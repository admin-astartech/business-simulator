import { getDatabase } from './mongodb'
import { Conversation, ChatMessage, ConversationSummary } from '@/types/conversation'

const COLLECTION_NAME = 'conversations'

export class ConversationService {
  private static async getCollection() {
    const db = await getDatabase()
    return db.collection<Conversation>(COLLECTION_NAME)
  }

  // Helper function to determine if conversation has unread citizen messages
  // Returns false if the last citizen message was an auto-response
  private static hasUnreadCitizenMessages(messages: ChatMessage[]): { hasUnread: boolean; unreadCount: number } {
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

  // Create or update a conversation
  static async saveConversation(
    citizenId: string,
    citizenName: string,
    citizenRole: string,
    citizenCompany: string,
    messages: ChatMessage[]
  ): Promise<Conversation> {
    const collection = await this.getCollection()
    const now = new Date()
    
    // Check if conversation already exists
    const existingConversation = await collection.findOne({ citizenId })
    
    if (existingConversation) {
      // Update existing conversation
      const updatedConversation: Conversation = {
        ...existingConversation,
        messages,
        updatedAt: now,
        totalMessages: messages.length,
        lastMessageAt: messages.length > 0 ? messages[messages.length - 1].timestamp : existingConversation.lastMessageAt,
        isActive: true
      }
      
      await collection.replaceOne({ citizenId }, updatedConversation)
      return updatedConversation
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        citizenId,
        citizenName,
        citizenRole,
        citizenCompany,
        messages,
        createdAt: now,
        updatedAt: now,
        totalMessages: messages.length,
        lastMessageAt: messages.length > 0 ? messages[messages.length - 1].timestamp : now,
        isActive: true
      }
      
      const result = await collection.insertOne(newConversation)
      return { ...newConversation, _id: result.insertedId.toString() }
    }
  }

  // Get conversation by citizen ID
  static async getConversation(citizenId: string): Promise<Conversation | null> {
    const collection = await this.getCollection()
    return await collection.findOne({ citizenId })
  }

  // Get all conversations with summary information
  static async getAllConversations(): Promise<ConversationSummary[]> {
    const collection = await this.getCollection()
    const conversations = await collection
      .find({ isActive: true })
      .sort({ lastMessageAt: -1 })
      .toArray()
    
    // Get citizen online status for each conversation
    const conversationsWithStatus = await Promise.all(
      conversations.map(async (conv) => {
        try {
          const db = await getDatabase()
          const citizens = db.collection('citizens')
          const citizen = await citizens.findOne({ id: conv.citizenId })
          
          // Check for unread citizen messages using helper function
          const { hasUnread, unreadCount } = this.hasUnreadCitizenMessages(conv.messages)
          
          return {
            _id: conv._id!.toString(),
            citizenId: conv.citizenId,
            citizenName: conv.citizenName,
            citizenRole: conv.citizenRole,
            citizenCompany: conv.citizenCompany,
            citizenGender: citizen?.gender || 'male',
            totalMessages: conv.totalMessages,
            lastMessageAt: conv.lastMessageAt,
            preview: conv.messages.length > 0 
              ? conv.messages[conv.messages.length - 1].text.substring(0, 100) + (conv.messages[conv.messages.length - 1].text.length > 100 ? '...' : '')
              : 'No messages yet',
            isActive: conv.isActive,
            isOnline: citizen?.isOnline || false,
            lastSeen: citizen?.lastSeen,
            hasUnreadCitizenMessage: hasUnread,
            unreadCitizenMessageCount: unreadCount
          }
        } catch (error) {
          console.error(`Error fetching citizen status for ${conv.citizenId}:`, error)
          // Check for unread citizen messages using helper function
          const { hasUnread, unreadCount } = this.hasUnreadCitizenMessages(conv.messages)
          
          return {
            _id: conv._id!.toString(),
            citizenId: conv.citizenId,
            citizenName: conv.citizenName,
            citizenRole: conv.citizenRole,
            citizenCompany: conv.citizenCompany,
            citizenGender: 'male' as const, // Default fallback
            totalMessages: conv.totalMessages,
            lastMessageAt: conv.lastMessageAt,
            preview: conv.messages.length > 0 
              ? conv.messages[conv.messages.length - 1].text.substring(0, 100) + (conv.messages[conv.messages.length - 1].text.length > 100 ? '...' : '')
              : 'No messages yet',
            isActive: conv.isActive,
            isOnline: false,
            lastSeen: undefined,
            hasUnreadCitizenMessage: hasUnread,
            unreadCitizenMessageCount: unreadCount
          }
        }
      })
    )
    
    return conversationsWithStatus
  }

  // Archive a conversation (mark as inactive)
  static async archiveConversation(citizenId: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.updateOne(
      { citizenId },
      { $set: { isActive: false, updatedAt: new Date() } }
    )
    return result.modifiedCount > 0
  }

  // Delete a conversation permanently
  static async deleteConversation(citizenId: string): Promise<boolean> {
    const collection = await this.getCollection()
    const result = await collection.deleteOne({ citizenId })
    return result.deletedCount > 0
  }

  // Get recent conversations (last 5 minutes) for notification checking
  static async getRecentConversations(): Promise<Conversation[]> {
    const collection = await this.getCollection()
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    const conversations = await collection.find({
      lastMessageAt: { $gte: fiveMinutesAgo },
      isActive: true
    }).toArray()
    
    return conversations
  }

  // Get conversation statistics
  static async getConversationStats(): Promise<{
    totalConversations: number
    totalMessages: number
    averageMessagesPerConversation: number
  }> {
    const collection = await this.getCollection()
    
    const [totalConversations, totalMessages] = await Promise.all([
      collection.countDocuments(),
      collection.aggregate([
        { $group: { _id: null, total: { $sum: '$totalMessages' } } }
      ]).toArray()
    ])
    
    const totalMsgs = totalMessages.length > 0 ? totalMessages[0].total : 0
    const avgMessages = totalConversations > 0 ? totalMsgs / totalConversations : 0
    
    return {
      totalConversations,
      totalMessages: totalMsgs,
      averageMessagesPerConversation: Math.round(avgMessages * 100) / 100
    }
  }
}

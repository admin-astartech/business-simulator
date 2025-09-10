import { BaseCronService, CRON_CONFIG } from './BaseCronService'

/**
 * Interface for unread message
 */
interface UnreadMessage {
  id: string
  text: string
  timestamp: Date | string
  isNoResponse?: boolean
}

/**
 * Interface for conversation with unread messages
 */
interface ConversationWithUnread {
  citizenId: string
  citizenName: string
  citizenRole: string
  citizenCompany: string
  unreadCount: number
  unreadMessages: UnreadMessage[]
  lastUnreadAt: Date | string
  totalMessages: number
}

/**
 * Interface for unread messages API response
 */
interface UnreadMessagesApiResponse {
  success: boolean
  totalConversations: number
  conversationsWithUnread: number
  conversations: ConversationWithUnread[]
}

/**
 * Service responsible for managing unread messages and conversation monitoring
 * Handles checking for unread user messages and logging conversation status
 */
export class MessageService extends BaseCronService {
  /**
   * Check for unread user messages (messages sent by users that citizens haven't read)
   * Runs every minute to show conversations with unread user messages
   */
  public async checkUnreadMessages(): Promise<void> {
    try {
      console.log('📬 Checking for unread user messages...')
      
      const data: UnreadMessagesApiResponse = await this.makeApiRequest(
        `${this.baseUrl}${CRON_CONFIG.ENDPOINTS.UNREAD_MESSAGES}`
      )
      
      if (!data.success) {
        throw new Error('API returned error response')
      }
      
      this.logUnreadMessages(data)
      
    } catch (error) {
      console.error('❌ Error checking unread messages:', error)
    }
  }

  /**
   * Log unread messages in a formatted way
   * @param data Unread messages API response data
   */
  private logUnreadMessages(data: UnreadMessagesApiResponse): void {
    const { conversations, conversationsWithUnread, totalConversations } = data
    
    this.logSectionHeader(`📬 UNREAD USER MESSAGES (${conversationsWithUnread} conversations)`)
    
    if (conversationsWithUnread === 0) {
      console.log('✅ No unread user messages - all user messages have been read by citizens!')
    } else {
      conversations.forEach((conversation, index) => {
        const lastUnreadDate = new Date(conversation.lastUnreadAt).toLocaleString()
        
        console.log(`${index + 1}. ${conversation.citizenName}`)
        console.log(`   Role: ${conversation.citizenRole} at ${conversation.citizenCompany}`)
        console.log(`   Unread User Messages: ${conversation.unreadCount}`)
        console.log(`   Last Unread: ${lastUnreadDate}`)
        console.log(`   Total Messages: ${conversation.totalMessages}`)
        
        // Show preview of unread user messages
        console.log(`   Recent Unread User Messages:`)
        conversation.unreadMessages.slice(-3).forEach((msg, msgIndex) => {
          const msgTime = new Date(msg.timestamp).toLocaleTimeString()
          const preview = msg.text.length > 50 ? msg.text.substring(0, 50) + '...' : msg.text
          console.log(`     ${msgIndex + 1}. [${msgTime}] ${preview}`)
        })
        
        if (conversation.unreadMessages.length > 3) {
          console.log(`     ... and ${conversation.unreadMessages.length - 3} more messages`)
        }
        
        console.log('-'.repeat(50))
      })
    }
    
    this.logSectionFooter(`📊 Summary: ${conversationsWithUnread}/${totalConversations} conversations have unread user messages`)
  }
}

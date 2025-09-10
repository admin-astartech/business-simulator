/**
 * Client-side service for monitoring auto-responses and showing notifications
 * Polls the server for recent auto-responses and displays notifications
 */
import NotificationService from './notificationService'

interface AutoResponseData {
  citizenId: string
  citizenName: string
  citizenRole: string
  citizenCompany: string
  response: string
  timestamp: string
}

class AutoResponseNotificationService {
  private static instance: AutoResponseNotificationService
  private isRunning = false
  private pollInterval: NodeJS.Timeout | null = null
  private lastChecked: Date | null = null
  private readonly POLL_INTERVAL = 10000 // Poll every 10 seconds
  private readonly baseUrl: string

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }

  /**
   * Get the singleton instance of AutoResponseNotificationService
   * @returns The AutoResponseNotificationService instance
   */
  public static getInstance(): AutoResponseNotificationService {
    if (!AutoResponseNotificationService.instance) {
      AutoResponseNotificationService.instance = new AutoResponseNotificationService()
    }
    return AutoResponseNotificationService.instance
  }

  /**
   * Start monitoring for auto-responses
   */
  public start(): void {
    if (this.isRunning) {
      console.log('⚠️ Auto-response notification service is already running')
      return
    }

    if (typeof window === 'undefined') {
      console.log('⚠️ Auto-response notification service can only run in browser')
      return
    }

    console.log('🚀 Starting auto-response notification monitoring...')
    this.isRunning = true
    this.lastChecked = new Date()

    // Start polling immediately
    this.checkForAutoResponses()

    // Set up interval polling
    this.pollInterval = setInterval(() => {
      this.checkForAutoResponses()
    }, this.POLL_INTERVAL)

    console.log(`✅ Auto-response notification monitoring started (polling every ${this.POLL_INTERVAL / 1000}s)`)
  }

  /**
   * Stop monitoring for auto-responses
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Auto-response notification service is not running')
      return
    }

    console.log('🛑 Stopping auto-response notification monitoring...')
    this.isRunning = false

    if (this.pollInterval) {
      clearInterval(this.pollInterval)
      this.pollInterval = null
    }

    console.log('✅ Auto-response notification monitoring stopped')
  }

  /**
   * Check for recent auto-responses and show notifications
   */
  private async checkForAutoResponses(): Promise<void> {
    try {
      console.log('🔍 Checking for recent auto-responses...')
      
      // Get recent conversations to check for new auto-responses
      const response = await fetch(`${this.baseUrl}/api/conversations?recent=true`)
      
      if (!response.ok) {
        console.error('Failed to fetch recent conversations:', response.status)
        return
      }

      const conversations = await response.json()
      
      if (!Array.isArray(conversations)) {
        console.error('Invalid conversations data received')
        return
      }

      console.log(`📊 Found ${conversations.length} recent conversations`)

      // Check each conversation for recent auto-responses
      for (const conversation of conversations) {
        await this.checkConversationForAutoResponses(conversation)
      }

    } catch (error) {
      console.error('❌ Error checking for auto-responses:', error)
    }
  }

  /**
   * Check a specific conversation for recent auto-responses
   * @param conversation Conversation data
   */
  private async checkConversationForAutoResponses(conversation: any): Promise<void> {
    try {
      if (!conversation.messages || !Array.isArray(conversation.messages)) {
        return
      }

      // Get messages from the last 2 minutes (to catch recent auto-responses)
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
      
      const recentMessages = conversation.messages.filter((msg: any) => {
        const messageTime = new Date(msg.timestamp)
        return messageTime > twoMinutesAgo && msg.sender === 'citizen'
      })

      console.log(`🔍 Checking conversation with ${conversation.citizenName}: ${recentMessages.length} recent citizen messages`)

      // Check if any of these recent messages are auto-responses
      for (const message of recentMessages) {
        // Check if this is likely an auto-response (citizen came online and responded)
        const isAutoResponse = await this.isLikelyAutoResponse(conversation.citizenId, message)
        
        console.log(`🤖 Message from ${conversation.citizenName}: "${message.text.substring(0, 50)}..." - Auto-response: ${isAutoResponse}`)
        
        if (isAutoResponse) {
          this.showAutoResponseNotification({
            citizenId: conversation.citizenId,
            citizenName: conversation.citizenName,
            citizenRole: conversation.citizenRole,
            citizenCompany: conversation.citizenCompany,
            response: message.text,
            timestamp: message.timestamp
          })
        }
      }

    } catch (error) {
      console.error('❌ Error checking conversation for auto-responses:', error)
    }
  }

  /**
   * Determine if a message is likely an auto-response
   * @param citizenId Citizen ID
   * @param message Message to check
   * @returns Promise<boolean> True if likely an auto-response
   */
  private async isLikelyAutoResponse(citizenId: string, message: any): Promise<boolean> {
    try {
      // Check if the citizen is currently online (indicating they just came online)
      const response = await fetch(`${this.baseUrl}/api/citizens/online`)
      
      if (!response.ok) {
        return false
      }

      const data = await response.json()
      const onlineCitizens = data.onlineCitizens || []
      
      // If citizen is online and the message is recent, it's likely an auto-response
      const isOnline = onlineCitizens.some((citizen: any) => citizen.id === citizenId)
      const isRecent = new Date(message.timestamp) > new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
      
      return isOnline && isRecent
    } catch (error) {
      console.error('Error checking if message is auto-response:', error)
      return false
    }
  }

  /**
   * Show notification for auto-response
   * @param data Auto-response data
   */
  private showAutoResponseNotification(data: AutoResponseData): void {
    try {
      const notificationService = NotificationService.getInstance()
      
      if (!notificationService.isSupported() || !notificationService.hasPermission()) {
        console.log('⚠️ Cannot show notification: not supported or permission not granted')
        return
      }

      // Check if we've already shown a notification for this citizen recently
      const notificationKey = `auto-response-${data.citizenId}-${data.timestamp}`
      const lastShown = localStorage.getItem(notificationKey)
      
      if (lastShown) {
        return // Already shown this notification
      }

      // Show the notification
      notificationService.showAutoResponseNotification(
        data.citizenName,
        data.citizenRole,
        data.citizenCompany,
        data.response,
        data.citizenId
      )

      // Mark as shown
      localStorage.setItem(notificationKey, 'true')
      
      // Clean up old notification keys (older than 1 hour)
      this.cleanupOldNotificationKeys()

      console.log(`📱 Auto-response notification shown for ${data.citizenName}`)
    } catch (error) {
      console.error('❌ Error showing auto-response notification:', error)
    }
  }

  /**
   * Clean up old notification keys from localStorage
   */
  private cleanupOldNotificationKeys(): void {
    try {
      const oneHourAgo = Date.now() - 60 * 60 * 1000
      const keysToRemove: string[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('auto-response-')) {
          const timestamp = key.split('-').pop()
          if (timestamp && parseInt(timestamp) < oneHourAgo) {
            keysToRemove.push(key)
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error cleaning up notification keys:', error)
    }
  }

  /**
   * Get the current running status
   * @returns boolean True if running
   */
  public getStatus(): boolean {
    return this.isRunning
  }

  /**
   * Restart the service
   */
  public restart(): void {
    console.log('🔄 Restarting auto-response notification service...')
    this.stop()
    this.start()
  }
}

export default AutoResponseNotificationService

import { CitizenStatusService, MessageService, SocialMediaService, CitizenEngagementService, CitizenCommentService } from './services'

/**
 * Vercel-compatible cron service that runs tasks on-demand
 * This replaces the persistent node-cron service for serverless deployment
 */
export class VercelCronService {
  private static instance: VercelCronService
  
  // Sub-services
  private citizenStatusService: CitizenStatusService
  private messageService: MessageService
  private socialMediaService: SocialMediaService
  private citizenEngagementService: CitizenEngagementService
  private citizenCommentService: CitizenCommentService

  private constructor() {
    this.citizenStatusService = new CitizenStatusService()
    this.messageService = new MessageService()
    this.socialMediaService = new SocialMediaService()
    this.citizenEngagementService = new CitizenEngagementService()
    this.citizenCommentService = new CitizenCommentService()
  }

  /**
   * Get the singleton instance of VercelCronService
   */
  public static getInstance(): VercelCronService {
    if (!VercelCronService.instance) {
      VercelCronService.instance = new VercelCronService()
    }
    return VercelCronService.instance
  }

  /**
   * Run all scheduled tasks (called by Vercel cron)
   */
  public async runAllTasks(): Promise<{ success: boolean; results: any[] }> {
    const results = []
    
    try {
      console.log('🚀 Running all Vercel cron tasks...')
      
      // Run citizen status updates
      try {
        console.log('📊 Running citizen status updates...')
        await this.citizenStatusService.updateRandomCitizensOnlineStatus()
        results.push({ task: 'citizenStatus', success: true })
      } catch (error) {
        console.error('❌ Citizen status update failed:', error)
        results.push({ task: 'citizenStatus', success: false, error: error.message })
      }

      // Check unread messages
      try {
        console.log('📬 Checking unread messages...')
        await this.messageService.checkUnreadMessages()
        results.push({ task: 'unreadMessages', success: true })
      } catch (error) {
        console.error('❌ Unread messages check failed:', error)
        results.push({ task: 'unreadMessages', success: false, error: error.message })
      }

      // Generate social media posts
      try {
        console.log('📱 Generating social media posts...')
        await this.socialMediaService.generateSocialMediaPost()
        results.push({ task: 'socialMediaPosts', success: true })
      } catch (error) {
        console.error('❌ Social media posts generation failed:', error)
        results.push({ task: 'socialMediaPosts', success: false, error: error.message })
      }

      // Simulate citizen engagement
      try {
        console.log('🎯 Simulating citizen engagement...')
        await this.citizenEngagementService.simulateCitizenEngagement()
        results.push({ task: 'citizenEngagement', success: true })
      } catch (error) {
        console.error('❌ Citizen engagement simulation failed:', error)
        results.push({ task: 'citizenEngagement', success: false, error: error.message })
      }

      // Simulate citizen commenting
      try {
        console.log('💬 Simulating citizen commenting...')
        await this.citizenCommentService.simulateCitizenCommenting()
        results.push({ task: 'citizenCommenting', success: true })
      } catch (error) {
        console.error('❌ Citizen commenting simulation failed:', error)
        results.push({ task: 'citizenCommenting', success: false, error: error.message })
      }

      console.log('✅ All Vercel cron tasks completed')
      return { success: true, results }
      
    } catch (error) {
      console.error('❌ Vercel cron service error:', error)
      return { success: false, results }
    }
  }

  /**
   * Run specific task by name
   */
  public async runTask(taskName: string): Promise<{ success: boolean; result?: any; error?: string }> {
    try {
      switch (taskName) {
        case 'citizenStatus':
          await this.citizenStatusService.updateRandomCitizensOnlineStatus()
          return { success: true, result: 'Citizen status updated' }
        
        case 'unreadMessages':
          await this.messageService.checkUnreadMessages()
          return { success: true, result: 'Unread messages checked' }
        
        case 'socialMediaPosts':
          await this.socialMediaService.generateSocialMediaPost()
          return { success: true, result: 'Social media posts generated' }
        
        case 'citizenEngagement':
          await this.citizenEngagementService.simulateCitizenEngagement()
          return { success: true, result: 'Citizen engagement simulated' }
        
        case 'citizenCommenting':
          await this.citizenCommentService.simulateCitizenCommenting()
          return { success: true, result: 'Citizen commenting simulated' }
        
        default:
          return { success: false, error: `Unknown task: ${taskName}` }
      }
    } catch (error) {
      console.error(`❌ Task ${taskName} failed:`, error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Get service status
   */
  public getStatus(): { isRunning: boolean; environment: string } {
    return {
      isRunning: true, // Always running in serverless
      environment: process.env.NODE_ENV || 'development'
    }
  }
}

export default VercelCronService

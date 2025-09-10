import { CitizenStatusService, MessageService, SocialMediaService, CitizenEngagementService, CitizenCommentService } from './services'

/**
 * Vercel-compatible cron service that runs tasks on-demand
 * This replaces the persistent node-cron service for serverless deployment
 */
export class VercelCronService {
  private static instance: VercelCronService
  private lastRunTimes: Map<string, number> = new Map()
  
  // Sub-services
  private citizenStatusService: CitizenStatusService
  private messageService: MessageService
  private socialMediaService: SocialMediaService
  private citizenEngagementService: CitizenEngagementService
  private citizenCommentService: CitizenCommentService

  // Task intervals in minutes
  private readonly TASK_INTERVALS = {
    citizenStatus: 5,      // Every 5 minutes
    unreadMessages: 5,     // Every 5 minutes  
    socialMediaPosts: 10,  // Every 10 minutes
    citizenEngagement: 5,  // Every 5 minutes
    citizenCommenting: 10  // Every 10 minutes
  }

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
   * Check if a task should run based on its interval
   */
  private shouldRunTask(taskName: string): boolean {
    const now = Date.now()
    const lastRun = this.lastRunTimes.get(taskName) || 0
    const intervalMs = this.TASK_INTERVALS[taskName as keyof typeof this.TASK_INTERVALS] * 60 * 1000
    
    return (now - lastRun) >= intervalMs
  }

  /**
   * Mark a task as completed
   */
  private markTaskCompleted(taskName: string): void {
    this.lastRunTimes.set(taskName, Date.now())
  }

  /**
   * Run all scheduled tasks (called by Vercel cron)
   * Only runs tasks that are due based on their intervals
   */
  public async runAllTasks(): Promise<{ success: boolean; results: any[] }> {
    const results: Array<{ task: string; success: boolean; error?: string; skipped?: boolean }> = []
    
    try {
      console.log('🚀 Running Vercel cron tasks (with interval checking)...')
      
      // Run citizen status updates (every 5 minutes)
      if (this.shouldRunTask('citizenStatus')) {
        try {
          console.log('📊 Running citizen status updates...')
          await this.citizenStatusService.updateRandomCitizensOnlineStatus()
          this.markTaskCompleted('citizenStatus')
          results.push({ task: 'citizenStatus', success: true })
        } catch (error) {
          console.error('❌ Citizen status update failed:', error)
          results.push({ task: 'citizenStatus', success: false, error: error instanceof Error ? error.message : String(error) })
        }
      } else {
        console.log('⏭️ Skipping citizen status updates (not due yet)')
        results.push({ task: 'citizenStatus', success: true, skipped: true })
      }

      // Check unread messages (every 5 minutes)
      if (this.shouldRunTask('unreadMessages')) {
        try {
          console.log('📬 Checking unread messages...')
          await this.messageService.checkUnreadMessages()
          this.markTaskCompleted('unreadMessages')
          results.push({ task: 'unreadMessages', success: true })
        } catch (error) {
          console.error('❌ Unread messages check failed:', error)
          results.push({ task: 'unreadMessages', success: false, error: error instanceof Error ? error.message : String(error) })
        }
      } else {
        console.log('⏭️ Skipping unread messages check (not due yet)')
        results.push({ task: 'unreadMessages', success: true, skipped: true })
      }

      // Generate social media posts (every 10 minutes)
      if (this.shouldRunTask('socialMediaPosts')) {
        try {
          console.log('📱 Generating social media posts...')
          await this.socialMediaService.generateSocialMediaPost()
          this.markTaskCompleted('socialMediaPosts')
          results.push({ task: 'socialMediaPosts', success: true })
        } catch (error) {
          console.error('❌ Social media posts generation failed:', error)
          results.push({ task: 'socialMediaPosts', success: false, error: error instanceof Error ? error.message : String(error) })
        }
      } else {
        console.log('⏭️ Skipping social media posts generation (not due yet)')
        results.push({ task: 'socialMediaPosts', success: true, skipped: true })
      }

      // Simulate citizen engagement (every 5 minutes)
      if (this.shouldRunTask('citizenEngagement')) {
        try {
          console.log('🎯 Simulating citizen engagement...')
          await this.citizenEngagementService.simulateCitizenEngagement()
          this.markTaskCompleted('citizenEngagement')
          results.push({ task: 'citizenEngagement', success: true })
        } catch (error) {
          console.error('❌ Citizen engagement simulation failed:', error)
          results.push({ task: 'citizenEngagement', success: false, error: error instanceof Error ? error.message : String(error) })
        }
      } else {
        console.log('⏭️ Skipping citizen engagement simulation (not due yet)')
        results.push({ task: 'citizenEngagement', success: true, skipped: true })
      }

      // Simulate citizen commenting (every 10 minutes)
      if (this.shouldRunTask('citizenCommenting')) {
        try {
          console.log('💬 Simulating citizen commenting...')
          await this.citizenCommentService.simulateCitizenCommenting()
          this.markTaskCompleted('citizenCommenting')
          results.push({ task: 'citizenCommenting', success: true })
        } catch (error) {
          console.error('❌ Citizen commenting simulation failed:', error)
          results.push({ task: 'citizenCommenting', success: false, error: error instanceof Error ? error.message : String(error) })
        }
      } else {
        console.log('⏭️ Skipping citizen commenting simulation (not due yet)')
        results.push({ task: 'citizenCommenting', success: true, skipped: true })
      }

      console.log('✅ Vercel cron tasks completed')
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
      return { success: false, error: error instanceof Error ? error.message : String(error) }
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

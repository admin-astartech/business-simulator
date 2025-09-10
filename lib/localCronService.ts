import * as cron from 'node-cron'
import { CRON_CONFIG, CitizenStatusService, MessageService, SocialMediaService, CitizenEngagementService, CitizenCommentService } from './services'

/**
 * Local cron service for development
 * Uses node-cron to run tasks locally when developing
 */
export class LocalCronService {
  private static instance: LocalCronService
  private isRunning = false
  private cronTasks: Map<string, cron.ScheduledTask> = new Map()
  
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
   * Get the singleton instance of LocalCronService
   */
  public static getInstance(): LocalCronService {
    if (!LocalCronService.instance) {
      LocalCronService.instance = new LocalCronService()
    }
    return LocalCronService.instance
  }

  /**
   * Start the local cron service
   */
  public start(): void {
    if (this.isRunning) {
      console.log('⚠️ Local cron service is already running')
      return
    }

    try {
      console.log('🚀 Starting local cron service...')
      
      // Citizen status updates (every 5 minutes)
      const statusUpdateTask = cron.schedule(CRON_CONFIG.SCHEDULES.STATUS_UPDATE, async () => {
        console.log('🔄 [LOCAL] Running citizen status updates...')
        try {
          await this.citizenStatusService.updateRandomCitizensOnlineStatus()
          console.log('✅ [LOCAL] Citizen status updates completed')
        } catch (error) {
          console.error('❌ [LOCAL] Citizen status update failed:', error)
        }
      })
      this.cronTasks.set('citizenStatus', statusUpdateTask)

      // Unread messages check (every 5 minutes)
      const unreadMessagesTask = cron.schedule(CRON_CONFIG.SCHEDULES.ONLINE_DISPLAY, async () => {
        console.log('📬 [LOCAL] Checking unread messages...')
        try {
          await this.messageService.checkUnreadMessages()
          console.log('✅ [LOCAL] Unread messages check completed')
        } catch (error) {
          console.error('❌ [LOCAL] Unread messages check failed:', error)
        }
      })
      this.cronTasks.set('unreadMessages', unreadMessagesTask)

      // Social media posts (every 10 minutes)
      const socialMediaTask = cron.schedule(CRON_CONFIG.SCHEDULES.SOCIAL_MEDIA_POSTS, async () => {
        console.log('📱 [LOCAL] Generating social media posts...')
        try {
          await this.socialMediaService.generateSocialMediaPost()
          console.log('✅ [LOCAL] Social media posts generation completed')
        } catch (error) {
          console.error('❌ [LOCAL] Social media posts generation failed:', error)
        }
      })
      this.cronTasks.set('socialMediaPosts', socialMediaTask)

      // Citizen engagement (every 5 minutes)
      const citizenEngagementTask = cron.schedule(CRON_CONFIG.SCHEDULES.CITIZEN_ENGAGEMENT, async () => {
        console.log('🎯 [LOCAL] Simulating citizen engagement...')
        try {
          await this.citizenEngagementService.simulateCitizenEngagement()
          console.log('✅ [LOCAL] Citizen engagement simulation completed')
        } catch (error) {
          console.error('❌ [LOCAL] Citizen engagement simulation failed:', error)
        }
      })
      this.cronTasks.set('citizenEngagement', citizenEngagementTask)

      // Citizen commenting (every 10 minutes)
      const citizenCommentingTask = cron.schedule(CRON_CONFIG.SCHEDULES.CITIZEN_COMMENTING, async () => {
        console.log('💬 [LOCAL] Simulating citizen commenting...')
        try {
          await this.citizenCommentService.simulateCitizenCommenting()
          console.log('✅ [LOCAL] Citizen commenting simulation completed')
        } catch (error) {
          console.error('❌ [LOCAL] Citizen commenting simulation failed:', error)
        }
      })
      this.cronTasks.set('citizenCommenting', citizenCommentingTask)

      this.isRunning = true
      console.log('✅ Local cron service started successfully!')
      console.log('📊 Scheduled tasks:')
      console.log(`   📊 Citizen status updates: ${CRON_CONFIG.SCHEDULES.STATUS_UPDATE}`)
      console.log(`   📬 Unread messages check: ${CRON_CONFIG.SCHEDULES.ONLINE_DISPLAY}`)
      console.log(`   📱 Social media posts: ${CRON_CONFIG.SCHEDULES.SOCIAL_MEDIA_POSTS}`)
      console.log(`   🎯 Citizen engagement: ${CRON_CONFIG.SCHEDULES.CITIZEN_ENGAGEMENT}`)
      console.log(`   💬 Citizen commenting: ${CRON_CONFIG.SCHEDULES.CITIZEN_COMMENTING}`)
      
    } catch (error) {
      console.error('❌ Failed to start local cron service:', error)
      throw error
    }
  }

  /**
   * Stop the local cron service
   */
  public stop(): void {
    if (!this.isRunning) {
      console.log('⚠️ Local cron service is not running')
      return
    }

    try {
      console.log('🛑 Stopping local cron service...')
      
      // Stop all cron tasks
      Array.from(this.cronTasks.entries()).forEach(([taskName, task]) => {
        task.stop()
        console.log(`   ✅ Stopped ${taskName} task`)
      })
      
      // Clear the tasks map
      this.cronTasks.clear()
      
      this.isRunning = false
      console.log('✅ Local cron service stopped successfully')
    } catch (error) {
      console.error('❌ Error stopping local cron service:', error)
      throw error
    }
  }

  /**
   * Restart the local cron service
   */
  public restart(): void {
    console.log('🔄 Restarting local cron service...')
    this.stop()
    this.start()
  }

  /**
   * Get the current running status
   */
  public getStatus(): boolean {
    return this.isRunning
  }

  /**
   * Get the status of individual cron jobs
   */
  public getJobStatus(): { [key: string]: boolean } {
    const status: { [key: string]: boolean } = {}
    
    Array.from(this.cronTasks.entries()).forEach(([taskName, task]) => {
      status[taskName] = task.getStatus() === 'scheduled'
    })
    
    return status
  }

  /**
   * Get detailed information about the service
   */
  public getServiceInfo(): {
    isRunning: boolean
    totalJobs: number
    jobStatus: { [key: string]: boolean }
    schedules: typeof CRON_CONFIG.SCHEDULES
  } {
    return {
      isRunning: this.isRunning,
      totalJobs: this.cronTasks.size,
      jobStatus: this.getJobStatus(),
      schedules: CRON_CONFIG.SCHEDULES
    }
  }

  /**
   * Run all tasks immediately (for testing)
   */
  public async runAllTasksNow(): Promise<void> {
    console.log('🚀 [LOCAL] Running all tasks immediately...')
    
    try {
      await this.citizenStatusService.updateRandomCitizensOnlineStatus()
      console.log('✅ [LOCAL] Citizen status updates completed')
    } catch (error) {
      console.error('❌ [LOCAL] Citizen status update failed:', error)
    }

    try {
      await this.messageService.checkUnreadMessages()
      console.log('✅ [LOCAL] Unread messages check completed')
    } catch (error) {
      console.error('❌ [LOCAL] Unread messages check failed:', error)
    }

    try {
      await this.socialMediaService.generateSocialMediaPost()
      console.log('✅ [LOCAL] Social media posts generation completed')
    } catch (error) {
      console.error('❌ [LOCAL] Social media posts generation failed:', error)
    }

    try {
      await this.citizenEngagementService.simulateCitizenEngagement()
      console.log('✅ [LOCAL] Citizen engagement simulation completed')
    } catch (error) {
      console.error('❌ [LOCAL] Citizen engagement simulation failed:', error)
    }

    try {
      await this.citizenCommentService.simulateCitizenCommenting()
      console.log('✅ [LOCAL] Citizen commenting simulation completed')
    } catch (error) {
      console.error('❌ [LOCAL] Citizen commenting simulation failed:', error)
    }

    console.log('✅ [LOCAL] All tasks completed')
  }
}

export default LocalCronService

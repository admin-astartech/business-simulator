import * as cron from 'node-cron'
import { CRON_CONFIG, CitizenStatusService, MessageService, SocialMediaService, CitizenEngagementService, CitizenCommentService } from './services'

/**
 * Main cron service that orchestrates all sub-services
 * Manages cron job scheduling and coordinates between different service modules
 */
class CronService {
  private static instance: CronService
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
   * Get the singleton instance of CronService
   * @returns The CronService instance
   */
  public static getInstance(): CronService {
    if (!CronService.instance) {
      CronService.instance = new CronService()
    }
    return CronService.instance
  }

  /**
   * Delegate citizen status updates to the CitizenStatusService
   */
  private async updateRandomCitizensOnlineStatus(): Promise<void> {
    await this.citizenStatusService.updateRandomCitizensOnlineStatus()
  }

  /**
   * Delegate unread message checking to the MessageService
   */
  private async checkUnreadMessages(): Promise<void> {
    await this.messageService.checkUnreadMessages()
  }

  /**
   * Delegate social media post generation to the SocialMediaService
   */
  private async generateSocialMediaPost(): Promise<void> {
    await this.socialMediaService.generateSocialMediaPost()
  }

  /**
   * Delegate citizen engagement simulation to the CitizenEngagementService
   */
  private async simulateCitizenEngagement(): Promise<void> {
    await this.citizenEngagementService.simulateCitizenEngagement()
  }

  /**
   * Delegate citizen commenting simulation to the CitizenCommentService
   */
  private async simulateCitizenCommenting(): Promise<void> {
    await this.citizenCommentService.simulateCitizenCommenting()
  }

  /**
   * Start the cron service
   * Schedules multiple jobs for status updates and online citizen display
   * @throws Error if service is already running
   */
  public start(): void {
    if (this.isRunning) {
      console.log('⚠️ Cron service is already running')
      return
    }

    try {
      console.log('🚀 Starting cron service...')
      
      const statusUpdateTask = cron.schedule(CRON_CONFIG.SCHEDULES.STATUS_UPDATE, async () => {
        console.log('🔄 Running status update job - simulating citizens coming online and offline...')
      await this.updateRandomCitizensOnlineStatus()
    })
      this.cronTasks.set('statusUpdate', statusUpdateTask)

      // Start unread messages check job (every minute)
      const unreadMessagesTask = cron.schedule(CRON_CONFIG.SCHEDULES.ONLINE_DISPLAY, async () => {
        console.log('📬 Running unread messages check job...')
        await this.checkUnreadMessages()
      })
      this.cronTasks.set('unreadMessages', unreadMessagesTask)

      const socialMediaTask = cron.schedule(CRON_CONFIG.SCHEDULES.SOCIAL_MEDIA_POSTS, async () => {
        console.log('📱 Running social media post generation job...')
        await this.generateSocialMediaPost()
      })
      this.cronTasks.set('socialMediaPosts', socialMediaTask)

      // Start citizen engagement job (every 2 minutes)
      const citizenEngagementTask = cron.schedule(CRON_CONFIG.SCHEDULES.CITIZEN_ENGAGEMENT, async () => {
        console.log('🎯 Running citizen engagement simulation job...')
        await this.simulateCitizenEngagement()
      })
      this.cronTasks.set('citizenEngagement', citizenEngagementTask)

      // Start citizen commenting job (every 3 minutes)
      const citizenCommentingTask = cron.schedule(CRON_CONFIG.SCHEDULES.CITIZEN_COMMENTING, async () => {
        console.log('💬 Running citizen commenting simulation job...')
        await this.simulateCitizenCommenting()
      })
      this.cronTasks.set('citizenCommenting', citizenCommentingTask)

    this.isRunning = true
      console.log(`✅ Cron jobs started:`)
      console.log(`   📊 Status updates: every minute (${CRON_CONFIG.UPDATE_PERCENTAGE * 100}% of citizens)`)
      console.log(`   📬 Unread messages check: every minute`)
      console.log(`   📱 Social media posts: every 15 minutes (LinkedIn, TikTok, Instagram)`)
      console.log(`   🎯 Citizen engagement: every 2 minutes (random online citizen assesses posts)`)
      console.log(`   💬 Citizen commenting: every 3 minutes (random online citizen comments on posts)`)
    } catch (error) {
      console.error('❌ Failed to start cron service:', error)
      throw error
    }
  }

  /**
   * Stop the cron service
   * Stops all scheduled jobs and cleans up resources
   */
  public stop(): void {
    if (!this.isRunning) {
      return
    }

    try {
      console.log('🛑 Stopping all cron jobs...')
      
      // Stop all cron tasks
      Array.from(this.cronTasks.entries()).forEach(([taskName, task]) => {
        task.stop()
        console.log(`   ✅ Stopped ${taskName} job`)
      })
      
      // Clear the tasks map
      this.cronTasks.clear()
      
      this.isRunning = false
      console.log('✅ All cron jobs stopped successfully')
    } catch (error) {
      console.error('❌ Error stopping cron service:', error)
      throw error
    }
  }

  /**
   * Get the current running status of the cron service
   * @returns boolean True if the service is running, false otherwise
   */
  public getStatus(): boolean {
    return this.isRunning
  }

  /**
   * Get the current configuration of the cron service
   * @returns Object containing the current configuration
   */
  public getConfig(): typeof CRON_CONFIG {
    return { ...CRON_CONFIG }
  }

  /**
   * Get the status of individual cron jobs
   * @returns Object containing the status of each job
   */
  public getJobStatus(): { [key: string]: boolean } {
    const status: { [key: string]: boolean } = {}
    
    Array.from(this.cronTasks.entries()).forEach(([taskName, task]) => {
      status[taskName] = task.getStatus() === 'scheduled'
    })
    
    return status
  }

  /**
   * Get detailed information about running jobs
   * @returns Object containing job details
   */
  public getJobDetails(): {
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
   * Restart the cron service
   * Stops the current service and starts it again
   */
  public restart(): void {
    console.log('🔄 Restarting cron service...')
    this.stop()
    this.start()
  }

  /**
   * Test social media post generation and database save
   * This method can be called manually to test the functionality
   */
  public async testSocialMediaPostGeneration(): Promise<void> {
    await this.socialMediaService.testSocialMediaPostGeneration()
  }

  /**
   * Test citizen engagement simulation
   * This method can be called manually to test the functionality
   */
  public async testCitizenEngagement(): Promise<void> {
    await this.citizenEngagementService.testCitizenEngagement()
  }

  /**
   * Test citizen commenting simulation
   * This method can be called manually to test the functionality
   */
  public async testCitizenCommenting(): Promise<void> {
    await this.citizenCommentService.testCitizenCommenting()
  }
}

export default CronService

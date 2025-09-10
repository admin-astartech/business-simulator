import { Citizen } from '@/types/citizens'
import { BaseCronService, CRON_CONFIG, ApiResponse } from './BaseCronService'

/**
 * Service responsible for managing citizen online/offline status simulation
 * Handles status updates, event dispatching, and auto-responses
 */
export class CitizenStatusService extends BaseCronService {
  /**
   * Main method to update random citizens' online status
   * Orchestrates the entire process of fetching citizens and updating their status
   */
  public async updateRandomCitizensOnlineStatus(): Promise<void> {
    try {
      console.log('🔄 Starting citizen status update simulation...')
      
      const citizens = await this.fetchCitizens()
      if (!citizens || citizens.length === 0) {
        console.log('⚠️ No citizens data available for status update')
        return
      }

      const { onlineCitizens, offlineCitizens } = this.selectRandomCitizens(citizens)
      
      const [onlineResult, offlineResult] = await Promise.all([
        this.updateCitizensStatus(onlineCitizens, true),
        this.updateCitizensStatus(offlineCitizens, false)
      ])
      
      this.logUpdateResults(onlineResult, offlineResult)
      
      // Dispatch events to notify the app of citizen status changes
      this.dispatchCitizenStatusChangeEvents(onlineCitizens, offlineCitizens)
      
      // Handle auto-responses for citizens who came online
      if (onlineCitizens.length > 0) {
        await this.handleAutoResponses(onlineCitizens)
      }
      
    } catch (error) {
      console.error('❌ Error updating citizens online status:', error)
    }
  }

  /**
   * Select random citizens for online and offline status updates
   * @param citizens Array of all citizens
   * @returns Object containing online and offline citizen arrays
   */
  private selectRandomCitizens(citizens: Citizen[]): { onlineCitizens: Citizen[], offlineCitizens: Citizen[] } {
    const totalCitizens = citizens.length
    const updateCount = Math.max(CRON_CONFIG.MIN_CITIZENS_TO_UPDATE, 
      Math.floor(totalCitizens * CRON_CONFIG.UPDATE_PERCENTAGE))
    
    // Create two independent random selections
    const onlineCitizens = this.getRandomCitizens(citizens, updateCount)
    const offlineCitizens = this.getRandomCitizens(citizens, updateCount)
    
    return { onlineCitizens, offlineCitizens }
  }

  /**
   * Update citizens' online status via API
   * @param citizens Array of citizens to update
   * @param isOnline Whether to set citizens online or offline
   * @returns Promise<ApiResponse> API response
   * @throws Error if API call fails
   */
  private async updateCitizensStatus(citizens: Citizen[], isOnline: boolean): Promise<ApiResponse> {
    const citizenIds = citizens.map(citizen => citizen.id)
    const method = isOnline ? CRON_CONFIG.METHODS.POST : CRON_CONFIG.METHODS.PUT
    const body = isOnline 
      ? { citizenIds }
      : { citizenIds, isOnline: false }
    
    const response = await this.makeApiRequest(`${this.baseUrl}${CRON_CONFIG.ENDPOINTS.ONLINE}`, {
      method,
      body: JSON.stringify(body)
    })
    
    return response
  }

  /**
   * Log the results of status updates
   * @param onlineResult Result of online status update
   * @param offlineResult Result of offline status update
   */
  private logUpdateResults(onlineResult: ApiResponse, offlineResult: ApiResponse): void {
    console.log(`✅ Successfully updated ${onlineResult.updatedCount} citizens to online status`)
    console.log(`✅ Successfully updated ${offlineResult.updatedCount} citizens to offline status`)
    console.log(`🎯 Simulation complete: ${onlineResult.updatedCount} online, ${offlineResult.updatedCount} offline`)
  }

  /**
   * Dispatch events to notify the app of citizen status changes
   * @param onlineCitizens Citizens who came online
   * @param offlineCitizens Citizens who went offline
   */
  private dispatchCitizenStatusChangeEvents(onlineCitizens: Citizen[], offlineCitizens: Citizen[]): void {
    try {
      // Dispatch general citizen data update event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('citizenDataUpdated'))
        
        // Dispatch specific events for online/offline changes
        if (onlineCitizens.length > 0) {
          window.dispatchEvent(new CustomEvent('citizensCameOnline', {
            detail: { citizens: onlineCitizens }
          }))
        }
        
        if (offlineCitizens.length > 0) {
          window.dispatchEvent(new CustomEvent('citizensWentOffline', {
            detail: { citizens: offlineCitizens }
          }))
        }
        
        console.log(`📡 Dispatched citizen status change events: ${onlineCitizens.length} online, ${offlineCitizens.length} offline`)
      }
    } catch (error) {
      console.error('❌ Error dispatching citizen status change events:', error)
    }
  }

  /**
   * Handle auto-responses for citizens who came online
   * @param onlineCitizens Array of citizens who came online
   */
  private async handleAutoResponses(onlineCitizens: Citizen[]): Promise<void> {
    try {
      console.log('🤖 Checking for auto-responses needed...')
      
      const citizenIds = onlineCitizens.map(citizen => citizen.id)
      
      const response = await this.makeApiRequest(`${this.baseUrl}${CRON_CONFIG.ENDPOINTS.AUTO_RESPOND}`, {
        method: CRON_CONFIG.METHODS.POST,
        body: JSON.stringify({ citizenIds })
      })
      
      if (!response.success) {
        throw new Error('Auto-response API returned error response')
      }
    } catch (error) {
      console.error('❌ Error handling auto-responses:', error)
    }
  }
}

import { Citizen } from '@/types/citizens'

/**
 * Configuration constants for cron services
 */
export const CRON_CONFIG = {
  // Cron schedules
  SCHEDULES: {
    // Status update: runs every minute
    STATUS_UPDATE: '* * * * *',
    // Online citizens display: runs every minute
    ONLINE_DISPLAY: '* * * * *',
    // Social media posts: runs every 8 minutes
    SOCIAL_MEDIA_POSTS: '*/10 * * * *',
    // Citizen engagement: runs every 2 minutes
    CITIZEN_ENGAGEMENT: '*/5 * * * *',
    // Citizen commenting: runs every 3 minutes
    CITIZEN_COMMENTING: '*/10 * * * *'
  },
  // Percentage of citizens to update (30%)
  UPDATE_PERCENTAGE: 0.3,
  // Minimum number of citizens to update
  MIN_CITIZENS_TO_UPDATE: 5,
  // API endpoints
  ENDPOINTS: {
    CITIZENS: '/api/citizens',
    ONLINE: '/api/citizens/online',
    UNREAD_MESSAGES: '/api/conversations/unread',
    AUTO_RESPOND: '/api/conversations/auto-respond',
    LINKEDIN_POSTS: '/api/linkedin-posts',
    TIKTOK_POSTS: '/api/tiktok-posts',
    INSTAGRAM_POSTS: '/api/instagram-posts'
  },
  // HTTP methods
  METHODS: {
    POST: 'POST',
    PUT: 'PUT'
  },
  // Headers
  HEADERS: {
    'Content-Type': 'application/json'
  }
} as const

/**
 * Interface for API response
 */
export interface ApiResponse {
  success: boolean
  updatedCount: number
  message: string
}

/**
 * Interface for citizens API response
 */
export interface CitizensApiResponse {
  totalCitizens: number
  citizens: Citizen[]
}

/**
 * Base class for cron services providing common functionality
 */
export abstract class BaseCronService {
  protected readonly baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }

  /**
   * Fetch citizens from the API
   * @returns Promise<Citizen[]> Array of citizens
   * @throws Error if API call fails
   */
  protected async fetchCitizens(): Promise<Citizen[]> {
    const response = await fetch(`${this.baseUrl}${CRON_CONFIG.ENDPOINTS.CITIZENS}`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch citizens: HTTP ${response.status}`)
    }
    
    const data: CitizensApiResponse = await response.json()
    
    if (!data.citizens || !Array.isArray(data.citizens)) {
      throw new Error('Invalid citizens data received from API')
    }
    
    return data.citizens
  }

  /**
   * Get a random selection of citizens
   * @param citizens Array of citizens to select from
   * @param count Number of citizens to select
   * @returns Array of randomly selected citizens
   */
  protected getRandomCitizens(citizens: Citizen[], count: number): Citizen[] {
    const shuffled = [...citizens].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Make an API request with error handling
   * @param url The API endpoint URL
   * @param options Fetch options
   * @returns Promise<any> API response data
   * @throws Error if API call fails
   */
  protected async makeApiRequest(url: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(url, {
      headers: CRON_CONFIG.HEADERS,
      ...options
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: HTTP ${response.status}`)
    }
    
    return await response.json()
  }

  /**
   * Log formatted section headers
   * @param title Section title
   * @param width Width of the separator line
   */
  protected logSectionHeader(title: string, width: number = 70): void {
    console.log('='.repeat(width))
    console.log(title)
    console.log('='.repeat(width))
  }

  /**
   * Log formatted section footer
   * @param message Footer message
   * @param width Width of the separator line
   */
  protected logSectionFooter(message: string, width: number = 70): void {
    console.log('='.repeat(width))
    console.log(message)
    console.log('='.repeat(width))
  }
}

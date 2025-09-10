import { Citizen } from '@/types/citizens'
import { SocialMediaPostGenerator, GeneratedSocialPost } from '../socialMediaPostGenerator'
import { BaseCronService, CRON_CONFIG } from './BaseCronService'

/**
 * Service responsible for managing social media post generation and database operations
 * Handles post creation, saving, and verification across multiple platforms
 */
export class SocialMediaService extends BaseCronService {
  /**
   * Generate and log a social media post from a random online citizen
   * Runs every 10 minutes to simulate citizens posting on social media
   */
  public async generateSocialMediaPost(): Promise<void> {
    try {
      console.log('📱 Generating social media post from random online citizen...')
      
      const onlineCitizens = await this.fetchOnlineCitizens()
      if (!onlineCitizens || onlineCitizens.length === 0) {
        console.log('⚠️ No online citizens available for social media post generation')
        return
      }

      // Randomly select one online citizen
      const randomCitizen = onlineCitizens[Math.floor(Math.random() * onlineCitizens.length)]
      
      // Generate a social media post for this citizen
      const socialPost = await SocialMediaPostGenerator.generatePost(randomCitizen)
      
      // Save social media posts to database based on platform
      await this.saveSocialMediaPost(socialPost)
      
      // Log the generated post
      this.logSocialMediaPost(socialPost)
      
    } catch (error) {
      console.error('❌ Error generating social media post:', error)
    }
  }

  /**
   * Fetch online citizens from the API
   * @returns Promise<Citizen[]> Array of online citizens
   * @throws Error if API call fails
   */
  private async fetchOnlineCitizens(): Promise<Citizen[]> {
    const data = await this.makeApiRequest(`${this.baseUrl}${CRON_CONFIG.ENDPOINTS.ONLINE}`)
    
    if (!data.success) {
      throw new Error('API returned error response')
    }
    
    if (!data.citizens || !Array.isArray(data.citizens)) {
      throw new Error('Invalid online citizens data received from API')
    }
    
    return data.citizens
  }

  /**
   * Log social media post in a formatted way
   * @param post Generated social media post
   */
  private logSocialMediaPost(post: GeneratedSocialPost): void {
    const timestamp = post.timestamp.toLocaleString()
    const platformEmoji = this.getPlatformEmoji(post.platform)
    
    this.logSectionHeader(`${platformEmoji} SOCIAL MEDIA POST - ${post.platform.toUpperCase()}`, 80)
    console.log(`👤 Author: ${post.citizen.name}`)
    console.log(`💼 Role: ${post.citizen.role} at ${post.citizen.company}`)
    console.log(`📱 Platform: ${post.platform}`)
    console.log(`⏰ Time: ${timestamp}`)
    console.log(`💾 Status: Saved to database`)
    console.log('')
    console.log('📝 Post Content:')
    console.log(`"${post.content}"`)
    console.log('')
    console.log('🏷️  Hashtags:')
    console.log(post.hashtags.join(' '))
    this.logSectionFooter(`✨ ${post.citizen.name} just posted on ${post.platform}!`, 80)
  }

  /**
   * Get emoji for social media platform
   * @param platform Social media platform
   * @returns Platform emoji
   */
  private getPlatformEmoji(platform: string): string {
    const emojis: { [key: string]: string } = {
      linkedin: '💼',
      tiktok: '🎵',
      instagram: '📸'
    }
    return emojis[platform] || '📱'
  }

  /**
   * Save social media post to database via API
   * @param socialPost Generated social media post
   */
  private async saveSocialMediaPost(socialPost: GeneratedSocialPost): Promise<void> {
    try {
      console.log(`🔄 Attempting to save ${socialPost.platform} post to database...`)
      
      // Ensure content is a string and not a JSON object
      let content = socialPost.content
      if (typeof content !== 'string') {
        console.warn('⚠️ Content is not a string, converting:', typeof content)
        content = typeof content === 'object' ? JSON.stringify(content) : String(content)
      }
      
      // Validate that content is not a JSON object (should be plain text)
      try {
        const parsed = JSON.parse(content)
        if (typeof parsed === 'object' && parsed !== null) {
          console.warn('⚠️ Content appears to be JSON object, extracting text content')
          // If it's a JSON object, try to extract the actual content
          content = parsed.content || parsed.text || content
        }
      } catch {
        // Content is not JSON, which is what we want
      }
      
      console.log('📝 Final content to save:', content.substring(0, 100) + '...')
      
      const postData = {
        content: content,
        author: socialPost.citizen.name,
        hashtags: socialPost.hashtags,
        citizenId: socialPost.citizen.id
      }

      // Determine the correct API endpoint based on platform
      const { endpoint, collectionName } = this.getPlatformConfig(socialPost.platform)

      console.log(`📡 Sending POST request to: ${this.baseUrl}${endpoint}`)
      console.log(`📊 Target collection: ${collectionName}`)
      console.log(`👤 Citizen: ${socialPost.citizen.name} (${socialPost.citizen.role})`)

      const result = await this.makeApiRequest(`${this.baseUrl}${endpoint}`, {
        method: CRON_CONFIG.METHODS.POST,
        body: JSON.stringify(postData)
      })

      console.log(`📋 API Response:`, JSON.stringify(result, null, 2))
      
      if (!result.success) {
        throw new Error(`${socialPost.platform} post API returned error response: ${result.error || 'Unknown error'}`)
      }

      console.log(`✅ ${socialPost.platform} post successfully saved to ${collectionName} collection`)
      console.log(`🆔 Database ID: ${result.postId}`)
      console.log(`📝 Content preview: ${socialPost.content.substring(0, 100)}...`)
      
      // Verify the save by attempting to retrieve the post
      await this.verifyPostSave(socialPost.platform, result.postId, collectionName)
      
    } catch (error) {
      console.error(`❌ Error saving ${socialPost.platform} post to database:`, error)
      console.error(`📊 Post data that failed to save:`, {
        platform: socialPost.platform,
        author: socialPost.citizen.name,
        contentLength: socialPost.content.length,
        hashtagCount: socialPost.hashtags.length
      })
      // Don't throw the error to prevent breaking the cron job
    }
  }

  /**
   * Get platform configuration for API endpoints and collection names
   * @param platform Social media platform
   * @returns Object containing endpoint and collection name
   */
  private getPlatformConfig(platform: string): { endpoint: string, collectionName: string } {
    switch (platform) {
      case 'linkedin':
        return {
          endpoint: CRON_CONFIG.ENDPOINTS.LINKEDIN_POSTS,
          collectionName: 'linkedin-posts'
        }
      case 'tiktok':
        return {
          endpoint: CRON_CONFIG.ENDPOINTS.TIKTOK_POSTS,
          collectionName: 'tiktok-posts'
        }
      case 'instagram':
        return {
          endpoint: CRON_CONFIG.ENDPOINTS.INSTAGRAM_POSTS,
          collectionName: 'instagram-posts'
        }
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  /**
   * Verify that a post was actually saved to the database
   * @param platform Social media platform
   * @param postId Database ID of the saved post
   * @param collectionName Name of the MongoDB collection
   */
  private async verifyPostSave(platform: string, postId: string, collectionName: string): Promise<void> {
    try {
      console.log(`🔍 Verifying ${platform} post save in ${collectionName} collection...`)
      
      // Wait a moment for the database write to complete
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const data = await this.makeApiRequest(
        `${this.baseUrl}${CRON_CONFIG.ENDPOINTS[`${platform.toUpperCase()}_POSTS` as keyof typeof CRON_CONFIG.ENDPOINTS]}`
      )
      
      if (data.success && data.posts) {
        const savedPost = data.posts.find((post: any) => post.id === postId)
        if (savedPost) {
          console.log(`✅ Verification successful: ${platform} post found in database`)
          console.log(`📊 Post details: Author=${savedPost.author}, Platform=${savedPost.platform}`)
        } else {
          console.warn(`⚠️ Verification failed: ${platform} post not found in database`)
        }
      } else {
        console.warn(`⚠️ Could not verify post save: Invalid API response`)
      }
      
    } catch (error) {
      console.warn(`⚠️ Post verification failed:`, error)
      // Don't throw error as this is just verification
    }
  }

  /**
   * Test social media post generation and database save
   * This method can be called manually to test the functionality
   */
  public async testSocialMediaPostGeneration(): Promise<void> {
    try {
      console.log('🧪 Testing social media post generation and database save...')
      
      const onlineCitizens = await this.fetchOnlineCitizens()
      if (!onlineCitizens || onlineCitizens.length === 0) {
        console.log('⚠️ No online citizens available for testing')
        return
      }

      // Select a random online citizen
      const randomCitizen = onlineCitizens[Math.floor(Math.random() * onlineCitizens.length)]
      console.log(`👤 Testing with citizen: ${randomCitizen.name} (${randomCitizen.role})`)
      
      // Generate a social media post
      const socialPost = await SocialMediaPostGenerator.generatePost(randomCitizen)
      console.log(`📱 Generated ${socialPost.platform} post`)
      
      // Save to database
      await this.saveSocialMediaPost(socialPost)
      
      // Log the generated post
      this.logSocialMediaPost(socialPost)
      
      console.log('✅ Social media post generation and save test completed!')
      
    } catch (error) {
      console.error('❌ Social media post generation test failed:', error)
    }
  }
}

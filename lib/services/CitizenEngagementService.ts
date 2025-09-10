import { BaseCronService, CRON_CONFIG } from './BaseCronService'
import { Citizen } from '@/types/citizens'
import { SocialPost } from '@/types/socialMedia'
import { OpenAIService } from './OpenAIService'

/**
 * Interface for citizen engagement result
 */
interface CitizenEngagementResult {
  citizenId: string
  citizenName: string
  platform: 'linkedin' | 'tiktok' | 'instagram'
  postId: string
  postContent: string
  likedComment?: {
    id: string
    content: string
    authorId: string
  }
  engagementReason: string
  timestamp: Date
}

/**
 * Service for simulating citizen engagement with social media posts
 * Picks random online citizens to assess and engage with posts
 */
export class CitizenEngagementService extends BaseCronService {
  private openAIService: OpenAIService

  constructor() {
    super()
    this.openAIService = new OpenAIService()
  }

  /**
   * Main method to simulate citizen engagement with social media posts
   * Picks a random online citizen and has them assess posts from a random platform
   */
  public async simulateCitizenEngagement(): Promise<void> {
    try {
      this.logSectionHeader('🎯 CITIZEN SOCIAL MEDIA ENGAGEMENT SIMULATION')

      // Get all citizens
      const citizens = await this.fetchCitizens()
      
      // Filter for online citizens only
      const onlineCitizens = citizens.filter(citizen => citizen.isOnline === true)
      
      if (onlineCitizens.length === 0) {
        console.log('⚠️ No online citizens found for engagement simulation')
        return
      }

      // Pick a random online citizen
      const randomCitizen = this.getRandomCitizens(onlineCitizens, 1)[0]
      console.log(`👤 Selected citizen: ${randomCitizen.name} (${randomCitizen.role} at ${randomCitizen.company})`)

      // Pick a random platform
      const platforms: ('linkedin' | 'tiktok' | 'instagram')[] = ['linkedin', 'tiktok', 'instagram']
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)]
      console.log(`📱 Selected platform: ${randomPlatform.toUpperCase()}`)

      // Fetch posts from the selected platform
      const posts = await this.fetchPostsFromPlatform(randomPlatform)
      
      if (posts.length === 0) {
        console.log(`⚠️ No posts found on ${randomPlatform}`)
        return
      }

      // Have the citizen assess the posts using OpenAI
      const engagementResult = await this.assessPostsWithCitizen(randomCitizen, posts, randomPlatform)
      
      if (engagementResult) {
        // Log the engagement
        await this.logCitizenEngagement(engagementResult)
        
        // Like the post if the citizen found it engaging
        if (engagementResult.likedComment) {
          await this.likePost(engagementResult.postId, randomPlatform, randomCitizen.id)
        } else {
          // Still like the post even if no specific comment was liked
          await this.likePost(engagementResult.postId, randomPlatform, randomCitizen.id)
        }
        
        console.log(`🎉 ENGAGEMENT COMPLETE: ${randomCitizen.name} successfully engaged with ${randomPlatform.toUpperCase()} content`)
        console.log(`📝 Personal Reasoning: "${engagementResult.engagementReason}"`)
      }

      this.logSectionFooter('✅ Citizen engagement simulation completed')

    } catch (error) {
      console.error('❌ Error in citizen engagement simulation:', error)
      throw error
    }
  }

  /**
   * Fetch posts from a specific platform
   */
  private async fetchPostsFromPlatform(platform: 'linkedin' | 'tiktok' | 'instagram'): Promise<SocialPost[]> {
    const endpoint = CRON_CONFIG.ENDPOINTS[`${platform.toUpperCase()}_POSTS` as keyof typeof CRON_CONFIG.ENDPOINTS]
    
    if (!endpoint) {
      throw new Error(`No endpoint found for platform: ${platform}`)
    }

    const response = await this.makeApiRequest(`${this.baseUrl}${endpoint}`)
    
    if (!response.success || !response.posts) {
      throw new Error(`Failed to fetch posts from ${platform}`)
    }

    return response.posts
  }

  /**
   * Have a citizen assess posts using OpenAI function calling to determine which one catches their attention
   */
  private async assessPostsWithCitizen(
    citizen: Citizen, 
    posts: SocialPost[], 
    platform: 'linkedin' | 'tiktok' | 'instagram'
  ): Promise<CitizenEngagementResult | null> {
    try {
      // Limit to recent posts (last 10) for better performance
      const recentPosts = posts.slice(0, 10)
      
      if (recentPosts.length === 0) {
        return null
      }

      console.log(`🤖 Using OpenAI function calling to assess ${recentPosts.length} posts for ${citizen.name}`)
      
      // Use OpenAI function calling to have the citizen assess the posts
      const assessment = await this.openAIService.assessPostsWithFunctionCalling(citizen, recentPosts, platform)
      
      if (!assessment) {
        console.log('⚠️ OpenAI did not return a valid assessment')
        return null
      }

      // Find the selected post
      const selectedPost = recentPosts.find(post => post.id.toString() === assessment.postId)
      
      if (!selectedPost) {
        console.log('⚠️ Selected post not found in recent posts')
        return null
      }

      // Find the liked comment if specified
      let likedComment = undefined
      if (assessment.likedCommentId && selectedPost.commentsList) {
        const comment = selectedPost.commentsList.find((c: any) => c.id === assessment.likedCommentId)
        if (comment) {
          likedComment = {
            id: comment.id,
            content: comment.content,
            authorId: comment.authorId
          }
        }
      }

      console.log(`✅ ${citizen.name} selected post ${assessment.postId}`)
      console.log(`💭 AI Reasoning: "${assessment.reason}"`)

      return {
        citizenId: citizen.id,
        citizenName: citizen.name,
        platform,
        postId: selectedPost.id.toString(),
        postContent: selectedPost.content,
        likedComment,
        engagementReason: assessment.reason,
        timestamp: new Date()
      }

    } catch (error) {
      console.error('❌ Error assessing posts with citizen:', error)
      return null
    }
  }


  /**
   * Like a post on behalf of the citizen
   */
  private async likePost(postId: string, platform: 'linkedin' | 'tiktok' | 'instagram', citizenId: string): Promise<void> {
    try {
      const response = await this.makeApiRequest(`${this.baseUrl}/api/posts/like`, {
        method: 'POST',
        body: JSON.stringify({
          postId,
          platform,
          userId: citizenId
        })
      })

      if (response.success) {
        console.log(`✅ SUCCESS: Citizen ${citizenId} has successfully liked post ${postId} on ${platform.toUpperCase()}`)
        console.log(`📊 Post now has ${response.likes} total likes`)
        console.log(`🎯 Engagement tracked in database - citizen's like has been recorded`)
      } else {
        console.log(`⚠️ Failed to like post: ${response.error}`)
      }
    } catch (error) {
      console.error('❌ Error liking post:', error)
    }
  }

  /**
   * Log the citizen's engagement activity
   */
  private async logCitizenEngagement(engagement: CitizenEngagementResult): Promise<void> {
    const logEntry = {
      timestamp: engagement.timestamp,
      citizen: {
        id: engagement.citizenId,
        name: engagement.citizenName
      },
      platform: engagement.platform,
      post: {
        id: engagement.postId,
        content: engagement.postContent.substring(0, 100) + '...'
      },
      engagement: {
        reason: engagement.engagementReason,
        reasonType: 'AI-Generated Personal Reasoning',
        likedComment: engagement.likedComment ? {
          id: engagement.likedComment.id,
          content: engagement.likedComment.content.substring(0, 50) + '...',
          authorId: engagement.likedComment.authorId
        } : null
      },
      aiAssessment: {
        method: 'OpenAI Function Calling',
        toolUsed: 'likePost',
        reasoning: 'AI analyzed posts based on citizen personality and selected most relevant post'
      },
      status: 'SUCCESS - Post liked and engagement tracked in database'
    }

    console.log('📝 ENGAGEMENT LOG:')
    console.log(JSON.stringify(logEntry, null, 2))
    
    // Save engagement data to database
    await this.saveEngagementToDatabase(engagement)
  }

  /**
   * Save engagement data to the database
   */
  private async saveEngagementToDatabase(engagement: CitizenEngagementResult): Promise<void> {
    try {
      console.log(`💾 Attempting to save engagement data for ${engagement.citizenName}...`)
      
      const engagementData = {
        citizenId: engagement.citizenId,
        citizenName: engagement.citizenName,
        platform: engagement.platform,
        postId: engagement.postId,
        postContent: engagement.postContent,
        engagementType: 'like',
        engagementReason: engagement.engagementReason,
        likedComment: engagement.likedComment,
        timestamp: engagement.timestamp.toISOString()
      }
      
      console.log(`📤 Sending engagement data:`, JSON.stringify(engagementData, null, 2))
      
      const response = await this.makeApiRequest(`${this.baseUrl}/api/engagement-log`, {
        method: 'POST',
        body: JSON.stringify(engagementData)
      })

      console.log(`📥 API Response:`, JSON.stringify(response, null, 2))

      if (response.success) {
        console.log(`✅ SUCCESS: Engagement data saved to database: ${response.engagementId}`)
      } else {
        console.log(`❌ FAILED: Could not save engagement data: ${response.error}`)
      }
    } catch (error) {
      console.error('❌ Error saving engagement data:', error)
    }
  }

  /**
   * Test the citizen engagement functionality
   */
  public async testCitizenEngagement(): Promise<void> {
    console.log('🧪 Testing citizen engagement service...')
    await this.simulateCitizenEngagement()
  }
}

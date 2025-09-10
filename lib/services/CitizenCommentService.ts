import { BaseCronService, CRON_CONFIG } from './BaseCronService'
import { Citizen } from '@/types/citizens'
import { SocialPost } from '@/types/socialMedia'
import { OpenAIService } from './OpenAIService'

/**
 * Interface for citizen comment result
 */
interface CitizenCommentResult {
  citizenId: string
  citizenName: string
  platform: 'linkedin' | 'tiktok' | 'instagram'
  postId: string
  postContent: string
  comment: {
    id: string
    content: string
    authorId: string
  }
  commentReason: string
  timestamp: Date
}

/**
 * Service for simulating citizen comments on social media posts
 * Picks random online citizens to comment on posts that resonate with them
 */
export class CitizenCommentService extends BaseCronService {
  private openAIService: OpenAIService

  constructor() {
    super()
    this.openAIService = new OpenAIService()
  }

  /**
   * Main method to simulate citizen commenting on social media posts
   * Picks a random online citizen and has them comment on a post that resonates
   */
  public async simulateCitizenCommenting(): Promise<void> {
    try {
      this.logSectionHeader('💬 CITIZEN SOCIAL MEDIA COMMENTING SIMULATION')

      // Get all citizens
      const citizens = await this.fetchCitizens()
      
      // Filter for online citizens only
      const onlineCitizens = citizens.filter(citizen => citizen.isOnline === true)
      
      if (onlineCitizens.length === 0) {
        console.log('⚠️ No online citizens found for commenting simulation')
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

      // Have the citizen assess posts and potentially comment
      const commentResult = await this.assessPostsForCommenting(randomCitizen, posts, randomPlatform)
      
      if (commentResult) {
        // Add the comment to the post
        await this.addCommentToPost(commentResult.postId, randomPlatform, randomCitizen.id, commentResult.comment.content)
        
        // Log the commenting activity
        await this.logCitizenCommenting(commentResult)
      } else {
        console.log(`🤔 ${randomCitizen.name} didn't find any posts worth commenting on`)
      }

      this.logSectionFooter('✅ Citizen commenting simulation completed')

    } catch (error) {
      console.error('❌ Error in citizen commenting simulation:', error)
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
   * Have a citizen assess posts using OpenAI function calling to determine if they want to comment
   */
  private async assessPostsForCommenting(
    citizen: Citizen, 
    posts: SocialPost[], 
    platform: 'linkedin' | 'tiktok' | 'instagram'
  ): Promise<CitizenCommentResult | null> {
    try {
      // Limit to recent posts (last 10) for better performance
      const recentPosts = posts.slice(0, 10)
      
      if (recentPosts.length === 0) {
        return null
      }

      console.log(`🤖 Using OpenAI function calling to assess ${recentPosts.length} posts for commenting by ${citizen.name}`)
      
      // Use OpenAI function calling to have the citizen assess the posts for commenting
      const assessment = await this.openAIService.assessPostsForCommenting(citizen, recentPosts, platform)
      
      if (!assessment) {
        console.log('⚠️ OpenAI did not return a valid commenting assessment')
        return null
      }

      // Find the selected post
      const selectedPost = recentPosts.find(post => post.id.toString() === assessment.postId)
      
      if (!selectedPost) {
        console.log('⚠️ Selected post not found in recent posts')
        return null
      }

      console.log(`✅ ${citizen.name} wants to comment on post ${assessment.postId}`)
      console.log(`💭 Comment reasoning: "${assessment.commentReason}"`)

      return {
        citizenId: citizen.id,
        citizenName: citizen.name,
        platform,
        postId: selectedPost.id.toString(),
        postContent: selectedPost.content,
        comment: {
          id: assessment.commentId,
          content: assessment.commentContent,
          authorId: citizen.id
        },
        commentReason: assessment.commentReason,
        timestamp: new Date()
      }

    } catch (error) {
      console.error('❌ Error assessing posts for commenting:', error)
      return null
    }
  }

  /**
   * Add a comment to a post
   */
  private async addCommentToPost(
    postId: string, 
    platform: 'linkedin' | 'tiktok' | 'instagram', 
    citizenId: string, 
    commentContent: string
  ): Promise<void> {
    try {
      const response = await this.makeApiRequest(`${this.baseUrl}/api/posts/comment`, {
        method: 'POST',
        body: JSON.stringify({
          postId,
          platform,
          userId: citizenId,
          content: commentContent
        })
      })

      if (response.success) {
        console.log(`✅ SUCCESS: Citizen ${citizenId} has successfully commented on post ${postId} on ${platform.toUpperCase()}`)
        console.log(`💬 Comment: "${commentContent}"`)
        console.log(`📊 Comment added to database - engagement tracked`)
      } else {
        console.log(`⚠️ Failed to add comment: ${response.error}`)
      }
    } catch (error) {
      console.error('❌ Error adding comment:', error)
    }
  }

  /**
   * Log the citizen's commenting activity
   */
  private async logCitizenCommenting(comment: CitizenCommentResult): Promise<void> {
    const logEntry = {
      timestamp: comment.timestamp,
      citizen: {
        id: comment.citizenId,
        name: comment.citizenName
      },
      platform: comment.platform,
      post: {
        id: comment.postId,
        content: comment.postContent.substring(0, 100) + '...'
      },
      comment: {
        id: comment.comment.id,
        content: comment.comment.content,
        authorId: comment.comment.authorId
      },
      engagement: {
        reason: comment.commentReason,
        reasonType: 'AI-Generated Personal Commenting Reasoning'
      },
      aiAssessment: {
        method: 'OpenAI Function Calling',
        toolUsed: 'addComment',
        reasoning: 'AI analyzed posts and generated personalized comment based on citizen personality'
      },
      status: 'SUCCESS - Comment added and engagement tracked in database'
    }

    console.log('📝 COMMENTING LOG:')
    console.log(JSON.stringify(logEntry, null, 2))
    
    // Save comment data to database
    await this.saveCommentToDatabase(comment)
  }

  /**
   * Save comment data to the database
   */
  private async saveCommentToDatabase(comment: CitizenCommentResult): Promise<void> {
    try {
      console.log(`💾 Attempting to save comment data for ${comment.citizenName}...`)
      
      const commentData = {
        citizenId: comment.citizenId,
        citizenName: comment.citizenName,
        platform: comment.platform,
        postId: comment.postId,
        postContent: comment.postContent,
        engagementType: 'comment',
        engagementReason: comment.commentReason,
        commentContent: comment.comment.content,
        commentId: comment.comment.id,
        timestamp: comment.timestamp.toISOString()
      }
      
      console.log(`📤 Sending comment data:`, JSON.stringify(commentData, null, 2))
      
      const response = await this.makeApiRequest(`${this.baseUrl}/api/engagement-log`, {
        method: 'POST',
        body: JSON.stringify(commentData)
      })

      console.log(`📥 API Response:`, JSON.stringify(response, null, 2))

      if (response.success) {
        console.log(`✅ SUCCESS: Comment data saved to database: ${response.engagementId}`)
      } else {
        console.log(`❌ FAILED: Could not save comment data: ${response.error}`)
      }
    } catch (error) {
      console.error('❌ Error saving comment data:', error)
    }
  }

  /**
   * Test the citizen commenting functionality
   */
  public async testCitizenCommenting(): Promise<void> {
    console.log('🧪 Testing citizen commenting service...')
    await this.simulateCitizenCommenting()
  }
}

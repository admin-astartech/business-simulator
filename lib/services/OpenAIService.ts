import { Citizen } from '@/types/citizens'

/**
 * Interface for OpenAI API response
 */
interface OpenAIResponse {
  choices: Array<{
    message: {
      content?: string
      tool_calls?: Array<{
        id: string
        type: 'function'
        function: {
          name: string
          arguments: string
        }
      }>
    }
  }>
  usage: {
    total_tokens: number
  }
}

/**
 * Interface for personality analysis
 */
interface PersonalityProfile {
  primaryTraits: string[]
  communicationStyle: string
  interests: string[]
  values: string[]
  motivation: string
}

/**
 * Service for generating realistic social media posts using OpenAI
 */
export class OpenAIService {
  private readonly apiKey: string
  private readonly baseUrl: string = 'https://api.openai.com/v1/chat/completions'

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    if (!this.apiKey) {
      console.warn('⚠️ OPENAI_API_KEY not found in environment variables')
    }
  }

  /**
   * Generate a realistic social media post using OpenAI
   * @param citizen The citizen to generate a post for
   * @param platform The social media platform
   * @returns Promise<GeneratedSocialPost> Generated post with AI content
   */
  public async generateSocialMediaPost(
    citizen: Citizen, 
    platform: 'linkedin' | 'tiktok' | 'instagram'
  ): Promise<{
    content: string
    hashtags: string[]
  }> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const personalityProfile = this.analyzePersonality(citizen)
      const prompt = this.buildPrompt(citizen, platform, personalityProfile)
      
      const response = await this.callOpenAI(prompt)
      const parsedContent = this.parseAIResponse(response)
      
      return {
        content: parsedContent.content,
        hashtags: parsedContent.hashtags
      }
    } catch (error) {
      console.error('❌ Error generating AI post:', error)
      // Fallback to template-based generation
      return this.generateFallbackPost(citizen, platform)
    }
  }

  /**
   * Analyze citizen's personality based on their data
   * @param citizen The citizen to analyze
   * @returns PersonalityProfile Analysis of the citizen's personality
   */
  private analyzePersonality(citizen: Citizen): PersonalityProfile {
    const role = citizen.role.toLowerCase()
    const company = citizen.company.toLowerCase()
    
    // Analyze based on role
    const roleTraits = this.getRoleTraits(role)
    const communicationStyle = this.getCommunicationStyle(role)
    const interests = this.getInterests(role, company)
    const values = this.getValues(role, company)
    const motivation = this.getMotivation(role)

    return {
      primaryTraits: roleTraits,
      communicationStyle,
      interests,
      values,
      motivation
    }
  }

  /**
   * Get personality traits based on role
   */
  private getRoleTraits(role: string): string[] {
    const traitMap: { [key: string]: string[] } = {
      'manager': ['leadership', 'strategic thinking', 'delegation', 'communication'],
      'developer': ['analytical', 'problem-solving', 'detail-oriented', 'technical'],
      'designer': ['creative', 'aesthetic', 'user-focused', 'innovative'],
      'marketing': ['persuasive', 'creative', 'data-driven', 'trend-aware'],
      'sales': ['persuasive', 'relationship-building', 'goal-oriented', 'resilient'],
      'analyst': ['analytical', 'data-driven', 'methodical', 'insightful'],
      'consultant': ['strategic', 'adaptable', 'client-focused', 'expertise'],
      'engineer': ['technical', 'problem-solving', 'systematic', 'innovative'],
      'director': ['visionary', 'strategic', 'leadership', 'decision-making'],
      'coordinator': ['organized', 'collaborative', 'detail-oriented', 'efficient']
    }

    // Find matching traits or use default
    for (const [key, traits] of Object.entries(traitMap)) {
      if (role.includes(key)) {
        return traits
      }
    }

    return ['professional', 'dedicated', 'collaborative', 'growth-oriented']
  }

  /**
   * Get communication style based on role
   */
  private getCommunicationStyle(role: string): string {
    if (role.includes('manager') || role.includes('director') || role.includes('lead')) {
      return 'authoritative yet approachable'
    }
    if (role.includes('developer') || role.includes('engineer') || role.includes('analyst')) {
      return 'technical and data-driven'
    }
    if (role.includes('designer') || role.includes('marketing') || role.includes('creative')) {
      return 'creative and engaging'
    }
    if (role.includes('sales') || role.includes('consultant')) {
      return 'persuasive and relationship-focused'
    }
    return 'professional and clear'
  }

  /**
   * Get interests based on role and company
   */
  private getInterests(role: string, company: string): string[] {
    const baseInterests = ['professional development', 'industry trends', 'team collaboration']
    
    if (role.includes('tech') || role.includes('developer') || role.includes('engineer')) {
      baseInterests.push('technology innovation', 'coding', 'system architecture')
    }
    if (role.includes('marketing') || role.includes('sales')) {
      baseInterests.push('customer engagement', 'brand building', 'market research')
    }
    if (role.includes('design') || role.includes('creative')) {
      baseInterests.push('visual design', 'user experience', 'creative problem-solving')
    }
    if (role.includes('data') || role.includes('analyst')) {
      baseInterests.push('data analysis', 'business intelligence', 'statistical modeling')
    }

    return baseInterests
  }

  /**
   * Get values based on role and company
   */
  private getValues(role: string, company: string): string[] {
    const baseValues = ['excellence', 'integrity', 'collaboration']
    
    if (role.includes('manager') || role.includes('lead') || role.includes('director')) {
      baseValues.push('leadership', 'mentorship', 'team development')
    }
    if (role.includes('tech') || role.includes('developer')) {
      baseValues.push('innovation', 'efficiency', 'continuous learning')
    }
    if (role.includes('sales') || role.includes('marketing')) {
      baseValues.push('customer success', 'growth', 'relationship building')
    }

    return baseValues
  }

  /**
   * Get motivation based on role
   */
  private getMotivation(role: string): string {
    if (role.includes('manager') || role.includes('lead')) {
      return 'inspiring and developing others'
    }
    if (role.includes('developer') || role.includes('engineer')) {
      return 'building innovative solutions'
    }
    if (role.includes('sales') || role.includes('marketing')) {
      return 'driving business growth'
    }
    if (role.includes('analyst') || role.includes('data')) {
      return 'uncovering insights from data'
    }
    return 'making a meaningful impact'
  }

  /**
   * Build the prompt for OpenAI
   */
  private buildPrompt(citizen: Citizen, platform: string, personality: PersonalityProfile): string {
    const platformGuidelines = this.getPlatformGuidelines(platform)
    
    return `You are a social media content creator. Generate a realistic, engaging social media post for the following person:

PERSON PROFILE:
- Name: ${citizen.name}
- Role: ${citizen.role}
- Company: ${citizen.company}
- Personality Traits: ${personality.primaryTraits.join(', ')}
- Communication Style: ${personality.communicationStyle}
- Interests: ${personality.interests.join(', ')}
- Values: ${personality.values.join(', ')}
- Motivation: ${personality.motivation}

PLATFORM: ${platform.toUpperCase()}
${platformGuidelines}

REQUIREMENTS:
1. Write in first person as if ${citizen.name} is posting
2. Make it sound natural and authentic to their personality
3. Include relevant industry insights or experiences
4. Match the platform's tone and style
5. Include 3-5 relevant hashtags
6. Keep it engaging and aligned with the citizen's personality
7. Make it feel current and timely and aligned to current events

FORMAT YOUR RESPONSE AS JSON:
{
  "content": "The main post content here...",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"]
}

Generate a realistic post that this person would actually write and share.`
  }

  /**
   * Get platform-specific guidelines
   */
  private getPlatformGuidelines(platform: string): string {
    const guidelines = {
      linkedin: `LINKEDIN GUIDELINES:
- Professional tone, industry-focused
- 150-300 words ideal
- Include insights, lessons learned, or industry thoughts
- Use professional language
- Focus on career growth, industry trends, or professional achievements
- Include relevant professional hashtags`,

      tiktok: `TIKTOK GUIDELINES:
- Casual, energetic tone
- 50-150 words ideal
- Use trending language and emojis
- Make it relatable and entertaining
- Focus on day-in-the-life, tips, or quick insights
- Use popular hashtags and trends`,

      instagram: `INSTAGRAM GUIDELINES:
- Visual storytelling approach
- 100-200 words ideal
- Mix of professional and personal
- Use emojis and engaging language
- Focus on lifestyle, behind-the-scenes, or inspirational content
- Include lifestyle and professional hashtags`
    }

    return guidelines[platform as keyof typeof guidelines] || guidelines.linkedin
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<OpenAIResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert social media content creator who generates authentic, engaging posts that match the personality and professional background of the person posting.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  /**
   * Parse AI response and extract content and hashtags
   */
  private parseAIResponse(response: OpenAIResponse): { content: string, hashtags: string[] } {
    try {
      const content = response.choices[0]?.message?.content || ''
      console.log('🔍 Raw OpenAI response content:', content.substring(0, 200) + '...')
      
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        console.log('📋 Parsed JSON:', parsed)
        
        // Ensure we have valid content - if parsed.content is empty or invalid, use the raw content
        const extractedContent = parsed.content && typeof parsed.content === 'string' && parsed.content.trim() 
          ? parsed.content.trim() 
          : content.trim()
        
        console.log('✅ Extracted content:', extractedContent.substring(0, 100) + '...')
        console.log('🏷️ Extracted hashtags:', parsed.hashtags)
        
        return {
          content: extractedContent,
          hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : []
        }
      }
      
      // Fallback: extract hashtags from content
      const hashtagRegex = /#\w+/g
      const hashtags = content.match(hashtagRegex) || []
      const cleanContent = content.replace(hashtagRegex, '').trim()
      
      console.log('⚠️ No JSON found, using fallback parsing')
      console.log('📝 Clean content:', cleanContent.substring(0, 100) + '...')
      
      return {
        content: cleanContent,
        hashtags: hashtags
      }
    } catch (error) {
      console.error('❌ Error parsing AI response:', error)
      console.log('🔄 Using fallback content')
      return {
        content: response.choices[0]?.message?.content || 'Generated post content',
        hashtags: ['#professional', '#career', '#growth']
      }
    }
  }

  /**
   * Generate fallback post when OpenAI fails
   */
  private generateFallbackPost(citizen: Citizen, platform: string): { content: string, hashtags: string[] } {
    const templates = {
      linkedin: `Excited to share some insights from my role as ${citizen.role} at ${citizen.company}. The industry continues to evolve, and I'm grateful to be part of this journey. Looking forward to connecting with fellow professionals!`,
      tiktok: `POV: You're a ${citizen.role} and loving every minute of it! 💼 #WorkLife #CareerGoals`,
      instagram: `Behind the scenes of being a ${citizen.role} at ${citizen.company} ✨ Every day brings new challenges and opportunities! #WorkLife #ProfessionalGrowth`
    }

    const content = templates[platform as keyof typeof templates] || templates.linkedin
    const hashtags = ['#professional', '#career', '#growth', `#${citizen.role.toLowerCase().replace(/\s+/g, '')}`]

    return { content, hashtags }
  }

  /**
   * Assess social media posts using function calling
   * @param citizen The citizen assessing the posts
   * @param posts Array of social media posts to assess
   * @param platform The social media platform
   * @returns Promise<{postId: string, reason: string, likedCommentId?: string}> Assessment result
   */
  public async assessPostsWithFunctionCalling(
    citizen: Citizen,
    posts: any[],
    platform: 'linkedin' | 'tiktok' | 'instagram'
  ): Promise<{postId: string, reason: string, likedCommentId?: string} | null> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const personalityProfile = this.analyzePersonality(citizen)
      const prompt = this.buildPostAssessmentPrompt(citizen, posts, platform, personalityProfile)
      
      const response = await this.callOpenAIWithFunctionCalling(prompt)
      
      // Parse the function call response
      const message = response.choices[0]?.message
      if (message?.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0]
        if (toolCall.function.name === 'likePost') {
          const args = JSON.parse(toolCall.function.arguments)
          return {
            postId: args.postId,
            reason: args.reason,
            likedCommentId: args.likedCommentId
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ Error in function calling assessment:', error)
      return null
    }
  }

  /**
   * Build prompt for post assessment with function calling
   */
  private buildPostAssessmentPrompt(
    citizen: Citizen, 
    posts: any[], 
    platform: string, 
    personality: PersonalityProfile
  ): string {
    const postsText = posts.map((post, index) => 
      `Post ${index + 1} (ID: ${post.id}):
Content: ${post.content}
Likes: ${post.likes}
Comments: ${post.comments}
Author: ${post.author || 'Unknown'}
Time: ${post.time}
${post.commentsList && post.commentsList.length > 0 ? 
  `Comments:\n${post.commentsList.map((comment: any, i: number) => 
    `  ${i + 1}. (ID: ${comment.id}) ${comment.content} - by ${comment.authorId}`
  ).join('\n')}` : 'No comments available'}
---`
    ).join('\n\n')

    return `You are ${citizen.name}, a ${citizen.role} at ${citizen.company}. 

Your personality profile:
- Traits: ${personality.primaryTraits.join(', ')}
- Communication Style: ${personality.communicationStyle}
- Interests: ${personality.interests.join(', ')}
- Values: ${personality.values.join(', ')}
- Motivation: ${personality.motivation}

You're browsing ${platform.toUpperCase()} and see these recent posts:

${postsText}

Based on your personality, interests, and professional background, which post catches your attention the most? 

IMPORTANT: When you use the likePost function, provide a realistic, personal engagement reason that:
1. Reflects your specific personality traits and professional background
2. Explains what specifically about the post content resonated with you
3. Mentions how it relates to your work at ${citizen.company} or your interests
4. Sounds like something you would actually think or say
5. Is authentic to your communication style (${personality.communicationStyle})
6. If you select a comment, explain why that particular comment stood out to you

Make the reason sound natural and personal - like you're genuinely explaining to a friend why you liked this post.`
  }

  /**
   * Call OpenAI API with function calling
   */
  private async callOpenAIWithFunctionCalling(prompt: string): Promise<OpenAIResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a social media user who assesses posts based on your personality and interests. You must use the likePost function to indicate which post you want to engage with. When providing your reason, be authentic, personal, and specific about what caught your attention. Write as if you\'re genuinely explaining to a friend why you liked this particular post.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'likePost',
              description: 'Like a social media post that catches your attention',
              parameters: {
                type: 'object',
                properties: {
                  postId: {
                    type: 'string',
                    description: 'The ID of the post you want to like'
                  },
                  reason: {
                    type: 'string',
                    description: 'Provide a detailed, personal explanation of why this post caught your attention. Be specific about what resonated with you, how it relates to your professional background, and what made you want to engage with it. Write it as if you\'re explaining to a friend why you liked this post.'
                  },
                  likedCommentId: {
                    type: 'string',
                    description: 'The ID of the comment you liked most (if any)',
                    optional: true
                  }
                },
                required: ['postId', 'reason']
              }
            }
          }
        ],
        tool_choice: 'auto',
        max_tokens: 300,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  /**
   * Assess social media posts for commenting using function calling
   * @param citizen The citizen assessing the posts
   * @param posts Array of social media posts to assess
   * @param platform The social media platform
   * @returns Promise<{postId: string, commentContent: string, commentReason: string, commentId: string}> Assessment result
   */
  public async assessPostsForCommenting(
    citizen: Citizen,
    posts: any[],
    platform: 'linkedin' | 'tiktok' | 'instagram'
  ): Promise<{postId: string, commentContent: string, commentReason: string, commentId: string} | null> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const personalityProfile = this.analyzePersonality(citizen)
      const prompt = this.buildCommentAssessmentPrompt(citizen, posts, platform, personalityProfile)
      
      const response = await this.callOpenAIWithCommentFunctionCalling(prompt)
      
      // Parse the function call response
      const message = response.choices[0]?.message
      if (message?.tool_calls && message.tool_calls.length > 0) {
        const toolCall = message.tool_calls[0]
        if (toolCall.function.name === 'addComment') {
          const args = JSON.parse(toolCall.function.arguments)
          return {
            postId: args.postId,
            commentContent: args.commentContent,
            commentReason: args.commentReason,
            commentId: args.commentId
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ Error in function calling comment assessment:', error)
      return null
    }
  }

  /**
   * Build prompt for comment assessment with function calling
   */
  private buildCommentAssessmentPrompt(
    citizen: Citizen, 
    posts: any[], 
    platform: string, 
    personality: PersonalityProfile
  ): string {
    const postsText = posts.map((post, index) => 
      `Post ${index + 1} (ID: ${post.id}):
Content: ${post.content}
Likes: ${post.likes}
Comments: ${post.comments}
Author: ${post.author || 'Unknown'}
Time: ${post.time}
${post.commentsList && post.commentsList.length > 0 ? 
  `Existing Comments:\n${post.commentsList.map((comment: any, i: number) => 
    `  ${i + 1}. ${comment.content} - by ${comment.authorId}`
  ).join('\n')}` : 'No existing comments'}
---`
    ).join('\n\n')

    return `You are ${citizen.name}, a ${citizen.role} at ${citizen.company}. 

Your personality profile:
- Traits: ${personality.primaryTraits.join(', ')}
- Communication Style: ${personality.communicationStyle}
- Interests: ${personality.interests.join(', ')}
- Values: ${personality.values.join(', ')}
- Motivation: ${personality.motivation}

You're browsing ${platform.toUpperCase()} and see these recent posts:

${postsText}

Look for a post that genuinely resonates with you and that you would want to comment on. Consider:
1. Which post content connects with your professional experience or personal interests
2. What valuable insight, question, or perspective you could add to the conversation
3. How your comment would add value to the existing discussion
4. Whether the post's tone and content match your communication style

IMPORTANT: When you use the addComment function, provide:
1. A realistic, engaging comment that matches your personality and communication style
2. A detailed reason explaining why this post resonated with you and why you wanted to comment
3. Make the comment sound natural and authentic - like something you would actually write
4. Ensure the comment adds value to the conversation and reflects your professional background

Only comment if you genuinely have something meaningful to contribute to the discussion.`
  }

  /**
   * Call OpenAI API with comment function calling
   */
  private async callOpenAIWithCommentFunctionCalling(prompt: string): Promise<OpenAIResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a social media user who assesses posts and writes thoughtful comments based on your personality and interests. You must use the addComment function to indicate which post you want to comment on and provide your comment. Write authentic, valuable comments that add to the conversation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'addComment',
              description: 'Add a thoughtful comment to a social media post that resonates with you',
              parameters: {
                type: 'object',
                properties: {
                  postId: {
                    type: 'string',
                    description: 'The ID of the post you want to comment on'
                  },
                  commentContent: {
                    type: 'string',
                    description: 'The actual comment content you want to post. Make it engaging, authentic, and valuable to the conversation. Match your communication style and personality.'
                  },
                  commentReason: {
                    type: 'string',
                    description: 'Explain why this post resonated with you and why you wanted to comment on it. Be specific about what caught your attention and how it relates to your professional background or interests.'
                  },
                  commentId: {
                    type: 'string',
                    description: 'A unique ID for the comment (generate a random string)'
                  }
                },
                required: ['postId', 'commentContent', 'commentReason', 'commentId']
              }
            }
          }
        ],
        tool_choice: 'auto',
        max_tokens: 1000,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  }

  /**
   * Check if OpenAI service is available
   */
  public isAvailable(): boolean {
    return !!this.apiKey
  }
}

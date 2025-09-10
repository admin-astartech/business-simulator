import { Citizen } from '@/types/citizens'
import { OpenAIService } from './services/OpenAIService'

/**
 * Interface for generated social media post
 */
export interface GeneratedSocialPost {
  platform: 'linkedin' | 'tiktok' | 'instagram'
  content: string
  hashtags: string[]
  citizen: {
    id: string
    name: string
    role: string
    company: string
  }
  timestamp: Date
}

/**
 * Social media post templates organized by platform and personality traits
 */
const POST_TEMPLATES = {
  linkedin: {
    professional: [
      "Thrilled to share that our {role} team at {company} just delivered {achievement}! The collaboration and dedication of everyone involved was truly inspiring. \n\nKey takeaways from this project:\n• {insight1}\n• {insight2}\n• {insight3}\n\nWhat challenges have you faced in {industry} recently? I'd love to hear your thoughts in the comments below. 👇\n\n#ProfessionalGrowth #TeamWork #{industry} #Leadership",
      "Excited to reflect on my journey as a {role} and the evolution I've witnessed in {industry}. The landscape has changed dramatically, and here's what I've learned:\n\n🔹 {lesson1}\n🔹 {lesson2}\n🔹 {lesson3}\n\nThese insights have shaped not just my career, but how I approach every project at {company}. \n\nWhat's the most valuable lesson you've learned in your {role} career? Share your experience below! 💭\n\n#CareerGrowth #IndustryInsights #ProfessionalDevelopment #{industry}",
      "Proud to be part of the {company} team where we're not just following industry trends—we're setting them. As a {role}, I've seen firsthand how {value} drives real change.\n\nThis week, we {achievement}, and it reminded me why I love what I do. The impact we can have when we focus on {value} is incredible.\n\nWhat values drive your work? I'd love to learn from your perspective. 🤝\n\n#CompanyCulture #Innovation #Values #ProfessionalLife #{industry}",
      "The future of {industry} is unfolding right before our eyes, and I'm honored to be part of this transformation at {company}. As a {role}, I see daily how {trend} is reshaping our field.\n\nHere's what excites me most:\n✅ {excitement1}\n✅ {excitement2}\n✅ {excitement3}\n\nChange can be challenging, but it's also our greatest opportunity for growth. How are you adapting to the evolving {industry} landscape?\n\n#FutureOfWork #Innovation #Adaptability #{industry} #ProfessionalGrowth",
      "After {timeframe} in {role} at {company}, I've learned that success isn't just about individual achievement—it's about lifting others up along the way. \n\nThis week, I had the privilege of {mentoring_experience}, and it reminded me why I'm passionate about {interest}.\n\nThree principles that guide my work:\n1. {principle1}\n2. {principle2}\n3. {principle3}\n\nWhat principles guide your professional journey? I'd love to hear your thoughts! 💡\n\n#Mentorship #ProfessionalValues #Leadership #CareerDevelopment #{industry}"
    ],
    analytical: [
      "Data doesn't lie, and the insights from our recent {role} analysis at {company} are telling a fascinating story. Here's what the numbers revealed:\n\n📊 Key Findings:\n• {metric1}: {value1}\n• {metric2}: {value2}\n• {metric3}: {value3}\n\nThis data-driven approach has been crucial in {achievement}. When we let the data guide our decisions, we see {outcome}.\n\nWhat metrics do you find most valuable in {industry}? I'm always curious about different analytical approaches. 📈\n\n#DataAnalytics #BusinessIntelligence #DataDriven #Analytics #{industry}",
      "Just completed a deep dive into {topic} trends, and the patterns are more interesting than I expected. As a {role}, I believe data should inform every strategic decision.\n\nHere's what stood out:\n🔍 {insight1}\n🔍 {insight2}\n🔍 {insight3}\n\nThese insights are already shaping our next {project_type} at {company}. The power of data-driven decision making never ceases to amaze me.\n\nWhat's the most surprising data insight you've discovered recently? Let's discuss! 💭\n\n#DataScience #MarketAnalysis #Research #BusinessStrategy #{industry}",
      "Performance metrics from our latest {role} initiative exceeded expectations by {percentage}%, but the real story is in the details. Here's what contributed to this success:\n\n📈 Success Factors:\n• {factor1}\n• {factor2}\n• {factor3}\n\nThis isn't just about hitting targets—it's about understanding the 'why' behind the numbers. Every data point tells a story about {insight}.\n\nHow do you approach performance analysis in your role? I'd love to learn from your methodology. 🎯\n\n#Performance #Results #DataAnalysis #BusinessMetrics #{industry}",
      "Statistical analysis of {industry} trends reveals significant opportunities that many are overlooking. As a {role}, I see these patterns daily, and here's what the data suggests:\n\n📊 Market Insights:\n• {trend1}: {impact1}\n• {trend2}: {impact2}\n• {trend3}: {impact3}\n\nAt {company}, we're positioning ourselves to capitalize on these trends through {strategy}. The numbers don't just inform our decisions—they drive our innovation.\n\nWhat trends are you seeing in {industry}? I'm always interested in different perspectives. 📊\n\n#Statistics #MarketTrends #BusinessStrategy #Innovation #{industry}",
      "The correlation between {metric1} and {metric2} in our {role} projects has been eye-opening. This data-driven insight is reshaping how we approach {challenge} at {company}.\n\nKey Discoveries:\n🔬 {discovery1}\n🔬 {discovery2}\n🔬 {discovery3}\n\nWhen we combine quantitative analysis with qualitative insights, we unlock solutions that weren't visible before. This is the power of {approach}.\n\nWhat analytical approaches have transformed your work? Share your experience! 🧠\n\n#DataAnalysis #BusinessIntelligence #Innovation #Research #{industry}"
    ],
    creative: [
      "Sometimes the most innovative solutions come from the most unexpected places. As a {role} at {company}, I've learned that creativity isn't just about thinking outside the box—it's about redefining what the box looks like.\n\nRecent breakthrough: {breakthrough}\n\nThis creative approach led to {outcome}, proving that when we combine {element1} with {element2}, magic happens.\n\nWhat's the most creative solution you've implemented recently? I'd love to hear about your innovative thinking! ✨\n\n#Innovation #CreativeThinking #ProblemSolving #Innovation #{industry}",
      "The intersection of {interest} and {role} is where the most exciting opportunities emerge. At {company}, we're not just following best practices—we're creating them.\n\nThis week's creative challenge: {challenge}\n\nOur solution: {solution}\n\nWhat made it work: {success_factor}\n\nInnovation isn't about having all the answers; it's about asking the right questions. How do you approach creative problem-solving in your role? 🎨\n\n#CreativeProcess #BusinessInnovation #ProblemSolving #Innovation #{industry}",
      "Redefining what's possible in {industry} requires more than just technical skills—it demands creative vision. As a {role}, I see every project as a canvas for innovation.\n\nRecent project: {project_description}\n\nCreative elements:\n🎨 {creative_element1}\n🎨 {creative_element2}\n🎨 {creative_element3}\n\nResult: {result}\n\nWhen we embrace creativity in {role}, we don't just solve problems—we create opportunities. What's your most creative project this year? 💡\n\n#Innovation #CreativeLeadership #BusinessInnovation #ProblemSolving #{industry}",
      "Art meets business in the most unexpected ways. As a {role}, I've discovered that creative thinking isn't just about aesthetics—it's about finding elegant solutions to complex problems.\n\nThis approach has transformed our {process} at {company}:\n\nBefore: {before_state}\nAfter: {after_state}\n\nKey insight: {insight}\n\nCreativity in business isn't about being different for the sake of it—it's about being better. How do you incorporate creative thinking into your work? 🚀\n\n#CreativeBusiness #Innovation #ProblemSolving #BusinessStrategy #{industry}",
      "The best {role}s don't just execute—they imagine. At {company}, we're building a culture where creative thinking drives every decision, and the results speak for themselves.\n\nRecent creative initiative: {initiative}\n\nImpact: {impact}\n\nWhat made it successful: {success_factors}\n\nWhen we combine {element1} with {element2}, we don't just meet expectations—we exceed them. This is the power of creative {role} work.\n\nWhat's the most imaginative solution you've developed? I'd love to learn from your creative process! 🌟\n\n#CreativeThinking #Innovation #BusinessStrategy #ProblemSolving #{industry}"
    ],
    leadership: [
      "Leading a team of talented {role}s has taught me that great leadership isn't about having all the answers—it's about asking the right questions and empowering others to find solutions.\n\nKey leadership lessons from this week:\n\n🎯 {lesson1}\n🎯 {lesson2}\n🎯 {lesson3}\n\nAt {company}, we believe that the best leaders are those who create more leaders. This philosophy has transformed not just our team dynamics, but our entire approach to {challenge}.\n\nWhat's the most important leadership lesson you've learned recently? I'd love to hear your insights! 💪\n\n#Leadership #TeamBuilding #Management #ProfessionalDevelopment #{industry}",
      "The best leaders in {industry} are those who listen more than they speak, and this week reminded me why. Leading our {role} team through {challenge} taught me that sometimes the most powerful thing you can do is step back and let your team shine.\n\nWhat I learned:\n\n👂 {listening_lesson}\n👂 {listening_lesson2}\n👂 {listening_lesson3}\n\nTrue leadership isn't about being the smartest person in the room—it's about making everyone else feel like they are. This approach has led to {outcome} at {company}.\n\nHow do you practice active listening in your leadership role? Share your strategies! 🤝\n\n#Leadership #ActiveListening #TeamManagement #ProfessionalGrowth #{industry}",
      "Building a culture of {value} starts with leading by example, and this week I was reminded of the ripple effect that authentic leadership can have. At {company}, we don't just talk about {value}—we live it every day.\n\nThis week's leadership moment: {moment}\n\nImpact: {impact}\n\nKey takeaway: {takeaway}\n\nWhen leaders embody the values they preach, it creates a powerful foundation for team success. This has been evident in our {project} results.\n\nWhat values do you lead by? I'd love to learn from your leadership philosophy! 🌟\n\n#Leadership #CompanyCulture #Values #TeamManagement #{industry}",
      "Mentoring the next generation of {role}s is one of my greatest joys, and this week I had the privilege of {mentoring_experience}. Watching someone grow and develop their skills reminds me why I'm passionate about leadership.\n\nMentoring insights:\n\n🌱 {insight1}\n🌱 {insight2}\n🌱 {insight3}\n\nAt {company}, we believe that investing in people is the best investment we can make. This philosophy has created a culture where everyone is both a teacher and a student.\n\nWhat's your approach to mentoring? I'm always looking to improve my mentoring skills! 📚\n\n#Mentorship #Leadership #ProfessionalDevelopment #TeamBuilding #{industry}",
      "Leadership isn't about being in charge—it's about taking care of those in your charge. This principle has guided my approach to leading our {role} team at {company}, and the results speak for themselves.\n\nThis week's leadership challenge: {challenge}\n\nMy approach: {approach}\n\nOutcome: {outcome}\n\nWhen we focus on serving our team rather than managing them, we create an environment where everyone can thrive. This has led to {achievement}.\n\nHow do you balance being a leader with being a servant to your team? I'd love to hear your perspective! 🤲\n\n#Leadership #ServantLeadership #TeamManagement #ProfessionalGrowth #{industry}"
    ]
  },
  tiktok: {
    energetic: [
      "POV: You're a {role} and just discovered the secret to productivity 🚀 #ProductivityHacks #WorkLife",
      "Quick {role} tip that will change your life! 💡 #LifeHacks #CareerTips",
      "Day in the life of a {role} at {company} - it's wild! 😂 #DayInTheLife #WorkVibes",
      "Why being a {role} is actually the coolest job ever 🔥 #CareerGoals #WorkLife",
      "This {role} hack will blow your mind 🤯 #WorkHacks #Productivity"
    ],
    humorous: [
      "When you're a {role} and someone asks 'what do you actually do?' 😅 #WorkHumor #JobLife",
      "POV: You're explaining your {role} job to your parents for the 100th time 😂 #FamilyLife #WorkHumor",
      "The {role} struggle is real but we make it look easy! 💪 #WorkStruggles #Humor",
      "Why {role}s are the unsung heroes of {industry} 🦸‍♀️ #WorkHeroes #Humor",
      "Being a {role} means never having a boring day! 🎭 #WorkLife #Humor"
    ],
    motivational: [
      "If you're a {role}, remember: you're making a difference! 🌟 #Motivation #CareerGoals",
      "Every {role} has the power to change the world, one {action} at a time! 💪 #Motivation #Impact",
      "Don't let imposter syndrome stop you from being an amazing {role}! ✨ #Motivation #SelfBelief",
      "The best {role}s are those who never stop learning! 📚 #Growth #Motivation",
      "Your {role} journey is unique - embrace it! 🌈 #Motivation #CareerJourney"
    ],
    trendy: [
      "This {trend} is changing everything for {role}s! 🔥 #Trending #Innovation",
      "POV: You're a {role} and this new trend just dropped 📱 #Trending #WorkLife",
      "Why every {role} needs to know about {trend} right now! ⚡ #Trending #CareerTips",
      "The {trend} that's revolutionizing {industry} for {role}s! 🚀 #Trending #Innovation",
      "This is how {trend} is transforming the {role} world! 💫 #Trending #FutureOfWork"
    ]
  },
  instagram: {
    lifestyle: [
      "Behind the scenes of a {role} life at {company} ✨ #BehindTheScenes #WorkLife",
      "Work hard, play hard - the {role} way! 💼 #WorkLifeBalance #Lifestyle",
      "Coffee, meetings, and making magic happen as a {role} ☕ #WorkLife #CoffeeLife",
      "The {role} lifestyle: where every day is a new adventure! 🌟 #Lifestyle #CareerLife",
      "Living my best {role} life! What's your work vibe? 💫 #WorkVibes #Lifestyle"
    ],
    inspirational: [
      "Every {role} has a story worth telling 📖 #Inspiration #CareerStory",
      "The journey of a {role} is filled with growth and discovery 🌱 #PersonalGrowth #CareerJourney",
      "Believe in your {role} dreams - they're closer than you think! ✨ #Dreams #Motivation",
      "The best {role}s are those who inspire others to be their best selves 🌟 #Inspiration #Leadership",
      "Your {role} journey is a masterpiece in progress 🎨 #PersonalGrowth #CareerArt"
    ],
    professional: [
      "Professional {role} moment: when everything just clicks! 💼 #ProfessionalLife #CareerSuccess",
      "The {role} grind never stops, but neither do the rewards! 🏆 #ProfessionalGrowth #Success",
      "Building something amazing as a {role} at {company} 🏗️ #ProfessionalLife #CompanyPride",
      "The {role} profession: where passion meets purpose! 🎯 #ProfessionalLife #CareerPurpose",
      "Every {role} project is a step toward something greater! 📈 #ProfessionalGrowth #CareerGoals"
    ],
    community: [
      "The {role} community is incredible - so much support and inspiration! 🤝 #Community #ProfessionalNetwork",
      "Shoutout to all the amazing {role}s out there! You're doing great! 👏 #Community #Support",
      "Building connections in the {role} world - it's all about community! 🌐 #Networking #Community",
      "The {role} tribe is strong and supportive! 💪 #Community #ProfessionalSupport",
      "Grateful for the {role} community that lifts each other up! 🙏 #Community #Gratitude"
    ]
  }
}

/**
 * Hashtag pools organized by platform and category
 */
const HASHTAG_POOLS = {
  linkedin: {
    professional: ['#ProfessionalGrowth', '#CareerDevelopment', '#BusinessStrategy', '#Leadership', '#IndustryInsights', '#Networking', '#CareerGoals', '#BusinessInnovation'],
    industry: ['#Technology', '#Finance', '#Healthcare', '#Education', '#Marketing', '#Sales', '#Operations', '#Strategy', '#Consulting', '#Startups'],
    general: ['#WorkLife', '#TeamWork', '#Innovation', '#Success', '#Motivation', '#Learning', '#Growth', '#Excellence']
  },
  tiktok: {
    trending: ['#FYP', '#Viral', '#Trending', '#POV', '#LifeHacks', '#WorkHacks', '#CareerTips', '#ProductivityHacks', '#WorkLife', '#DayInTheLife'],
    fun: ['#Funny', '#Humor', '#Relatable', '#WorkStruggles', '#WorkVibes', '#BehindTheScenes', '#WorkHumor', '#JobLife'],
    motivational: ['#Motivation', '#Inspiration', '#Success', '#Goals', '#Dreams', '#Growth', '#SelfImprovement', '#Mindset']
  },
  instagram: {
    lifestyle: ['#WorkLife', '#Lifestyle', '#BehindTheScenes', '#WorkVibes', '#CareerLife', '#ProfessionalLife', '#WorkLifeBalance', '#CoffeeLife'],
    aesthetic: ['#Aesthetic', '#Vibes', '#Mood', '#Inspiration', '#Motivation', '#Growth', '#Success', '#Dreams'],
    community: ['#Community', '#Support', '#Networking', '#ProfessionalNetwork', '#TeamWork', '#Collaboration', '#Together']
  }
}

/**
 * Industry mapping for different roles
 */
const INDUSTRY_MAPPING: { [key: string]: string } = {
  'Software Engineer': 'technology',
  'Product Manager': 'technology',
  'Data Scientist': 'technology',
  'Marketing Manager': 'marketing',
  'Sales Director': 'sales',
  'HR Manager': 'human resources',
  'Financial Analyst': 'finance',
  'Operations Manager': 'operations',
  'Business Analyst': 'consulting',
  'Designer': 'creative',
  'Consultant': 'consulting',
  'CEO': 'leadership',
  'CTO': 'technology',
  'CFO': 'finance'
}

/**
 * Social Media Post Generator
 * Creates personalized social media posts using OpenAI or fallback templates
 */
export class SocialMediaPostGenerator {
  private static openAIService = new OpenAIService()

  /**
   * Generate a social media post for a citizen
   * @param citizen The citizen to generate a post for
   * @returns Generated social media post
   */
  public static async generatePost(citizen: Citizen): Promise<GeneratedSocialPost> {
    const platform = this.selectPlatform(citizen)
    
    try {
      // Try OpenAI generation first if available
      if (this.openAIService.isAvailable()) {
        const aiResult = await this.openAIService.generateSocialMediaPost(citizen, platform)
        
        // Ensure content is a string and not JSON
        const content = typeof aiResult.content === 'string' ? aiResult.content : JSON.stringify(aiResult.content)
        
        console.log('🤖 AI Generated content type:', typeof aiResult.content)
        console.log('📝 AI Generated content preview:', content.substring(0, 100) + '...')
        
        return {
          platform,
          content: content,
          hashtags: aiResult.hashtags,
          citizen: {
            id: citizen.id,
            name: citizen.name,
            role: citizen.role,
            company: citizen.company
          },
          timestamp: new Date()
        }
      }
    } catch (error) {
      console.warn('⚠️ OpenAI generation failed, falling back to templates:', error)
    }

    // Fallback to template-based generation
    return this.generateTemplatePost(citizen, platform)
  }

  /**
   * Generate a post using the original template system
   * @param citizen The citizen to generate a post for
   * @param platform The platform to generate for
   * @returns Generated social media post
   */
  private static generateTemplatePost(citizen: Citizen, platform: 'linkedin' | 'tiktok' | 'instagram'): GeneratedSocialPost {
    const personalityType = this.determinePersonalityType(citizen)
    const template = this.selectTemplate(platform, personalityType)
    const content = this.personalizeContent(template, citizen, platform)
    const hashtags = this.generateHashtags(platform, personalityType, citizen)
    
    return {
      platform,
      content,
      hashtags,
      citizen: {
        id: citizen.id,
        name: citizen.name,
        role: citizen.role,
        company: citizen.company
      },
      timestamp: new Date()
    }
  }

  /**
   * Select a random platform for social media posts
   */
  private static selectPlatform(citizen: Citizen): 'linkedin' | 'tiktok' | 'instagram' {
    const platforms = ['linkedin', 'tiktok', 'instagram'] as const
    const selectedPlatform = platforms[Math.floor(Math.random() * platforms.length)]
    
    // Log platform selection for debugging
    console.log(`🎯 Random platform selection for ${citizen.name} (${citizen.role}):`)
    console.log(`   Selected: ${selectedPlatform.toUpperCase()}`)
    
    return selectedPlatform
  }



  /**
   * Determine the primary personality type for content generation
   */
  private static determinePersonalityType(citizen: Citizen): string {
    const { personality } = citizen
    const traits = personality.traits || []
    const workStyle = personality.workStyle || ''
    const socialStyle = personality.socialStyle || ''
    
    // Map personality traits to content types
    if (traits.some(trait => ['analytical', 'data-driven'].includes(trait)) || workStyle.includes('analytical')) {
      return 'analytical'
    }
    if (traits.some(trait => ['creative', 'innovative'].includes(trait)) || workStyle.includes('creative')) {
      return 'creative'
    }
    if (traits.some(trait => ['leadership', 'managerial'].includes(trait)) || citizen.role.toLowerCase().includes('manager') || citizen.role.toLowerCase().includes('director') || citizen.role.toLowerCase().includes('ceo')) {
      return 'leadership'
    }
    if (traits.some(trait => ['energetic', 'enthusiastic'].includes(trait)) || socialStyle.includes('outgoing')) {
      return 'energetic'
    }
    if (traits.some(trait => ['humorous', 'funny'].includes(trait)) || socialStyle.includes('humorous')) {
      return 'humorous'
    }
    if (traits.some(trait => ['motivational', 'inspirational'].includes(trait)) || personality.motivation?.includes('helping')) {
      return 'motivational'
    }
    if (traits.some(trait => ['trendy', 'modern'].includes(trait)) || socialStyle.includes('trendy')) {
      return 'trendy'
    }
    if (traits.some(trait => ['lifestyle', 'balanced'].includes(trait)) || socialStyle.includes('lifestyle')) {
      return 'lifestyle'
    }
    if (traits.some(trait => ['inspirational', 'motivational'].includes(trait)) || personality.motivation?.includes('inspiring')) {
      return 'inspirational'
    }
    if (traits.some(trait => ['community', 'collaborative'].includes(trait)) || socialStyle.includes('community')) {
      return 'community'
    }
    
    // Default to professional for LinkedIn, energetic for TikTok, lifestyle for Instagram
    return 'professional'
  }

  /**
   * Select an appropriate template based on platform and personality type
   */
  private static selectTemplate(platform: 'linkedin' | 'tiktok' | 'instagram', personalityType: string): string {
    const platformTemplates = POST_TEMPLATES[platform]
    const templates = platformTemplates[personalityType as keyof typeof platformTemplates] as string[] | undefined
    
    if (!templates || templates.length === 0) {
      // Fallback to default templates
      const defaultTemplates = platformTemplates['professional' as keyof typeof platformTemplates] as string[] || 
                              platformTemplates[Object.keys(platformTemplates)[0] as keyof typeof platformTemplates] as string[]
      return defaultTemplates[Math.floor(Math.random() * defaultTemplates.length)]
    }
    
    return templates[Math.floor(Math.random() * templates.length)]
  }

  /**
   * Personalize the template content with citizen-specific information
   */
  private static personalizeContent(template: string, citizen: Citizen, platform: string): string {
    const { personality } = citizen
    const industry = INDUSTRY_MAPPING[citizen.role] || 'business'
    
    // Replace placeholders with actual values
    let content = template
      .replace(/{role}/g, citizen.role)
      .replace(/{company}/g, citizen.company)
      .replace(/{industry}/g, industry)
      .replace(/{name}/g, citizen.name)
      .replace(/{value}/g, personality.values?.[Math.floor(Math.random() * (personality.values?.length || 1))] || 'excellence')
      .replace(/{interest}/g, personality.interests?.[Math.floor(Math.random() * (personality.interests?.length || 1))] || 'innovation')
      .replace(/{insight}/g, this.generateInsight(citizen))
      .replace(/{topic}/g, this.generateTopic(citizen))
      .replace(/{percentage}/g, (Math.floor(Math.random() * 50) + 10).toString())
      .replace(/{action}/g, this.generateAction(citizen))
      .replace(/{trend}/g, this.generateTrend(platform))
      // LinkedIn-specific placeholders
      .replace(/{achievement}/g, this.generateAchievement(citizen))
      .replace(/{insight1}/g, this.generateInsight(citizen))
      .replace(/{insight2}/g, this.generateInsight(citizen))
      .replace(/{insight3}/g, this.generateInsight(citizen))
      .replace(/{lesson1}/g, this.generateLesson(citizen))
      .replace(/{lesson2}/g, this.generateLesson(citizen))
      .replace(/{lesson3}/g, this.generateLesson(citizen))
      .replace(/{excitement1}/g, this.generateExcitement(citizen))
      .replace(/{excitement2}/g, this.generateExcitement(citizen))
      .replace(/{excitement3}/g, this.generateExcitement(citizen))
      .replace(/{timeframe}/g, this.generateTimeframe(citizen))
      .replace(/{mentoring_experience}/g, this.generateMentoringExperience(citizen))
      .replace(/{principle1}/g, this.generatePrinciple(citizen))
      .replace(/{principle2}/g, this.generatePrinciple(citizen))
      .replace(/{principle3}/g, this.generatePrinciple(citizen))
      .replace(/{metric1}/g, this.generateMetric(citizen))
      .replace(/{metric2}/g, this.generateMetric(citizen))
      .replace(/{metric3}/g, this.generateMetric(citizen))
      .replace(/{value1}/g, this.generateMetricValue())
      .replace(/{value2}/g, this.generateMetricValue())
      .replace(/{value3}/g, this.generateMetricValue())
      .replace(/{outcome}/g, this.generateOutcome(citizen))
      .replace(/{project_type}/g, this.generateProjectType(citizen))
      .replace(/{factor1}/g, this.generateSuccessFactor(citizen))
      .replace(/{factor2}/g, this.generateSuccessFactor(citizen))
      .replace(/{factor3}/g, this.generateSuccessFactor(citizen))
      .replace(/{trend1}/g, this.generateTrend(platform))
      .replace(/{trend2}/g, this.generateTrend(platform))
      .replace(/{trend3}/g, this.generateTrend(platform))
      .replace(/{impact1}/g, this.generateImpact())
      .replace(/{impact2}/g, this.generateImpact())
      .replace(/{impact3}/g, this.generateImpact())
      .replace(/{strategy}/g, this.generateStrategy(citizen))
      .replace(/{challenge}/g, this.generateChallenge(citizen))
      .replace(/{approach}/g, this.generateApproach(citizen))
      .replace(/{breakthrough}/g, this.generateBreakthrough(citizen))
      .replace(/{element1}/g, this.generateElement(citizen))
      .replace(/{element2}/g, this.generateElement(citizen))
      .replace(/{solution}/g, this.generateSolution(citizen))
      .replace(/{success_factor}/g, this.generateSuccessFactor(citizen))
      .replace(/{project_description}/g, this.generateProjectDescription(citizen))
      .replace(/{creative_element1}/g, this.generateCreativeElement(citizen))
      .replace(/{creative_element2}/g, this.generateCreativeElement(citizen))
      .replace(/{creative_element3}/g, this.generateCreativeElement(citizen))
      .replace(/{result}/g, this.generateResult(citizen))
      .replace(/{process}/g, this.generateProcess(citizen))
      .replace(/{before_state}/g, this.generateBeforeState(citizen))
      .replace(/{after_state}/g, this.generateAfterState(citizen))
      .replace(/{initiative}/g, this.generateInitiative(citizen))
      .replace(/{impact}/g, this.generateImpact())
      .replace(/{success_factors}/g, this.generateSuccessFactor(citizen))
      .replace(/{lesson1}/g, this.generateLesson(citizen))
      .replace(/{lesson2}/g, this.generateLesson(citizen))
      .replace(/{lesson3}/g, this.generateLesson(citizen))
      .replace(/{listening_lesson}/g, this.generateListeningLesson(citizen))
      .replace(/{listening_lesson2}/g, this.generateListeningLesson(citizen))
      .replace(/{listening_lesson3}/g, this.generateListeningLesson(citizen))
      .replace(/{moment}/g, this.generateLeadershipMoment(citizen))
      .replace(/{takeaway}/g, this.generateTakeaway(citizen))
      .replace(/{project}/g, this.generateProject(citizen))
      .replace(/{insight1}/g, this.generateInsight(citizen))
      .replace(/{insight2}/g, this.generateInsight(citizen))
      .replace(/{insight3}/g, this.generateInsight(citizen))
      .replace(/{approach}/g, this.generateApproach(citizen))
    
    return content
  }

  /**
   * Generate relevant hashtags for the post
   */
  private static generateHashtags(platform: 'linkedin' | 'tiktok' | 'instagram', personalityType: string, citizen: Citizen): string[] {
    const hashtagPools = HASHTAG_POOLS[platform]
    const industry = INDUSTRY_MAPPING[citizen.role] || 'business'
    
    let hashtags: string[] = []
    
    // Add personality-based hashtags
    if (hashtagPools[personalityType as keyof typeof hashtagPools]) {
      const personalityHashtags = hashtagPools[personalityType as keyof typeof hashtagPools]
      hashtags.push(...this.selectRandomHashtags(personalityHashtags, 2))
    }
    
    // Add industry hashtags (only for LinkedIn)
    if (platform === 'linkedin' && 'industry' in hashtagPools) {
      hashtags.push(...this.selectRandomHashtags(hashtagPools.industry, 1))
    }
    
    // Add general hashtags (only for LinkedIn)
    if (platform === 'linkedin' && 'general' in hashtagPools) {
      hashtags.push(...this.selectRandomHashtags(hashtagPools.general, 2))
    }
    
    // Add role-specific hashtag
    hashtags.push(`#${citizen.role.replace(/\s+/g, '')}`)
    
    // Remove duplicates and limit to 5 hashtags
    const uniqueHashtags = Array.from(new Set(hashtags))
    return uniqueHashtags.slice(0, 5)
  }

  /**
   * Select random hashtags from a pool
   */
  private static selectRandomHashtags(hashtagPool: string[], count: number): string[] {
    const shuffled = [...hashtagPool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Generate a relevant insight based on citizen's role and personality
   */
  private static generateInsight(citizen: Citizen): string {
    const insights = [
      'customer satisfaction increased by 25%',
      'team productivity improved significantly',
      'process efficiency gained 30%',
      'user engagement doubled',
      'cost reduction achieved 20% savings',
      'innovation metrics exceeded expectations',
      'collaboration across departments improved',
      'data quality enhanced substantially'
    ]
    return insights[Math.floor(Math.random() * insights.length)]
  }

  /**
   * Generate a relevant topic based on citizen's interests and role
   */
  private static generateTopic(citizen: Citizen): string {
    const topics = [
      'customer experience optimization',
      'team collaboration strategies',
      'digital transformation initiatives',
      'data-driven decision making',
      'process automation',
      'user engagement metrics',
      'cross-functional communication',
      'innovation management'
    ]
    return topics[Math.floor(Math.random() * topics.length)]
  }

  /**
   * Generate a relevant action based on citizen's role
   */
  private static generateAction(citizen: Citizen): string {
    const actions = [
      'decision',
      'strategy',
      'innovation',
      'collaboration',
      'solution',
      'improvement',
      'transformation',
      'optimization'
    ]
    return actions[Math.floor(Math.random() * actions.length)]
  }

  /**
   * Generate a relevant trend based on platform
   */
  private static generateTrend(platform: string): string {
    const trends = {
      linkedin: ['AI integration', 'remote work evolution', 'sustainable business practices', 'data analytics', 'leadership development'],
      tiktok: ['productivity hacks', 'work-life balance', 'career growth', 'team building', 'innovation'],
      instagram: ['workplace wellness', 'professional development', 'creative collaboration', 'sustainable work', 'digital transformation']
    }
    
    const platformTrends = trends[platform as keyof typeof trends] || trends.linkedin
    return platformTrends[Math.floor(Math.random() * platformTrends.length)]
  }

  /**
   * Generate a professional achievement
   */
  private static generateAchievement(citizen: Citizen): string {
    const achievements = [
      'a major project milestone',
      'a successful team initiative',
      'a significant process improvement',
      'a breakthrough in our approach',
      'an innovative solution to a complex problem',
      'a record-breaking performance',
      'a successful client implementation',
      'a major system upgrade',
      'a successful product launch',
      'a breakthrough in efficiency'
    ]
    return achievements[Math.floor(Math.random() * achievements.length)]
  }

  /**
   * Generate a professional lesson
   */
  private static generateLesson(citizen: Citizen): string {
    const lessons = [
      'collaboration is key to success',
      'data-driven decisions lead to better outcomes',
      'listening is more important than speaking',
      'continuous learning is essential for growth',
      'empathy drives better results',
      'innovation requires taking calculated risks',
      'team diversity strengthens solutions',
      'communication clarity prevents misunderstandings',
      'adaptability is crucial in changing markets',
      'mentorship benefits both parties'
    ]
    return lessons[Math.floor(Math.random() * lessons.length)]
  }

  /**
   * Generate excitement about industry trends
   */
  private static generateExcitement(citizen: Citizen): string {
    const excitements = [
      'the potential for AI to transform our industry',
      'the growing emphasis on sustainability',
      'the shift toward remote collaboration tools',
      'the democratization of data analytics',
      'the focus on employee well-being',
      'the integration of automation in workflows',
      'the rise of personalized customer experiences',
      'the evolution of leadership practices',
      'the emphasis on continuous learning',
      'the potential for cross-functional collaboration'
    ]
    return excitements[Math.floor(Math.random() * excitements.length)]
  }

  /**
   * Generate a timeframe
   */
  private static generateTimeframe(citizen: Citizen): string {
    const timeframes = [
      '2 years',
      '3 years',
      '5 years',
      '6 months',
      '18 months',
      '4 years',
      '1 year',
      '2.5 years'
    ]
    return timeframes[Math.floor(Math.random() * timeframes.length)]
  }

  /**
   * Generate a mentoring experience
   */
  private static generateMentoringExperience(citizen: Citizen): string {
    const experiences = [
      'mentoring a junior team member',
      'guiding a colleague through a challenging project',
      'sharing knowledge with a new hire',
      'coaching someone through a career transition',
      'helping a team member develop new skills',
      'providing guidance on a complex problem',
      'supporting someone through a difficult decision',
      'sharing industry insights with a peer'
    ]
    return experiences[Math.floor(Math.random() * experiences.length)]
  }

  /**
   * Generate a professional principle
   */
  private static generatePrinciple(citizen: Citizen): string {
    const principles = [
      'always put the team first',
      'data should drive every decision',
      'continuous improvement is non-negotiable',
      'transparency builds trust',
      'empathy leads to better solutions',
      'innovation requires calculated risk-taking',
      'collaboration multiplies individual efforts',
      'learning never stops',
      'integrity is the foundation of success',
      'adaptability is key to survival'
    ]
    return principles[Math.floor(Math.random() * principles.length)]
  }

  /**
   * Generate a business metric
   */
  private static generateMetric(citizen: Citizen): string {
    const metrics = [
      'customer satisfaction score',
      'team productivity index',
      'project completion rate',
      'client retention rate',
      'process efficiency ratio',
      'innovation adoption rate',
      'employee engagement score',
      'quality improvement percentage',
      'cost reduction metric',
      'time-to-market speed'
    ]
    return metrics[Math.floor(Math.random() * metrics.length)]
  }

  /**
   * Generate a metric value
   */
  private static generateMetricValue(): string {
    const values = [
      '15% increase',
      '25% improvement',
      '40% reduction',
      '85% satisfaction',
      '3x faster',
      '50% more efficient',
      '90% accuracy',
      '2x growth',
      '30% cost savings',
      '95% success rate'
    ]
    return values[Math.floor(Math.random() * values.length)]
  }

  /**
   * Generate a business outcome
   */
  private static generateOutcome(citizen: Citizen): string {
    const outcomes = [
      'improved team collaboration',
      'enhanced customer satisfaction',
      'increased operational efficiency',
      'better decision-making processes',
      'stronger team performance',
      'reduced project timelines',
      'higher quality deliverables',
      'improved stakeholder relationships',
      'greater innovation adoption',
      'enhanced competitive advantage'
    ]
    return outcomes[Math.floor(Math.random() * outcomes.length)]
  }

  /**
   * Generate a project type
   */
  private static generateProjectType(citizen: Citizen): string {
    const types = [
      'digital transformation initiative',
      'process optimization project',
      'customer experience enhancement',
      'team development program',
      'innovation pilot',
      'efficiency improvement initiative',
      'quality enhancement project',
      'strategic planning initiative',
      'technology integration project',
      'performance improvement program'
    ]
    return types[Math.floor(Math.random() * types.length)]
  }

  /**
   * Generate a success factor
   */
  private static generateSuccessFactor(citizen: Citizen): string {
    const factors = [
      'clear communication',
      'strong team collaboration',
      'data-driven approach',
      'agile methodology',
      'stakeholder alignment',
      'continuous feedback',
      'risk management',
      'resource optimization',
      'change management',
      'quality focus'
    ]
    return factors[Math.floor(Math.random() * factors.length)]
  }

  /**
   * Generate an impact description
   */
  private static generateImpact(): string {
    const impacts = [
      'significant cost savings',
      'improved team morale',
      'enhanced customer experience',
      'increased operational efficiency',
      'better decision-making',
      'stronger competitive position',
      'reduced time-to-market',
      'higher quality outcomes',
      'improved stakeholder satisfaction',
      'greater innovation adoption'
    ]
    return impacts[Math.floor(Math.random() * impacts.length)]
  }

  /**
   * Generate a business strategy
   */
  private static generateStrategy(citizen: Citizen): string {
    const strategies = [
      'agile transformation',
      'digital-first approach',
      'customer-centric methodology',
      'data-driven decision making',
      'collaborative innovation',
      'continuous improvement process',
      'talent development program',
      'technology integration strategy',
      'performance optimization framework',
      'stakeholder engagement model'
    ]
    return strategies[Math.floor(Math.random() * strategies.length)]
  }

  /**
   * Generate a professional challenge
   */
  private static generateChallenge(citizen: Citizen): string {
    const challenges = [
      'a complex technical problem',
      'a tight deadline',
      'a resource constraint',
      'a stakeholder disagreement',
      'a process inefficiency',
      'a team communication issue',
      'a market disruption',
      'a technology limitation',
      'a quality concern',
      'a change management situation'
    ]
    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  /**
   * Generate a professional approach
   */
  private static generateApproach(citizen: Citizen): string {
    const approaches = [
      'collaborative problem-solving',
      'data-driven analysis',
      'agile methodology',
      'design thinking process',
      'lean management principles',
      'systems thinking approach',
      'human-centered design',
      'iterative improvement',
      'cross-functional collaboration',
      'evidence-based decision making'
    ]
    return approaches[Math.floor(Math.random() * approaches.length)]
  }

  /**
   * Generate a breakthrough moment
   */
  private static generateBreakthrough(citizen: Citizen): string {
    const breakthroughs = [
      'discovered a new way to optimize our workflow',
      'found an innovative solution to a persistent problem',
      'identified a key insight that changed our approach',
      'developed a creative workaround for a technical limitation',
      'uncovered a pattern that improved our efficiency',
      'created a new methodology that enhanced our results',
      'realized a connection that simplified our process',
      'invented a solution that exceeded expectations',
      'pioneered an approach that others are now adopting',
      'breakthrough that transformed our team dynamics'
    ]
    return breakthroughs[Math.floor(Math.random() * breakthroughs.length)]
  }

  /**
   * Generate a creative element
   */
  private static generateElement(citizen: Citizen): string {
    const elements = [
      'user experience design',
      'data visualization',
      'process automation',
      'collaborative tools',
      'creative problem-solving',
      'visual storytelling',
      'interactive interfaces',
      'innovative workflows',
      'engaging presentations',
      'intuitive systems'
    ]
    return elements[Math.floor(Math.random() * elements.length)]
  }

  /**
   * Generate a solution description
   */
  private static generateSolution(citizen: Citizen): string {
    const solutions = [
      'implemented a streamlined process',
      'developed an automated workflow',
      'created a collaborative platform',
      'designed an intuitive interface',
      'built a data-driven dashboard',
      'established a feedback loop',
      'introduced a quality control system',
      'launched a training program',
      'deployed a monitoring tool',
      'initiated a continuous improvement cycle'
    ]
    return solutions[Math.floor(Math.random() * solutions.length)]
  }

  /**
   * Generate a project description
   */
  private static generateProjectDescription(citizen: Citizen): string {
    const descriptions = [
      'a customer experience redesign',
      'a process automation initiative',
      'a team collaboration platform',
      'a data analytics dashboard',
      'a quality improvement program',
      'a digital transformation project',
      'an innovation pilot program',
      'a performance optimization initiative',
      'a stakeholder engagement strategy',
      'a technology integration project'
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  /**
   * Generate a creative element
   */
  private static generateCreativeElement(citizen: Citizen): string {
    const elements = [
      'visual storytelling approach',
      'interactive user interface',
      'gamification elements',
      'collaborative workspace design',
      'data visualization techniques',
      'creative problem-solving methods',
      'engaging presentation style',
      'innovative workflow design',
      'intuitive navigation system',
      'inspiring visual design'
    ]
    return elements[Math.floor(Math.random() * elements.length)]
  }

  /**
   * Generate a result description
   */
  private static generateResult(citizen: Citizen): string {
    const results = [
      'exceeded all expectations',
      'delivered ahead of schedule',
      'achieved 100% user adoption',
      'reduced costs by 30%',
      'improved efficiency by 50%',
      'increased satisfaction scores',
      'streamlined the entire process',
      'enhanced team collaboration',
      'accelerated project delivery',
      'transformed our approach'
    ]
    return results[Math.floor(Math.random() * results.length)]
  }

  /**
   * Generate a process description
   */
  private static generateProcess(citizen: Citizen): string {
    const processes = [
      'project management workflow',
      'customer onboarding process',
      'quality assurance procedure',
      'team collaboration method',
      'decision-making framework',
      'performance evaluation system',
      'innovation development cycle',
      'stakeholder communication protocol',
      'risk management approach',
      'continuous improvement process'
    ]
    return processes[Math.floor(Math.random() * processes.length)]
  }

  /**
   * Generate a before state
   */
  private static generateBeforeState(citizen: Citizen): string {
    const states = [
      'manual, time-consuming process',
      'fragmented communication system',
      'reactive problem-solving approach',
      'siloed team structure',
      'inconsistent quality standards',
      'limited visibility into performance',
      'ad-hoc decision making',
      'disconnected workflows',
      'outdated technology stack',
      'rigid, inflexible procedures'
    ]
    return states[Math.floor(Math.random() * states.length)]
  }

  /**
   * Generate an after state
   */
  private static generateAfterState(citizen: Citizen): string {
    const states = [
      'automated, efficient workflow',
      'integrated communication platform',
      'proactive problem prevention',
      'collaborative team environment',
      'standardized quality processes',
      'real-time performance monitoring',
      'data-driven decision making',
      'seamless, connected systems',
      'modern, scalable technology',
      'flexible, adaptive processes'
    ]
    return states[Math.floor(Math.random() * states.length)]
  }

  /**
   * Generate an initiative description
   */
  private static generateInitiative(citizen: Citizen): string {
    const initiatives = [
      'a team innovation challenge',
      'a cross-functional collaboration program',
      'a continuous learning initiative',
      'a process improvement project',
      'a customer experience enhancement',
      'a technology adoption program',
      'a quality excellence campaign',
      'a performance optimization effort',
      'a stakeholder engagement strategy',
      'a digital transformation initiative'
    ]
    return initiatives[Math.floor(Math.random() * initiatives.length)]
  }

  /**
   * Generate a listening lesson
   */
  private static generateListeningLesson(citizen: Citizen): string {
    const lessons = [
      'sometimes the best solution comes from the quietest voice',
      'understanding the problem is more important than having the answer',
      'every team member has valuable insights to share',
      'active listening reveals opportunities we might otherwise miss',
      'empathy starts with truly hearing what others are saying',
      'the best leaders ask questions and listen to the answers',
      'silence can be more powerful than words',
      'understanding different perspectives enriches our solutions',
      'listening builds trust and strengthens relationships',
      'the most innovative ideas often come from unexpected sources'
    ]
    return lessons[Math.floor(Math.random() * lessons.length)]
  }

  /**
   * Generate a leadership moment
   */
  private static generateLeadershipMoment(citizen: Citizen): string {
    const moments = [
      'watching my team solve a complex problem together',
      'seeing a team member grow and take on new challenges',
      'facilitating a difficult conversation that led to breakthrough',
      'supporting someone through a professional setback',
      'celebrating a team achievement that exceeded expectations',
      'guiding a colleague through a career transition',
      'mediating a conflict that strengthened team bonds',
      'inspiring others to think differently about a challenge',
      'creating an environment where everyone felt heard',
      'leading by example during a particularly challenging time'
    ]
    return moments[Math.floor(Math.random() * moments.length)]
  }

  /**
   * Generate a takeaway
   */
  private static generateTakeaway(citizen: Citizen): string {
    const takeaways = [
      'authentic leadership creates lasting impact',
      'trust is the foundation of effective teams',
      'vulnerability in leadership builds stronger connections',
      'empowering others multiplies your influence',
      'listening is the most underrated leadership skill',
      'consistency in values builds credibility',
      'celebrating small wins creates momentum',
      'transparency in communication prevents misunderstandings',
      'adaptability is crucial in uncertain times',
      'investing in people always pays dividends'
    ]
    return takeaways[Math.floor(Math.random() * takeaways.length)]
  }

  /**
   * Generate a project description
   */
  private static generateProject(citizen: Citizen): string {
    const projects = [
      'our latest client engagement',
      'the team restructuring initiative',
      'our digital transformation project',
      'the customer experience redesign',
      'our process optimization effort',
      'the innovation pilot program',
      'our quality improvement initiative',
      'the stakeholder engagement strategy',
      'our performance enhancement project',
      'the technology integration effort'
    ]
    return projects[Math.floor(Math.random() * projects.length)]
  }
}

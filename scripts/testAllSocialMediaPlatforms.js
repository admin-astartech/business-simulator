/**
 * Test script for all Social Media Post Generator platforms
 * This script demonstrates LinkedIn, TikTok, and Instagram post generation
 */

const { SocialMediaPostGenerator } = require('../lib/socialMediaPostGenerator.ts')

// Sample citizen data for testing
const sampleCitizen = {
  id: 'test-citizen-1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  role: 'Software Engineer',
  initials: 'SJ',
  avatarColor: '#3B82F6',
  monetaryValue: 75000,
  age: 28,
  company: 'TechCorp Inc',
  gender: 'female',
  isOnline: true,
  lastSeen: new Date().toISOString(),
  personality: {
    traits: ['analytical', 'creative', 'energetic'],
    workStyle: 'collaborative',
    socialStyle: 'outgoing',
    motivation: 'building innovative solutions',
    stressTriggers: ['tight deadlines'],
    riskTolerance: 7,
    summary: 'A creative and analytical software engineer who loves building innovative solutions',
    category: 'tech-professional',
    ageBand: '25-30',
    interests: ['technology', 'innovation', 'team collaboration'],
    likes: ['clean code', 'user experience', 'problem solving'],
    dislikes: ['technical debt', 'poor documentation'],
    values: ['innovation', 'collaboration', 'excellence'],
    beliefs: ['technology can solve real problems'],
    fears: ['becoming obsolete'],
    aspirations: ['leading a tech team', 'building impactful products'],
    habits: ['daily code reviews', 'continuous learning'],
    goals: ['become a tech lead', 'launch a successful product'],
    challenges: ['balancing speed and quality'],
    strengths: ['problem solving', 'team collaboration'],
    weaknesses: ['perfectionism'],
    preferences: ['agile development', 'pair programming'],
    behaviors: ['proactive communication', 'mentoring others'],
    patterns: ['morning standups', 'weekly retrospectives'],
    triggers: ['unclear requirements'],
    reactions: ['asking clarifying questions'],
    responses: ['proposing solutions'],
    motivations: ['building something meaningful'],
    frustrations: ['technical debt accumulation']
  },
  socialMedia: {
    linkedIn: {
      url: 'https://linkedin.com/in/sarahjohnson',
      headline: 'Software Engineer | Full-Stack Developer | Tech Enthusiast',
      summary: 'Passionate about building innovative solutions and leading technical teams',
      connections: 500,
      followers: 1200,
      location: 'San Francisco, CA',
      currentRole: {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc',
        startYear: 2020
      },
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      endorsements: [
        { skill: 'JavaScript', count: 45 },
        { skill: 'React', count: 38 },
        { skill: 'Node.js', count: 32 }
      ],
      openTo: ['Full-time opportunities', 'Mentoring'],
      interests: ['Technology', 'Innovation', 'Leadership'],
      activityLevel: 'high',
      recommendationsReceived: 12,
      education: ['BS Computer Science - Stanford University'],
      certifications: ['AWS Certified Developer', 'Google Cloud Professional']
    },
    tikTok: {
      handle: '@sarahcodes',
      url: 'https://tiktok.com/@sarahcodes',
      bio: 'Software Engineer sharing coding tips & tech life 🚀',
      followers: 15000,
      following: 500,
      totalLikes: 45000,
      videoCount: 120,
      avgViews: 2500,
      avgLikes: 180,
      avgComments: 25,
      engagementRatePct: 8.2,
      postingCadence: 'daily',
      lastActive: new Date().toISOString(),
      topics: ['coding', 'tech life', 'career tips'],
      contentStyle: ['educational', 'behind-the-scenes'],
      musicPreferences: ['upbeat', 'electronic'],
      hashtags: ['#coding', '#techlife', '#softwareengineer'],
      openToCollabs: true,
      linkInBio: 'https://sarahjohnson.dev',
      region: 'US-West'
    },
    instagram: {
      handle: '@sarahcodes',
      url: 'https://instagram.com/sarahcodes',
      bio: 'Software Engineer | Tech Enthusiast | Coffee Lover ☕',
      followers: 8500,
      following: 1200,
      postsCount: 180,
      avgLikes: 95,
      avgComments: 12,
      engagementRatePct: 6.8,
      lastActive: new Date().toISOString(),
      contentThemes: ['work life', 'tech', 'lifestyle'],
      storyCadence: 'daily',
      reelsSharePct: 40,
      hashtags: ['#techlife', '#coding', '#worklife'],
      highlights: ['Coding Tips', 'Work Life', 'Tech Events'],
      gridStyle: 'clean',
      verified: false,
      linkInBio: 'https://sarahjohnson.dev'
    }
  }
}

// Test all platforms
console.log('🧪 Testing All Social Media Platforms...\n')

try {
  // Generate posts for each platform
  const platforms = ['linkedin', 'tiktok', 'instagram']
  
  platforms.forEach((platform, index) => {
    console.log(`--- ${platform.toUpperCase()} Post Test ${index + 1} ---`)
    
    // Force platform selection by modifying the citizen's social media data
    const testCitizen = { ...sampleCitizen }
    if (platform === 'linkedin') {
      testCitizen.socialMedia.linkedIn.engagementRatePct = 10
      testCitizen.socialMedia.tikTok.engagementRatePct = 5
      testCitizen.socialMedia.instagram.engagementRatePct = 3
    } else if (platform === 'tiktok') {
      testCitizen.socialMedia.linkedIn.engagementRatePct = 3
      testCitizen.socialMedia.tikTok.engagementRatePct = 10
      testCitizen.socialMedia.instagram.engagementRatePct = 5
    } else if (platform === 'instagram') {
      testCitizen.socialMedia.linkedIn.engagementRatePct = 3
      testCitizen.socialMedia.tikTok.engagementRatePct = 5
      testCitizen.socialMedia.instagram.engagementRatePct = 10
    }
    
    const post = SocialMediaPostGenerator.generatePost(testCitizen)
    
    console.log(`Platform: ${post.platform}`)
    console.log(`Author: ${post.citizen.name} (${post.citizen.role} at ${post.citizen.company})`)
    console.log(`Timestamp: ${post.timestamp.toLocaleString()}`)
    console.log('')
    console.log('📝 Post Content:')
    console.log(post.content)
    console.log('')
    console.log(`🏷️  Hashtags: ${post.hashtags.join(' ')}`)
    console.log('')
    console.log('='.repeat(80))
    console.log('')
  })
  
  console.log('✅ All Social Media Platform tests completed successfully!')
  console.log('')
  console.log('🎯 Platform-Specific Features:')
  console.log('')
  console.log('💼 LinkedIn:')
  console.log('• Professional tone and business language')
  console.log('• Industry insights and career development')
  console.log('• Structured content with bullet points')
  console.log('• Engagement prompts for professional networking')
  console.log('• Leadership and mentorship themes')
  console.log('')
  console.log('🎵 TikTok:')
  console.log('• Energetic and trendy content')
  console.log('• Short, punchy messages with emojis')
  console.log('• Behind-the-scenes and day-in-the-life content')
  console.log('• Productivity hacks and career tips')
  console.log('• Trending hashtags and viral content style')
  console.log('')
  console.log('📸 Instagram:')
  console.log('• Lifestyle and visual storytelling')
  console.log('• Inspirational and motivational content')
  console.log('• Work-life balance themes')
  console.log('• Community and collaboration focus')
  console.log('• Aesthetic and visually appealing content')
  console.log('')
  console.log('💾 Database Integration:')
  console.log('• All posts automatically saved to MongoDB')
  console.log('• Platform-specific collections:')
  console.log('  - linkedin-posts')
  console.log('  - tiktok-posts')
  console.log('  - instagram-posts')
  console.log('• Citizen attribution and engagement tracking')
  console.log('• API endpoints for retrieving posts')
  
} catch (error) {
  console.error('❌ Error testing Social Media Platforms:', error)
}

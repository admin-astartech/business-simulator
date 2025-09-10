/**
 * Test script for Citizen Display in Social Media Posts
 * This script demonstrates how social media posts now display citizen information
 */

const { SocialMediaPostGenerator } = require('../lib/socialMediaPostGenerator.ts')

// Sample citizen data for testing
const sampleCitizen = {
  id: 'test-citizen-display-1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  role: 'Software Engineer',
  initials: 'SJ',
  avatarColor: 'bg-blue-500',
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

// Test function to simulate API calls
async function testApiCall(endpoint, method = 'GET', data = null) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (data) {
      options.body = JSON.stringify(data)
    }
    
    console.log(`📡 Making ${method} request to: ${baseUrl}${endpoint}`)
    
    const response = await fetch(`${baseUrl}${endpoint}`, options)
    const result = await response.json()
    
    console.log(`📡 Response status: ${response.status}`)
    
    return { success: response.ok, data: result, status: response.status }
  } catch (error) {
    console.error(`❌ API call failed:`, error)
    return { success: false, error: error.message }
  }
}

// Test citizen display functionality
async function testCitizenDisplay() {
  console.log('🧪 Testing Citizen Display in Social Media Posts...\n')
  
  try {
    // Test 1: Generate posts for each platform
    console.log('--- Test 1: Generate Posts with Citizen Information ---')
    
    const platforms = ['linkedin', 'tiktok', 'instagram']
    const generatedPosts = []
    
    for (const platform of platforms) {
      console.log(`\n📱 Testing ${platform.toUpperCase()} post generation...`)
      
      // Modify citizen to prefer this platform
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
      generatedPosts.push(post)
      
      console.log(`✅ Generated ${post.platform} post`)
      console.log(`👤 Citizen: ${post.citizen.name} (${post.citizen.role})`)
      console.log(`🏢 Company: ${post.citizen.company}`)
      console.log(`🎨 Avatar Color: ${post.citizen.avatarColor}`)
      console.log(`👥 Gender: ${post.citizen.gender}`)
      console.log(`🟢 Online: ${post.citizen.isOnline}`)
      console.log(`📝 Content preview: ${post.content.substring(0, 100)}...`)
    }
    
    // Test 2: Test API endpoints with citizen information
    console.log('\n--- Test 2: Test API Endpoints with Citizen Information ---')
    
    const apiEndpoints = [
      '/api/linkedin-posts',
      '/api/tiktok-posts', 
      '/api/instagram-posts'
    ]
    
    for (const endpoint of apiEndpoints) {
      console.log(`\n🔍 Testing ${endpoint}...`)
      
      // Test GET endpoint
      const getResult = await testApiCall(endpoint, 'GET')
      if (getResult.success) {
        console.log(`✅ GET ${endpoint} - Success`)
        console.log(`📊 Posts count: ${getResult.data.posts?.length || 0}`)
        
        // Check if posts have citizen information
        if (getResult.data.posts && getResult.data.posts.length > 0) {
          const firstPost = getResult.data.posts[0]
          console.log(`👤 First post citizen info:`)
          console.log(`   - Name: ${firstPost.citizenName || 'Not available'}`)
          console.log(`   - Role: ${firstPost.citizenRole || 'Not available'}`)
          console.log(`   - Company: ${firstPost.citizenCompany || 'Not available'}`)
          console.log(`   - Gender: ${firstPost.citizenGender || 'Not available'}`)
          console.log(`   - Avatar Color: ${firstPost.citizenAvatarColor || 'Not available'}`)
          console.log(`   - Online: ${firstPost.citizenIsOnline !== undefined ? firstPost.citizenIsOnline : 'Not available'}`)
        }
      } else {
        console.log(`❌ GET ${endpoint} - Failed: ${getResult.error}`)
      }
    }
    
    // Test 3: Test POST endpoints with full citizen information
    console.log('\n--- Test 3: Test POST Endpoints with Full Citizen Information ---')
    
    for (let i = 0; i < generatedPosts.length; i++) {
      const post = generatedPosts[i]
      const platform = post.platform
      const endpoint = `/api/${platform}-posts`
      
      console.log(`\n📤 Testing POST ${endpoint} with citizen info...`)
      
      const postData = {
        content: post.content,
        author: post.citizen.name,
        hashtags: post.hashtags,
        citizenId: post.citizen.id,
        citizenName: post.citizen.name,
        citizenRole: post.citizen.role,
        citizenCompany: post.citizen.company,
        citizenGender: post.citizen.gender,
        citizenAvatarColor: post.citizen.avatarColor,
        citizenIsOnline: post.citizen.isOnline
      }
      
      const postResult = await testApiCall(endpoint, 'POST', postData)
      if (postResult.success) {
        console.log(`✅ POST ${endpoint} - Success`)
        console.log(`🆔 Post ID: ${postResult.data.postId}`)
        console.log(`👤 Citizen info saved: ${post.citizen.name} (${post.citizen.role})`)
      } else {
        console.log(`❌ POST ${endpoint} - Failed: ${postResult.error}`)
      }
    }
    
    console.log('\n✅ Citizen display testing completed!')
    console.log('')
    console.log('🎯 Key Features Added:')
    console.log('• Citizen name and avatar display')
    console.log('• Role and company information')
    console.log('• Online/offline status indicator')
    console.log('• Gender-based avatar generation')
    console.log('• Consistent styling with other app components')
    console.log('• Fallback to author name if citizen info unavailable')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the tests
testCitizenDisplay()

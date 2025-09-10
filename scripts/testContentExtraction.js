/**
 * Test script to verify that social media post content extraction works correctly
 * This script tests the OpenAI response parsing to ensure content is properly extracted
 */

const { SocialMediaPostGenerator } = require('../lib/socialMediaPostGenerator.ts')

// Mock citizen data for testing
const mockCitizen = {
  id: 'test-citizen-1',
  name: 'John Doe',
  role: 'Software Engineer',
  company: 'Tech Corp',
  gender: 'male',
  avatarColor: '#3B82F6',
  isOnline: true,
  personality: {
    traits: ['analytical', 'creative'],
    workStyle: 'collaborative',
    socialStyle: 'professional',
    values: ['innovation', 'excellence'],
    interests: ['technology', 'problem-solving'],
    motivation: 'building innovative solutions'
  }
}

async function testContentExtraction() {
  console.log('🧪 Testing social media post content extraction...')
  console.log('👤 Testing with citizen:', mockCitizen.name)
  
  try {
    // Generate a post for each platform
    const platforms = ['linkedin', 'tiktok', 'instagram']
    
    for (const platform of platforms) {
      console.log(`\n📱 Testing ${platform.toUpperCase()} post generation...`)
      
      try {
        const post = await SocialMediaPostGenerator.generatePost(mockCitizen)
        
        console.log(`✅ Generated ${platform} post successfully`)
        console.log(`📝 Content type: ${typeof post.content}`)
        console.log(`📏 Content length: ${post.content.length}`)
        console.log(`📄 Content preview: ${post.content.substring(0, 150)}...`)
        console.log(`🏷️ Hashtags: ${post.hashtags.join(', ')}`)
        
        // Check if content is a JSON string (which would be wrong)
        try {
          const parsed = JSON.parse(post.content)
          if (typeof parsed === 'object' && parsed !== null) {
            console.log('❌ ERROR: Content is a JSON object instead of plain text!')
            console.log('🔍 Parsed content:', parsed)
          } else {
            console.log('✅ Content is properly formatted as plain text')
          }
        } catch {
          console.log('✅ Content is properly formatted as plain text (not JSON)')
        }
        
      } catch (error) {
        console.error(`❌ Error generating ${platform} post:`, error.message)
      }
    }
    
    console.log('\n🎉 Content extraction test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

// Run the test
testContentExtraction()


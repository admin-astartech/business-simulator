/**
 * Test script for OpenAI-powered social media post generation
 * Run with: node scripts/testOpenAIPostGeneration.js
 */

const { SocialMediaPostGenerator } = require('../lib/socialMediaPostGenerator')

// Sample citizen data for testing
const sampleCitizens = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'TechCorp',
    isOnline: true
  },
  {
    id: '2', 
    name: 'Michael Chen',
    role: 'Marketing Manager',
    company: 'Creative Agency',
    isOnline: true
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Data Analyst',
    company: 'Finance Solutions',
    isOnline: true
  },
  {
    id: '4',
    name: 'David Kim',
    role: 'Product Designer',
    company: 'Design Studio',
    isOnline: true
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    role: 'Sales Director',
    company: 'Enterprise Solutions',
    isOnline: true
  }
]

async function testPostGeneration() {
  console.log('🧪 Testing OpenAI-powered social media post generation...\n')
  
  for (const citizen of sampleCitizens) {
    try {
      console.log(`👤 Testing with ${citizen.name} (${citizen.role} at ${citizen.company})`)
      console.log('='.repeat(60))
      
      const post = await SocialMediaPostGenerator.generatePost(citizen)
      
      console.log(`📱 Platform: ${post.platform.toUpperCase()}`)
      console.log(`📝 Content:`)
      console.log(post.content)
      console.log(`\n🏷️  Hashtags: ${post.hashtags.join(' ')}`)
      console.log(`⏰ Generated: ${post.timestamp.toLocaleString()}`)
      console.log('='.repeat(60))
      console.log('')
      
    } catch (error) {
      console.error(`❌ Error generating post for ${citizen.name}:`, error.message)
      console.log('')
    }
  }
  
  console.log('✅ Test completed!')
}

// Run the test
testPostGeneration().catch(console.error)

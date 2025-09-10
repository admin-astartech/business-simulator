/**
 * Test script for citizen engagement functionality with OpenAI function calling
 * This script tests the new citizen engagement cron job that simulates
 * citizens engaging with social media posts using AI agents
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testCitizenEngagement() {
  try {
    console.log('🧪 Testing Citizen Engagement with OpenAI Function Calling')
    console.log('=' .repeat(60))
    console.log('🤖 This test uses OpenAI agents with function calling to:')
    console.log('   • Pick a random online citizen')
    console.log('   • Select a random social media platform')
    console.log('   • Send actual post data to the AI model')
    console.log('   • Use the likePost tool function to select a post')
    console.log('   • Log which comment the citizen liked most')
    console.log('=' .repeat(60))
    
    // Test the citizen engagement endpoint
    const response = await fetch(`${BASE_URL}/api/test-citizen-engagement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Citizen engagement test completed successfully!')
      console.log('📝 Check the server console logs for detailed AI function calling simulation')
      console.log('🔍 The AI agent should have:')
      console.log('   • Analyzed the citizen\'s personality and interests')
      console.log('   • Reviewed the actual post data and comments')
      console.log('   • Called the likePost function with specific post ID and reason')
      console.log('   • Logged detailed engagement information')
    } else {
      console.error('❌ Citizen engagement test failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error running citizen engagement test:', error)
  }
}

// Run the test
testCitizenEngagement()

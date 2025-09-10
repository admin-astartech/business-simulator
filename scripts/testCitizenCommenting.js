/**
 * Test script for citizen commenting functionality with OpenAI function calling
 * This script tests the new citizen commenting cron job that simulates
 * citizens commenting on social media posts using AI agents
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testCitizenCommenting() {
  try {
    console.log('🧪 Testing Citizen Commenting with OpenAI Function Calling')
    console.log('=' .repeat(60))
    console.log('🤖 This test uses OpenAI agents with function calling to:')
    console.log('   • Pick a random online citizen')
    console.log('   • Select a random social media platform')
    console.log('   • Send actual post data to the AI model')
    console.log('   • Use the addComment tool function to write a comment')
    console.log('   • Generate realistic comments that match citizen personality')
    console.log('   • Add the comment to the post in the database')
    console.log('=' .repeat(60))
    
    // Test the citizen commenting endpoint
    const response = await fetch(`${BASE_URL}/api/test-citizen-commenting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Citizen commenting test completed successfully!')
      console.log('📝 Check the server console logs for detailed AI commenting simulation')
      console.log('🔍 The AI agent should have:')
      console.log('   • Analyzed the citizen\'s personality and communication style')
      console.log('   • Reviewed the actual post data and existing comments')
      console.log('   • Called the addComment function with specific post ID and comment')
      console.log('   • Generated a realistic comment that matches the citizen\'s personality')
      console.log('   • Added the comment to the database')
      console.log('   • Logged detailed commenting information')
    } else {
      console.error('❌ Citizen commenting test failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error running citizen commenting test:', error)
  }
}

// Run the test
testCitizenCommenting()

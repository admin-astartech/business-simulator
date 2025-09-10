/**
 * Test script for engagement service directly
 * This script tests the engagement service to see if it's saving data
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testEngagementService() {
  try {
    console.log('🧪 Testing Engagement Service Directly')
    console.log('=' .repeat(50))
    
    // Test the engagement service endpoint
    console.log('🎯 Testing citizen engagement service...')
    const response = await fetch(`${BASE_URL}/api/test-citizen-engagement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ Engagement service test completed!')
      
      // Wait a moment for any async operations to complete
      console.log('⏳ Waiting for database operations to complete...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if data was saved
      console.log('📊 Checking engagement analytics...')
      const analyticsResponse = await fetch(`${BASE_URL}/api/engagement-analytics?timeRange=1d`)
      const analyticsResult = await analyticsResponse.json()
      
      if (analyticsResult.success) {
        console.log(`📈 Total engagements in database: ${analyticsResult.analytics.summary.totalEngagements}`)
        if (analyticsResult.analytics.summary.totalEngagements > 0) {
          console.log('✅ Data is being saved to the database!')
          console.log('📋 Recent engagements:', analyticsResult.analytics.recentEngagements.slice(0, 3))
        } else {
          console.log('⚠️ No engagement data found in database')
        }
      }
    } else {
      console.error('❌ Engagement service test failed:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error running engagement service test:', error)
  }
}

// Run the test
testEngagementService()

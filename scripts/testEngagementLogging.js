/**
 * Test script for engagement logging functionality
 * This script tests the engagement data logging to the database
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function testEngagementLogging() {
  try {
    console.log('🧪 Testing Engagement Logging System')
    console.log('=' .repeat(50))
    
    // Test engagement logging endpoint
    console.log('📊 Testing engagement log API...')
    const logResponse = await fetch(`${BASE_URL}/api/engagement-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        citizenId: 'test-citizen-123',
        citizenName: 'Test Citizen',
        platform: 'linkedin',
        postId: 'test-post-456',
        postContent: 'This is a test post content for engagement logging',
        engagementType: 'like',
        engagementReason: 'This post really resonated with my professional interests in data analysis and I found the insights valuable for my current project.',
        timestamp: new Date().toISOString()
      })
    })
    
    const logResult = await logResponse.json()
    
    if (logResult.success) {
      console.log('✅ Engagement log created successfully!')
      console.log(`📝 Engagement ID: ${logResult.engagementId}`)
    } else {
      console.error('❌ Failed to create engagement log:', logResult.error)
    }
    
    // Test analytics endpoint
    console.log('\n📈 Testing engagement analytics API...')
    const analyticsResponse = await fetch(`${BASE_URL}/api/engagement-analytics?timeRange=7d`)
    const analyticsResult = await analyticsResponse.json()
    
    if (analyticsResult.success) {
      console.log('✅ Analytics retrieved successfully!')
      console.log(`📊 Total engagements: ${analyticsResult.analytics.summary.totalEngagements}`)
      console.log(`🏆 Platform breakdown:`, analyticsResult.analytics.breakdowns.platforms)
      console.log(`💬 Engagement types:`, analyticsResult.analytics.breakdowns.engagementTypes)
    } else {
      console.error('❌ Failed to retrieve analytics:', analyticsResult.error)
    }
    
    // Test comment logging
    console.log('\n💬 Testing comment logging...')
    const commentLogResponse = await fetch(`${BASE_URL}/api/engagement-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        citizenId: 'test-citizen-456',
        citizenName: 'Test Commenter',
        platform: 'instagram',
        postId: 'test-post-789',
        postContent: 'This is another test post for comment logging',
        engagementType: 'comment',
        engagementReason: 'This post caught my attention because it relates to my work in marketing and I wanted to share my experience with similar campaigns.',
        commentContent: 'Great insights! I\'ve been working on similar campaigns and found that A/B testing really makes a difference. What metrics do you focus on most?',
        commentId: 'comment-123',
        timestamp: new Date().toISOString()
      })
    })
    
    const commentLogResult = await commentLogResponse.json()
    
    if (commentLogResult.success) {
      console.log('✅ Comment log created successfully!')
      console.log(`📝 Comment Engagement ID: ${commentLogResult.engagementId}`)
    } else {
      console.error('❌ Failed to create comment log:', commentLogResult.error)
    }
    
    console.log('\n🎉 Engagement logging test completed!')
    console.log('💾 Check your MongoDB database for the "engagement-log" collection')
    
  } catch (error) {
    console.error('❌ Error running engagement logging test:', error)
  }
}

// Run the test
testEngagementLogging()

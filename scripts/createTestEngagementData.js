/**
 * Script to create test engagement data for specific post IDs
 * This will help test the analytics modal functionality
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

async function createTestEngagementData() {
  try {
    console.log('🧪 Creating Test Engagement Data')
    console.log('=' .repeat(50))
    
    // Sample engagement data for LinkedIn posts
    const linkedinEngagements = [
      {
        citizenId: 'citizen-1',
        citizenName: 'Sarah Johnson',
        platform: 'linkedin',
        postId: '1',
        postContent: 'How business simulation can improve decision-making skills in the corporate world',
        engagementType: 'like',
        engagementReason: 'This post really resonates with my experience in corporate training. I\'ve seen firsthand how simulation-based learning improves decision-making skills.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        citizenId: 'citizen-2',
        citizenName: 'Michael Chen',
        platform: 'linkedin',
        postId: '1',
        postContent: 'How business simulation can improve decision-making skills in the corporate world',
        engagementType: 'comment',
        engagementReason: 'I found this post interesting because it relates to my work in corporate training and I wanted to share my experience.',
        commentContent: 'Great insights! I\'ve been using business simulations in my training programs for 3 years now. The results have been remarkable - 40% improvement in decision-making speed.',
        commentId: 'comment-1',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      },
      {
        citizenId: 'citizen-3',
        citizenName: 'Emily Rodriguez',
        platform: 'linkedin',
        postId: '2',
        postContent: 'The future of business education: interactive simulations vs traditional case studies',
        engagementType: 'like',
        engagementReason: 'This topic is very relevant to my research in educational technology. I appreciate the balanced perspective on both approaches.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      },
      {
        citizenId: 'citizen-4',
        citizenName: 'David Kim',
        platform: 'linkedin',
        postId: '2',
        postContent: 'The future of business education: interactive simulations vs traditional case studies',
        engagementType: 'comment',
        engagementReason: 'I wanted to share my thoughts on this topic as someone who has taught both traditional and simulation-based courses.',
        commentContent: 'Interesting perspective! I think the key is finding the right balance. Simulations work great for complex scenarios, but case studies still have value for theoretical understanding.',
        commentId: 'comment-2',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
      }
    ]

    // Sample engagement data for TikTok posts
    const tiktokEngagements = [
      {
        citizenId: 'citizen-5',
        citizenName: 'Alex Thompson',
        platform: 'tiktok',
        postId: '1',
        postContent: 'POV: You just learned about business simulation for the first time 🎯',
        engagementType: 'like',
        engagementReason: 'This video perfectly captures the excitement of discovering business simulation! The energy is contagious.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      },
      {
        citizenId: 'citizen-6',
        citizenName: 'Jessica Park',
        platform: 'tiktok',
        postId: '1',
        postContent: 'POV: You just learned about business simulation for the first time 🎯',
        engagementType: 'comment',
        engagementReason: 'I related to this video so much! I wanted to share my own experience with business simulation.',
        commentContent: 'OMG this is so accurate! I remember my first simulation - I was so confused but then it clicked and I was hooked! 😂',
        commentId: 'comment-3',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() // 15 minutes ago
      },
      {
        citizenId: 'citizen-7',
        citizenName: 'Ryan O\'Connor',
        platform: 'tiktok',
        postId: '2',
        postContent: 'Quick business tip that changed everything 💡',
        engagementType: 'like',
        engagementReason: 'This tip is gold! I\'ve been applying it in my startup and it\'s made a huge difference.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
      }
    ]

    // Sample engagement data for Instagram posts
    const instagramEngagements = [
      {
        citizenId: 'citizen-8',
        citizenName: 'Maria Garcia',
        platform: 'instagram',
        postId: '1',
        postContent: 'Behind the scenes of our development process 📱',
        engagementType: 'like',
        engagementReason: 'I love seeing the behind-the-scenes content! It gives me insight into how professional development tools are created.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      },
      {
        citizenId: 'citizen-9',
        citizenName: 'James Wilson',
        platform: 'instagram',
        postId: '1',
        postContent: 'Behind the scenes of our development process 📱',
        engagementType: 'comment',
        engagementReason: 'This post caught my attention because I\'m also in software development and wanted to share my thoughts.',
        commentContent: 'Fascinating process! I\'m curious about the user testing phase. How do you ensure the simulations feel realistic?',
        commentId: 'comment-4',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
      }
    ]

    // Combine all engagements
    const allEngagements = [...linkedinEngagements, ...tiktokEngagements, ...instagramEngagements]

    console.log(`📊 Creating ${allEngagements.length} engagement records...`)

    // Create all engagement records
    for (const engagement of allEngagements) {
      try {
        const response = await fetch(`${BASE_URL}/api/engagement-log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(engagement)
        })
        
        const result = await response.json()
        
        if (result.success) {
          console.log(`✅ Created engagement for ${engagement.citizenName} on ${engagement.platform} post ${engagement.postId}`)
        } else {
          console.error(`❌ Failed to create engagement for ${engagement.citizenName}:`, result.error)
        }
      } catch (error) {
        console.error(`❌ Error creating engagement for ${engagement.citizenName}:`, error.message)
      }
    }

    console.log('\n🎉 Test engagement data creation completed!')
    console.log('💾 You can now test the analytics modal with real data')
    
  } catch (error) {
    console.error('❌ Error creating test engagement data:', error)
  }
}

// Run the script
createTestEngagementData()

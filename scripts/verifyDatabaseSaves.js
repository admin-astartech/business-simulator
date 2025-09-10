/**
 * Database Verification Script
 * This script verifies that social media posts are being saved correctly to the database
 */

const { getDatabase } = require('../lib/mongodb.ts')

async function verifyDatabaseSaves() {
  console.log('🔍 Verifying Social Media Posts Database Saves...\n')
  
  try {
    const db = await getDatabase()
    
    // Check each collection
    const collections = [
      { name: 'linkedin-posts', platform: 'LinkedIn' },
      { name: 'tiktok-posts', platform: 'TikTok' },
      { name: 'instagram-posts', platform: 'Instagram' }
    ]
    
    let totalPosts = 0
    let totalCollections = 0
    
    for (const collection of collections) {
      console.log(`📊 Checking ${collection.platform} posts collection...`)
      
      try {
        const posts = await db.collection(collection.name).find({}).sort({ createdAt: -1 }).toArray()
        
        console.log(`   ✅ Collection "${collection.name}" exists`)
        console.log(`   📈 Total posts: ${posts.length}`)
        
        if (posts.length > 0) {
          const latestPost = posts[0]
          console.log(`   🕒 Latest post: ${latestPost.createdAt}`)
          console.log(`   👤 Author: ${latestPost.author || 'Unknown'}`)
          console.log(`   📱 Platform: ${latestPost.platform || 'Unknown'}`)
          console.log(`   🏷️  Hashtags: ${latestPost.hashtags?.length || 0} hashtags`)
          console.log(`   📝 Content preview: ${latestPost.content?.substring(0, 100) || 'No content'}...`)
          
          // Check for required fields
          const requiredFields = ['content', 'author', 'platform', 'createdAt']
          const missingFields = requiredFields.filter(field => !latestPost[field])
          
          if (missingFields.length > 0) {
            console.log(`   ⚠️  Missing required fields: ${missingFields.join(', ')}`)
          } else {
            console.log(`   ✅ All required fields present`)
          }
          
          // Check citizen attribution
          if (latestPost.citizenId && latestPost.citizenName) {
            console.log(`   👤 Citizen attribution: ${latestPost.citizenName} (${latestPost.citizenRole})`)
          } else {
            console.log(`   ⚠️  Missing citizen attribution`)
          }
          
          totalPosts += posts.length
          totalCollections++
        } else {
          console.log(`   ⚠️  No posts found in collection`)
        }
        
      } catch (error) {
        console.log(`   ❌ Error accessing collection "${collection.name}": ${error.message}`)
      }
      
      console.log('')
    }
    
    // Summary
    console.log('📊 VERIFICATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`✅ Collections checked: ${totalCollections}/${collections.length}`)
    console.log(`📈 Total posts across all platforms: ${totalPosts}`)
    console.log(`📊 Average posts per collection: ${totalCollections > 0 ? Math.round(totalPosts / totalCollections) : 0}`)
    
    if (totalPosts > 0) {
      console.log('')
      console.log('🎯 RECENT POSTS BY PLATFORM')
      console.log('='.repeat(50))
      
      for (const collection of collections) {
        try {
          const recentPosts = await db.collection(collection.name).find({}).sort({ createdAt: -1 }).limit(3).toArray()
          
          if (recentPosts.length > 0) {
            console.log(`\n${collection.platform} (${recentPosts.length} recent posts):`)
            recentPosts.forEach((post, index) => {
              const timeAgo = getTimeAgo(post.createdAt)
              console.log(`   ${index + 1}. ${post.author} - ${timeAgo}`)
              console.log(`      "${post.content?.substring(0, 80) || 'No content'}..."`)
            })
          }
        } catch (error) {
          console.log(`   ❌ Could not fetch recent posts: ${error.message}`)
        }
      }
    }
    
    console.log('')
    console.log('✅ Database verification completed!')
    
  } catch (error) {
    console.error('❌ Database verification failed:', error)
  }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  } else {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks}w ago`
  }
}

// Run the verification
verifyDatabaseSaves()

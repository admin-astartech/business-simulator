import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { SocialMediaPostGenerator } from '@/lib/socialMediaPostGenerator'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing social media post generation and database save...')
    
    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Get a random citizen
    const allCitizens = await citizens.find({}).toArray()
    
    if (allCitizens.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'No citizens found in database' 
        },
        { status: 404 }
      )
    }
    
    // Select a random citizen
    const randomCitizen = allCitizens[Math.floor(Math.random() * allCitizens.length)] as any
    console.log(`👤 Selected citizen: ${randomCitizen.name} (${randomCitizen.role})`)
    
    // Generate a social media post
    const socialPost = await SocialMediaPostGenerator.generatePost(randomCitizen)
    console.log(`📱 Generated ${socialPost.platform} post`)
    
    // Determine the correct collection
    let collectionName: string
    switch (socialPost.platform) {
      case 'linkedin':
        collectionName = 'linkedin-posts'
        break
      case 'tiktok':
        collectionName = 'tiktok-posts'
        break
      case 'instagram':
        collectionName = 'instagram-posts'
        break
      default:
        throw new Error(`Unsupported platform: ${socialPost.platform}`)
    }
    
    // Save to database
    const postData = {
      content: socialPost.content,
      author: socialPost.citizen.name,
      hashtags: socialPost.hashtags,
      citizenId: socialPost.citizen.id,
      citizenName: socialPost.citizen.name,
      citizenRole: socialPost.citizen.role,
      citizenCompany: socialPost.citizen.company,
      citizenGender: randomCitizen.gender,
      citizenAvatarColor: randomCitizen.avatarColor,
      citizenIsOnline: randomCitizen.isOnline,
      likes: 0,
      comments: 0,
      shares: 0,
      platform: socialPost.platform,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const collection = db.collection(collectionName)
    const result = await collection.insertOne(postData)
    
    console.log(`✅ Post saved to ${collectionName} with ID: ${result.insertedId}`)
    
    // Verify the save
    const savedPost = await collection.findOne({ _id: result.insertedId })
    
    if (savedPost) {
      console.log(`✅ Verification successful: Post found in database`)
      
      return NextResponse.json({
        success: true,
        message: 'Social media post generated and saved successfully',
        data: {
          postId: result.insertedId,
          platform: socialPost.platform,
          collection: collectionName,
          citizen: {
            id: socialPost.citizen.id,
            name: socialPost.citizen.name,
            role: socialPost.citizen.role,
            company: socialPost.citizen.company
          },
          content: socialPost.content,
          hashtags: socialPost.hashtags,
          createdAt: savedPost.createdAt,
          verification: {
            saved: true,
            foundInDatabase: true,
            collectionExists: true
          }
        }
      })
    } else {
      console.log(`❌ Verification failed: Post not found in database`)
      
      return NextResponse.json({
        success: false,
        error: 'Post was not found in database after save',
        data: {
          postId: result.insertedId,
          platform: socialPost.platform,
          collection: collectionName,
          verification: {
            saved: true,
            foundInDatabase: false,
            collectionExists: true
          }
        }
      })
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Test failed: ' + (error instanceof Error ? error.message : String(error)),
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('🔍 Checking database collections and recent posts...')
    
    const db = await getDatabase()
    const collections = ['linkedin-posts', 'tiktok-posts', 'instagram-posts']
    const results: { [key: string]: any } = {}
    
    for (const collectionName of collections) {
      try {
        const collection = db.collection(collectionName)
        const count = await collection.countDocuments()
        const recentPosts = await collection.find({}).sort({ createdAt: -1 }).limit(3).toArray()
        
        results[collectionName] = {
          exists: true,
          count: count,
          recentPosts: recentPosts.map(post => ({
            id: post._id.toString(),
            author: post.author,
            platform: post.platform,
            createdAt: post.createdAt,
            contentPreview: post.content?.substring(0, 100) + '...',
            hashtags: post.hashtags?.length || 0
          }))
        }
      } catch (error) {
        results[collectionName] = {
          exists: false,
          error: error instanceof Error ? error.message : String(error)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database status check completed',
      collections: results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Database check failed: ' + (error instanceof Error ? error.message : String(error))
      },
      { status: 500 }
    )
  }
}

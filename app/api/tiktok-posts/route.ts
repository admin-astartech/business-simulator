import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection('tiktok-posts')
    
    // Fetch TikTok posts from MongoDB
    const posts = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    // Transform MongoDB documents to match our SocialPost interface
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      content: post.content,
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
      time: formatTimeAgo(post.createdAt),
      author: post.author || 'Unknown',
      platform: 'tiktok',
      // Only include citizen ID
      citizenId: post.citizenId,
      // Include likedBy array
      likedBy: post.likedBy || [],
      // Include comments array
      commentsList: post.commentsList || []
    }))
    
    return NextResponse.json({
      success: true,
      posts: transformedPosts,
      total: transformedPosts.length
    })
  } catch (error) {
    console.error('Error fetching TikTok posts:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch TikTok posts from database' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, author, hashtags, citizenId } = body
    
    if (!content || !author) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Content and author are required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('tiktok-posts')
    
    // Create the post document
    const postData = {
      content,
      author,
      hashtags: hashtags || [],
      citizenId: citizenId || null,
      likes: 0,
      comments: 0,
      shares: 0,
      platform: 'tiktok',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the post into the database
    const result = await collection.insertOne(postData)
    
    console.log(`✅ TikTok post saved to database: ${result.insertedId}`)
    
    return NextResponse.json({
      success: true,
      postId: result.insertedId,
      message: 'TikTok post saved successfully'
    })
    
  } catch (error) {
    console.error('Error saving TikTok post:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save TikTok post to database' 
      },
      { status: 500 }
    )
  }
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
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
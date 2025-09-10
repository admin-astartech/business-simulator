import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const collection = db.collection('instagram-posts')
    
    // Fetch Instagram posts from MongoDB
    const posts = await collection.find({}).sort({ createdAt: -1 }).toArray()
    
    // Get all unique citizen IDs from posts
    const citizenIds = Array.from(new Set(posts.map(post => post.citizenId).filter(Boolean)))
    
    // Fetch citizen data for all posts
    const citizensCollection = db.collection('citizens')
    const citizens = await citizensCollection.find({ id: { $in: citizenIds } }).toArray()
    const citizensMap = new Map(citizens.map(citizen => [citizen.id, citizen]))
    
    // Transform MongoDB documents to match our SocialPost interface
    const transformedPosts = posts.map(post => {
      const citizen = citizensMap.get(post.citizenId)
      return {
        id: post._id.toString(),
        content: post.content,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: post.shares || 0,
        time: formatTimeAgo(post.createdAt),
        author: citizen ? citizen.name : 'Unknown',
        platform: 'instagram',
        citizenId: post.citizenId,
        hashtags: post.hashtags || [],
        likedBy: post.likedBy || [],
        commentsList: post.commentsList || []
      }
    })
    
    return NextResponse.json({
      success: true,
      posts: transformedPosts,
      total: transformedPosts.length
    })
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch Instagram posts from database' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content, hashtags, citizenId } = body
    
    if (!content || !citizenId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Content and citizenId are required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('instagram-posts')
    
    // Create the post document
    const postData = {
      content,
      hashtags: hashtags || [],
      citizenId: citizenId,
      likes: 0,
      comments: 0,
      shares: 0,
      platform: 'instagram',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the post into the database
    const result = await collection.insertOne(postData)
    
    console.log(`✅ Instagram post saved to database: ${result.insertedId}`)
    
    return NextResponse.json({
      success: true,
      postId: result.insertedId,
      message: 'Instagram post saved successfully'
    })
    
  } catch (error) {
    console.error('Error saving Instagram post:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to save Instagram post to database' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')
    
    if (!postId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post ID is required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('instagram-posts')
    
    // Convert postId to ObjectId
    let objectId
    try {
      objectId = new ObjectId(postId)
    } catch (error) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid post ID format' 
        },
        { status: 400 }
      )
    }
    
    // Delete the post
    const result = await collection.deleteOne({ _id: objectId })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      )
    }
    
    console.log(`✅ Instagram post deleted: ${postId}`)
    
    return NextResponse.json({
      success: true,
      message: 'Instagram post deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting Instagram post:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete Instagram post' 
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
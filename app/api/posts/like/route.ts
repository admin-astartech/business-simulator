import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, platform, userId } = body
    
    if (!postId || !platform || !userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'postId, platform, and userId are required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Determine the correct collection based on platform
    let collectionName: string
    switch (platform) {
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
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid platform. Must be linkedin, tiktok, or instagram' 
          },
          { status: 400 }
        )
    }
    
    const collection = db.collection(collectionName)
    
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
    
    // Find the post
    const post = await collection.findOne({ _id: objectId })
    if (!post) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      )
    }
    
    // Check if user has already liked this post
    const likedBy = post.likedBy || []
    const isAlreadyLiked = likedBy.includes(userId)
    
    let updatedLikedBy: string[]
    let updatedLikes: number
    
    if (isAlreadyLiked) {
      // Remove like
      updatedLikedBy = likedBy.filter((id: string) => id !== userId)
      updatedLikes = Math.max(0, (post.likes || 0) - 1)
    } else {
      // Add like
      updatedLikedBy = [...likedBy, userId]
      updatedLikes = (post.likes || 0) + 1
    }
    
    // Update the post in the database
    const result = await collection.updateOne(
      { _id: objectId },
      { 
        $set: { 
          likes: updatedLikes,
          likedBy: updatedLikedBy,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update post' 
        },
        { status: 500 }
      )
    }
    
    console.log(`✅ Post ${postId} ${isAlreadyLiked ? 'unliked' : 'liked'} by user ${userId}`)
    
    return NextResponse.json({
      success: true,
      isLiked: !isAlreadyLiked,
      likes: updatedLikes,
      message: `Post ${isAlreadyLiked ? 'unliked' : 'liked'} successfully`
    })
    
  } catch (error) {
    console.error('Error updating post like:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update post like' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const platform = searchParams.get('platform')
    const userId = searchParams.get('userId')
    
    if (!postId || !platform || !userId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'postId, platform, and userId are required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    
    // Determine the correct collection based on platform
    let collectionName: string
    switch (platform) {
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
        return NextResponse.json(
          { 
            success: false,
            error: 'Invalid platform. Must be linkedin, tiktok, or instagram' 
          },
          { status: 400 }
        )
    }
    
    const collection = db.collection(collectionName)
    
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
    
    // Find the post
    const post = await collection.findOne({ _id: objectId })
    if (!post) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Post not found' 
        },
        { status: 404 }
      )
    }
    
    // Check if user has liked this post
    const likedBy = post.likedBy || []
    const isLiked = likedBy.includes(userId)
    
    return NextResponse.json({
      success: true,
      isLiked,
      likes: post.likes || 0,
      likedBy: likedBy
    })
    
  } catch (error) {
    console.error('Error checking post like status:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check post like status' 
      },
      { status: 500 }
    )
  }
}
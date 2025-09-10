import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, platform, userId, content } = body
    
    if (!postId || !platform || !userId || !content) {
      return NextResponse.json(
        { 
          success: false,
          error: 'postId, platform, userId, and content are required' 
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
    
    // Create new comment
    const newComment = {
      id: new ObjectId().toString(),
      content: content.trim(),
      authorId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Update the post with the new comment
    const result = await collection.updateOne(
      { _id: objectId },
      { 
        $push: { 
          commentsList: newComment
        } as any,
        $inc: {
          comments: 1
        },
        $set: {
          updatedAt: new Date()
        }
      }
    )
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to add comment to post' 
        },
        { status: 500 }
      )
    }
    
    console.log(`✅ Comment added to post ${postId} by user ${userId}`)
    
    return NextResponse.json({
      success: true,
      comment: newComment,
      message: 'Comment added successfully'
    })
    
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add comment' 
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
    
    if (!postId || !platform) {
      return NextResponse.json(
        { 
          success: false,
          error: 'postId and platform are required' 
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
    
    // Find the post and return its comments
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
    
    return NextResponse.json({
      success: true,
      comments: post.commentsList || [],
      totalComments: post.comments || 0
    })
    
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch comments' 
      },
      { status: 500 }
    )
  }
}

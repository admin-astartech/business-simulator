import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      citizenId, 
      citizenName, 
      platform, 
      postId, 
      postContent, 
      engagementType, // 'like' or 'comment'
      engagementReason, 
      likedComment, 
      commentContent,
      commentId,
      timestamp 
    } = body
    
    if (!citizenId || !platform || !postId || !engagementType || !engagementReason) {
      return NextResponse.json(
        { 
          success: false,
          error: 'citizenId, platform, postId, engagementType, and engagementReason are required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const collection = db.collection('engagement-log')
    
    // Create the engagement log document
    const engagementData = {
      citizenId,
      citizenName,
      platform,
      postId,
      postContent: postContent ? postContent.substring(0, 500) : '', // Truncate for storage
      engagementType,
      engagementReason,
      likedComment: likedComment || null,
      commentContent: commentContent || null,
      commentId: commentId || null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Insert the engagement log into the database
    const result = await collection.insertOne(engagementData)
    
    console.log(`✅ Engagement logged to database: ${result.insertedId}`)
    
    return NextResponse.json({
      success: true,
      engagementId: result.insertedId,
      message: 'Engagement logged successfully'
    })
    
  } catch (error) {
    console.error('Error logging engagement:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to log engagement to database' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const engagementType = searchParams.get('engagementType')
    const postId = searchParams.get('postId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const db = await getDatabase()
    const collection = db.collection('engagement-log')
    
    // Build query filters
    const query: any = {}
    if (platform) query.platform = platform
    if (engagementType) query.engagementType = engagementType
    if (postId) query.postId = postId
    
    // Fetch engagement logs from MongoDB
    const engagements = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit)
      .toArray()
    
    // Get total count for pagination
    const totalCount = await collection.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      engagements,
      totalCount,
      hasMore: offset + limit < totalCount
    })
    
  } catch (error) {
    console.error('Error fetching engagement logs:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch engagement logs from database' 
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const engagementType = searchParams.get('engagementType')
    const timeRange = searchParams.get('timeRange') || '7d' // 7d, 30d, 90d, all
    
    const db = await getDatabase()
    const collection = db.collection('engagement-log')
    
    // Calculate date filter based on time range
    let dateFilter = {}
    if (timeRange !== 'all') {
      const now = new Date()
      let daysBack = 7
      
      switch (timeRange) {
        case '7d':
          daysBack = 7
          break
        case '30d':
          daysBack = 30
          break
        case '90d':
          daysBack = 90
          break
      }
      
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
      dateFilter = { timestamp: { $gte: startDate } }
    }
    
    // Build query filters
    const query: any = { ...dateFilter }
    if (platform) query.platform = platform
    if (engagementType) query.engagementType = engagementType
    
    // Get engagement analytics
    const [
      totalEngagements,
      platformBreakdown,
      engagementTypeBreakdown,
      topCitizens,
      topPosts,
      recentEngagements
    ] = await Promise.all([
      // Total engagements
      collection.countDocuments(query),
      
      // Platform breakdown
      collection.aggregate([
        { $match: query },
        { $group: { _id: '$platform', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray(),
      
      // Engagement type breakdown
      collection.aggregate([
        { $match: query },
        { $group: { _id: '$engagementType', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]).toArray(),
      
      // Top engaging citizens
      collection.aggregate([
        { $match: query },
        { $group: { 
          _id: { citizenId: '$citizenId', citizenName: '$citizenName' }, 
          count: { $sum: 1 },
          platforms: { $addToSet: '$platform' },
          engagementTypes: { $addToSet: '$engagementType' }
        } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray(),
      
      // Top engaged posts
      collection.aggregate([
        { $match: query },
        { $group: { 
          _id: { postId: '$postId', platform: '$platform' }, 
          count: { $sum: 1 },
          engagementTypes: { $addToSet: '$engagementType' },
          sampleContent: { $first: '$postContent' }
        } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]).toArray(),
      
      // Recent engagements
      collection.find(query)
        .sort({ timestamp: -1 })
        .limit(20)
        .toArray()
    ])
    
    // Calculate engagement trends (last 7 days)
    const trendData = await collection.aggregate([
      { 
        $match: { 
          ...query,
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        } 
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            platform: '$platform',
            engagementType: '$engagementType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]).toArray()
    
    return NextResponse.json({
      success: true,
      analytics: {
        summary: {
          totalEngagements,
          timeRange,
          platform: platform || 'all',
          engagementType: engagementType || 'all'
        },
        breakdowns: {
          platforms: platformBreakdown,
          engagementTypes: engagementTypeBreakdown
        },
        topPerformers: {
          citizens: topCitizens,
          posts: topPosts
        },
        trends: trendData,
        recentEngagements
      }
    })
    
  } catch (error) {
    console.error('Error fetching engagement analytics:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch engagement analytics' 
      },
      { status: 500 }
    )
  }
}

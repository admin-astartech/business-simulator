import { NextRequest, NextResponse } from 'next/server'
import { CitizenAnalytics, AnalyticsFilters } from '@/types/analytics'
import { Citizen } from '@/types/citizens'
import { ConversationService } from '@/lib/conversationService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters: AnalyticsFilters = {
      companies: searchParams.get('companies')?.split(',').filter(Boolean),
      roles: searchParams.get('roles')?.split(',').filter(Boolean),
    }

    // Fetch citizens data
    const citizensResponse = await fetch(`${request.nextUrl.origin}/api/citizens`)
    if (!citizensResponse.ok) {
      throw new Error('Failed to fetch citizens data')
    }
    const citizensData = await citizensResponse.json()
    const citizens: Citizen[] = citizensData.citizens || []

    // Apply filters
    let filteredCitizens = citizens
    if (filters.companies?.length) {
      filteredCitizens = filteredCitizens.filter(citizen => 
        filters.companies!.includes(citizen.company)
      )
    }
    if (filters.roles?.length) {
      filteredCitizens = filteredCitizens.filter(citizen => 
        filters.roles!.includes(citizen.role)
      )
    }

    // Calculate analytics
    const analytics = await calculateAnalytics(filteredCitizens)

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error calculating analytics:', error)
    return NextResponse.json(
      { error: 'Failed to calculate analytics' },
      { status: 500 }
    )
  }
}

async function calculateAnalytics(citizens: Citizen[]): Promise<CitizenAnalytics> {
  // Basic stats
  const totalCitizens = citizens.length
  const averageAge = citizens.reduce((sum, c) => sum + c.age, 0) / totalCitizens

  // Age distribution
  const ageRanges = [
    { min: 18, max: 25, label: '18-25' },
    { min: 26, max: 35, label: '26-35' },
    { min: 36, max: 45, label: '36-45' },
    { min: 46, max: 55, label: '46-55' },
    { min: 56, max: 65, label: '56-65' },
    { min: 66, max: 100, label: '66+' }
  ]

  const ageDistribution = ageRanges.map(range => {
    const count = citizens.filter(c => c.age >= range.min && c.age <= range.max).length
    return {
      ageRange: range.label,
      count,
      percentage: totalCitizens > 0 ? (count / totalCitizens) * 100 : 0
    }
  })

  // Role distribution
  const roleCounts = citizens.reduce((acc, citizen) => {
    acc[citizen.role] = (acc[citizen.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const roleDistribution = Object.entries(roleCounts).map(([role, count]) => ({
    role,
    count,
    percentage: totalCitizens > 0 ? (count / totalCitizens) * 100 : 0
  })).sort((a, b) => b.count - a.count)



  // Monetary value stats
  const monetaryValues = citizens.map(c => c.monetaryValue)
  const totalValue = monetaryValues.reduce((sum, val) => sum + val, 0)
  const sortedValues = [...monetaryValues].sort((a, b) => a - b)
  
  const monetaryValueStats = {
    total: totalValue,
    average: totalCitizens > 0 ? totalValue / totalCitizens : 0,
    median: sortedValues.length > 0 ? 
      (sortedValues.length % 2 === 0 ? 
        (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2 :
        sortedValues[Math.floor(sortedValues.length / 2)]) : 0,
    min: Math.min(...monetaryValues),
    max: Math.max(...monetaryValues)
  }

  // Top performers (by monetary value)
  const topPerformers = citizens
    .map(citizen => ({
      id: citizen.id,
      name: citizen.name,
      role: citizen.role,
      company: citizen.company,
      monetaryValue: citizen.monetaryValue,
      conversationCount: 0, // Will be updated with conversation data
      engagementScore: 0 // Will be calculated
    }))
    .sort((a, b) => b.monetaryValue - a.monetaryValue)
    .slice(0, 10)

  // Conversation stats (if MongoDB is available)
  let conversationStats = {
    totalConversations: 0,
    totalMessages: 0,
    averageMessagesPerConversation: 0,
    mostActiveCitizens: [] as any[],
    conversationTrends: [] as any[]
  }

  try {
    if (process.env.MONGODB_URI) {
      const allConversations = await ConversationService.getAllConversations()
      const conversationStatsData = await ConversationService.getConversationStats()
      
      conversationStats = {
        totalConversations: conversationStatsData.totalConversations,
        totalMessages: conversationStatsData.totalMessages,
        averageMessagesPerConversation: conversationStatsData.averageMessagesPerConversation,
        mostActiveCitizens: allConversations
          .map(conv => ({
            id: conv.citizenId,
            name: conv.citizenName,
            role: conv.citizenRole,
            conversationCount: 1,
            messageCount: conv.totalMessages,
            lastActive: conv.lastMessageAt
          }))
          .sort((a, b) => b.messageCount - a.messageCount)
          .slice(0, 10),
        conversationTrends: [] // Could be implemented with time-series data
      }

      // Update top performers with conversation data
      const conversationMap = new Map(
        allConversations.map(conv => [conv.citizenId, conv])
      )
      
      topPerformers.forEach(performer => {
        const conv = conversationMap.get(performer.id)
        if (conv) {
          performer.conversationCount = 1
          performer.engagementScore = conv.totalMessages
        }
      })
    }
  } catch (error) {
    console.error('Failed to load conversation stats:', error)
  }

  // Engagement metrics
  const engagementMetrics = {
    totalEngaged: conversationStats.mostActiveCitizens.length,
    engagementRate: totalCitizens > 0 ? (conversationStats.mostActiveCitizens.length / totalCitizens) * 100 : 0,
    averageResponseTime: 0, // Could be calculated from message timestamps
    mostEngagingTopics: [] // Could be analyzed from message content
  }

  return {
    totalCitizens,
    averageAge: Math.round(averageAge * 10) / 10,
    ageDistribution,
    roleDistribution,
    monetaryValueStats,
    topPerformers,
    conversationStats,
    engagementMetrics
  }
}


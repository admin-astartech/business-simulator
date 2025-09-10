export interface CitizenAnalytics {
  totalCitizens: number
  averageAge: number
  ageDistribution: AgeDistribution[]
  roleDistribution: RoleDistribution[]
  monetaryValueStats: MonetaryValueStats
  topPerformers: TopPerformer[]
  conversationStats: ConversationStats
  engagementMetrics: EngagementMetrics
}

export interface AgeDistribution {
  ageRange: string
  count: number
  percentage: number
}

export interface RoleDistribution {
  role: string
  count: number
  percentage: number
}

export interface MonetaryValueStats {
  total: number
  average: number
  median: number
  min: number
  max: number
}

export interface TopPerformer {
  id: string
  name: string
  role: string
  company: string
  monetaryValue: number
  conversationCount: number
  engagementScore: number
}

export interface ConversationStats {
  totalConversations: number
  totalMessages: number
  averageMessagesPerConversation: number
  mostActiveCitizens: ActiveCitizen[]
  conversationTrends: ConversationTrend[]
}

export interface ActiveCitizen {
  id: string
  name: string
  role: string
  conversationCount: number
  messageCount: number
  lastActive: string
}

export interface ConversationTrend {
  date: string
  conversations: number
  messages: number
}

export interface EngagementMetrics {
  totalEngaged: number
  engagementRate: number
  averageResponseTime: number
  mostEngagingTopics: TopicEngagement[]
}

export interface TopicEngagement {
  topic: string
  engagementScore: number
  conversationCount: number
}

export interface AnalyticsFilters {
  dateRange?: {
    start: string
    end: string
  }
  companies?: string[]
  roles?: string[]
  ageRange?: {
    min: number
    max: number
  }
  monetaryValueRange?: {
    min: number
    max: number
  }
}

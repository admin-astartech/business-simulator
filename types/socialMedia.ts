import { ReactNode } from 'react'

export interface Comment {
  id: string
  content: string
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface SocialPlatform {
  name: string
  icon: string | ReactNode
  followers: string
  engagement: string
  posts: number
}

export interface SocialPost {
  id: string | number
  content: string
  likes: number
  comments: number
  shares?: number
  time: string
  author?: string
  platform?: string
  // Only store citizen ID, fetch citizen data when needed
  citizenId?: string
  // Store hashtags array
  hashtags?: string[]
  // Track which users have liked this post
  likedBy?: string[]
  // Store comments array
  commentsList?: Comment[]
}

export interface PlatformPosts {
  linkedin: SocialPost[]
  tiktok: SocialPost[]
  instagram: SocialPost[]
}

export interface TabItem {
  id: string
  name: string
  icon: string | ReactNode
}

export interface LinkedInProfile {
  id: string
  name: string
  headline: string
  location: string
  connections: number
  followers: number
  experience: number
  skills: string[]
  url: string
  avatarColor: string
  initials: string
  isOnline?: boolean
  lastSeen?: string
  gender: 'male' | 'female'
}

export interface TikTokProfile {
  id: string
  name: string
  handle: string
  bio: string
  followers: number
  following: number
  totalLikes: number
  videoCount: number
  avgViews: number
  engagementRate: number
  topics: string[]
  contentStyle: string[]
  url: string
  avatarColor: string
  initials: string
  isOnline?: boolean
  lastSeen?: string
  gender: 'male' | 'female'
}

export interface InstagramProfile {
  id: string
  name: string
  handle: string
  bio: string
  followers: number
  following: number
  postsCount: number
  avgLikes: number
  avgComments: number
  engagementRate: number
  contentThemes: string[]
  storyCadence: string
  reelsSharePct: number
  hashtags: string[]
  highlights: string[]
  gridStyle: string
  verified: boolean
  url: string
  avatarColor: string
  initials: string
  isOnline?: boolean
  lastSeen?: string
  gender: 'male' | 'female'
}

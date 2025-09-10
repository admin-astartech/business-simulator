export interface CitizenPersonality {
  traits: string[],
  workStyle: string,
  socialStyle: string,
  motivation: string,
  stressTriggers: string[],
  riskTolerance: number,
  summary: string,
  category: string,
  ageBand: string
  interests: string[],
  likes: string[],
  dislikes: string[],
  values: string[],
  beliefs: string[],
  fears: string[],
  aspirations: string[],
  habits: string[],
  goals: string[],
  challenges: string[],
  strengths: string[],
  weaknesses: string[],
  preferences: string[],
  behaviors: string[],
  patterns: string[],
  triggers: string[],
  reactions: string[],
  responses: string[],
  motivations: string[],
  frustrations: string[],
}

export interface CitizenSocialMediaLinkedIn {
  url: string
  headline: string
  summary: string
  connections: number
  followers: number
  location: string
  currentRole: {
    title: string
    company: string
    startYear: number
  }
  skills: string[]
  endorsements: {
    skill: string
    count: number
  }[]
  openTo: string[]
  interests: string[]
  activityLevel: string
  recommendationsReceived: number
  education: string[]
  certifications: string[]
}

export interface CitizenSocialMediaTikTok {
  handle: string
  url: string
  bio: string
  followers: number
  following: number
  totalLikes: number
  videoCount: number
  avgViews: number
  avgLikes: number
  avgComments: number
  engagementRatePct: number
  postingCadence: string
  lastActive: string
  topics: string[]
  contentStyle: string[]
  musicPreferences: string[]
  hashtags: string[]
  openToCollabs: boolean
  linkInBio: string
  region: string
}

export interface CitizenSocialMediaInstagram {
  handle: string
  url: string
  bio: string
  followers: number
  following: number,
  postsCount: number,
  avgLikes: number,
  avgComments: number,
  engagementRatePct: number,
  lastActive: string,
  contentThemes: string[],
  storyCadence: string,
  reelsSharePct: number,
  hashtags: string[],
  highlights: string[],
  gridStyle: string,
  verified: boolean
  linkInBio: string
}

export interface CitizenSocialMedia {
  linkedIn: CitizenSocialMediaLinkedIn,
  tikTok: CitizenSocialMediaTikTok,
  instagram: CitizenSocialMediaInstagram
}

export interface Citizen {
  id: string
  name: string
  email: string
  role: string
  initials: string
  avatarColor: string
  monetaryValue: number
  age: number
  company: string
  personality: CitizenPersonality,
  socialMedia: CitizenSocialMedia
  isOnline?: boolean
  lastSeen?: string
  gender: 'male' | 'female'
}

export interface CitizenBankAccount extends Citizen {
  bankBalance: number
  accountType: 'checking' | 'savings' | 'business'
  lastTransaction: string
}

export interface CitizensData {
  totalCitizens: number
  citizens: Citizen[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  loading: boolean
  isRefreshing?: boolean
}

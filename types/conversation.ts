import { Citizen } from './citizens'

export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'citizen'
  timestamp: Date | string
  isNoResponse?: boolean
  isRead: boolean
  readAt?: Date | string
  isAutoResponse?: boolean
}

export interface Conversation {
  _id?: string
  citizenId: string
  citizenName: string
  citizenRole: string
  citizenCompany: string
  messages: ChatMessage[]
  createdAt: Date | string
  updatedAt: Date | string
  totalMessages: number
  lastMessageAt: Date | string
  isActive: boolean
}

export interface ConversationSummary {
  _id: string
  citizenId: string
  citizenName: string
  citizenGender: 'male' | 'female'
  citizenRole: string
  citizenCompany: string
  totalMessages: number
  lastMessageAt: Date | string
  preview: string // Last message preview
  isActive: boolean
  isOnline?: boolean
  lastSeen?: string
  hasUnreadCitizenMessage?: boolean
  unreadCitizenMessageCount?: number
}

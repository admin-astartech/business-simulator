export interface CronSchedule {
  name: string
  description: string
  schedule: string
  enabled: boolean
  lastRun?: string
  nextRun?: string
}

export interface AppSettings {
  id: string
  updatePercentage: number
  minCitizensToUpdate: number
  schedules: {
    statusUpdate: CronSchedule
    onlineDisplay: CronSchedule
    socialMediaPosts: CronSchedule
    citizenEngagement: CronSchedule
    citizenCommenting: CronSchedule
  }
  createdAt: string
  updatedAt: string
}

export interface SettingsApiResponse {
  success: boolean
  data?: AppSettings
  error?: string
}


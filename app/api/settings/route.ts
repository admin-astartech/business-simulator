import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { CRON_CONFIG } from '@/lib/services/BaseCronService'
import { AppSettings } from '@/types/settings'

// Default settings - used when no settings exist in database
const defaultSettings: AppSettings = {
  id: 'app-settings-001',
  updatePercentage: CRON_CONFIG.UPDATE_PERCENTAGE,
  minCitizensToUpdate: CRON_CONFIG.MIN_CITIZENS_TO_UPDATE,
  schedules: {
    statusUpdate: {
      name: 'Status Update',
      description: 'Updates citizen status and online presence',
      schedule: CRON_CONFIG.SCHEDULES.STATUS_UPDATE,
      enabled: true
    },
    onlineDisplay: {
      name: 'Online Display',
      description: 'Updates which citizens are currently online',
      schedule: CRON_CONFIG.SCHEDULES.ONLINE_DISPLAY,
      enabled: true
    },
    socialMediaPosts: {
      name: 'Social Media Posts',
      description: 'Generates and publishes social media content',
      schedule: CRON_CONFIG.SCHEDULES.SOCIAL_MEDIA_POSTS,
      enabled: true
    },
    citizenEngagement: {
      name: 'Citizen Engagement',
      description: 'Processes citizen interactions and engagement',
      schedule: CRON_CONFIG.SCHEDULES.CITIZEN_ENGAGEMENT,
      enabled: true
    },
    citizenCommenting: {
      name: 'Citizen Commenting',
      description: 'Handles citizen commenting on social media posts',
      schedule: CRON_CONFIG.SCHEDULES.CITIZEN_COMMENTING,
      enabled: true
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export async function GET() {
  try {
    const db = await getDatabase()
    const settings = db.collection('settings')
    
    // Try to find existing settings
    let appSettings = await settings.findOne({ id: 'app-settings-001' })
    
    // If no settings exist, create them with default data
    if (!appSettings) {
      console.log('No settings found in database, creating default settings...')
      const insertResult = await settings.insertOne(defaultSettings)
      appSettings = { ...defaultSettings, _id: insertResult.insertedId }
    }
    
    return NextResponse.json({
      success: true,
      data: appSettings
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    
    // Fallback to default settings if database fails
    console.log('Database error, using default settings...')
    return NextResponse.json({
      success: true,
      data: defaultSettings
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      updatePercentage, 
      minCitizensToUpdate, 
      schedules 
    } = body
    
    const db = await getDatabase()
    const settings = db.collection('settings')
    
    // Prepare update data
    const updateData = {
      updatePercentage: updatePercentage ?? defaultSettings.updatePercentage,
      minCitizensToUpdate: minCitizensToUpdate ?? defaultSettings.minCitizensToUpdate,
      schedules: schedules ?? defaultSettings.schedules,
      updatedAt: new Date().toISOString()
    }
    
    // Update or create settings
    const result = await settings.updateOne(
      { id: 'app-settings-001' },
      { 
        $set: updateData,
        $setOnInsert: {
          id: 'app-settings-001',
          createdAt: new Date().toISOString()
        }
      },
      { upsert: true }
    )
    
    // Fetch updated settings
    const updatedSettings = await settings.findOne({ id: 'app-settings-001' })
    
    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to update settings' 
      },
      { status: 500 }
    )
  }
}


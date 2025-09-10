'use client'

import { useState, useEffect } from 'react'
import { Settings, Clock, Activity, Users, MessageCircle, Smartphone, RefreshCw, Database, AlertCircle } from 'lucide-react'
import { useSettings } from '@/hooks/useSettings'
import { AppSettings, CronSchedule } from '@/types/settings'

interface ScheduleInfo {
  name: string
  description: string
  schedule: string
  humanReadable: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export default function SettingsPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { settings, loading, error, fetchSettings } = useSettings()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Convert cron expression to human readable format
  const parseCronExpression = (cronExpression: string): string => {
    const parts = cronExpression.split(' ')
    
    if (parts.length !== 5) {
      return 'Invalid cron expression'
    }

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

    // Handle every minute
    if (cronExpression === '* * * * *') {
      return 'Every minute'
    }

    // Handle interval patterns (e.g., */8 * * * *)
    if (minute.startsWith('*/')) {
      const interval = parseInt(minute.substring(2))
      if (interval === 1) {
        return 'Every minute'
      } else {
        return `Every ${interval} minutes`
      }
    }

    // Handle specific times
    if (minute !== '*' && hour !== '*') {
      const hour12 = parseInt(hour) > 12 ? parseInt(hour) - 12 : parseInt(hour)
      const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM'
      const minuteStr = minute === '0' ? '' : `:${minute.padStart(2, '0')}`
      return `Every day at ${hour12}${minuteStr} ${ampm}`
    }

    // Handle specific minutes
    if (minute !== '*' && hour === '*') {
      return `At minute ${minute} of every hour`
    }

    return cronExpression
  }

  // Convert database settings to display format
  const getScheduleInfo = (schedule: CronSchedule, icon: React.ComponentType<{ className?: string }>, color: string): ScheduleInfo => ({
    name: schedule.name,
    description: schedule.description,
    schedule: schedule.schedule,
    humanReadable: parseCronExpression(schedule.schedule),
    icon,
    color
  })

  // Define schedule information from database or fallback to defaults
  const schedules: ScheduleInfo[] = settings ? [
    getScheduleInfo(settings.schedules.statusUpdate, Activity, 'bg-blue-500'),
    getScheduleInfo(settings.schedules.onlineDisplay, Users, 'bg-green-500'),
    getScheduleInfo(settings.schedules.socialMediaPosts, Smartphone, 'bg-purple-500'),
    getScheduleInfo(settings.schedules.citizenEngagement, MessageCircle, 'bg-orange-500'),
    getScheduleInfo(settings.schedules.citizenCommenting, MessageCircle, 'bg-red-500')
  ] : []

  // Show loading state
  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-semibold text-red-900">Error Loading Settings</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchSettings}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your application configuration and schedules</p>
          </div>
        </div>
        
        {/* Data Source Indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700">
            Settings loaded from database
            {settings?.updatedAt && (
              <span className="ml-2 text-green-600">
                (Last updated: {new Date(settings.updatedAt).toLocaleString()})
              </span>
            )}
          </span>
        </div>
        
        {/* Current Time Display */}
        <div className="bg-gray-100 rounded-lg p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">Current Time:</span>
          <span className="font-mono text-lg font-semibold text-gray-900">
            {currentTime.toLocaleString()}
          </span>
        </div>
      </div>

      {/* CRON Schedules Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="w-6 h-6 text-gray-700" />
          <h2 className="text-2xl font-semibold text-gray-900">CRON Schedules</h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule, index) => {
            const IconComponent = schedule.icon
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${schedule.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {schedule.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {schedule.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Schedule
                        </span>
                        <p className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded mt-1">
                          {schedule.schedule}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Human Readable
                        </span>
                        <p className="text-sm text-gray-900 font-medium mt-1">
                          {schedule.humanReadable}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Configuration Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Configuration Details</h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Update Percentage
            </span>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {settings ? (settings.updatePercentage * 100).toFixed(0) : '30'}%
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Percentage of citizens to update in each cycle
            </p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Minimum Citizens
            </span>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {settings?.minCitizensToUpdate || 5}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Minimum number of citizens to update per cycle
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded">
            <Settings className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              About CRON Schedules
            </h4>
            <p className="text-sm text-blue-700">
              These schedules control automated tasks in your Earth Simulator. 
              All times are based on your server's timezone. Schedules run continuously 
              in the background to keep your simulation active and engaging.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

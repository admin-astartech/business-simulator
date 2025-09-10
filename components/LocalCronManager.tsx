'use client'

import { useEffect, useState } from 'react'

interface CronJobStatus {
  isRunning: boolean
  totalJobs: number
  jobStatus: { [key: string]: boolean }
  schedules: { [key: string]: string }
}

export default function LocalCronManager() {
  const [status, setStatus] = useState<CronJobStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Update status from API
  const updateStatus = async () => {
    try {
      const response = await fetch('/api/local-cron')
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data)
      } else {
        console.error('Failed to get cron status:', result.error)
      }
    } catch (error) {
      console.error('Error fetching cron status:', error)
    }
  }

  // Make API call to manage cron service
  const makeApiCall = async (action: string) => {
    try {
      const response = await fetch('/api/local-cron', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data)
        return true
      } else {
        console.error(`Failed to ${action} cron service:`, result.error)
        return false
      }
    } catch (error) {
      console.error(`Error ${action}ing cron service:`, error)
      return false
    }
  }

  // Manual refresh function
  const handleRefresh = async () => {
    await updateStatus()
  }

  // Start cron service
  const handleStart = async () => {
    await makeApiCall('start')
  }

  // Stop cron service
  const handleStop = async () => {
    await makeApiCall('stop')
  }

  // Restart cron service
  const handleRestart = async () => {
    await makeApiCall('restart')
  }

  // Run all tasks immediately
  const handleRunNow = async () => {
    setIsLoading(true)
    try {
      await makeApiCall('runNow')
    } finally {
      setIsLoading(false)
    }
  }

  // Update status on mount only
  useEffect(() => {
    updateStatus()
  }, [])

  // Keyboard shortcut to toggle minimize (Ctrl/Cmd + M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'm') {
        event.preventDefault()
        setIsMinimized(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (!status) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
          Loading cron status...
        </div>
      </div>
    )
  }

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 hover:shadow-xl transition-shadow">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              status.isRunning ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">Cron</span>
            <button
              onClick={() => setIsMinimized(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Expand cron manager (Ctrl/Cmd + M)"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-1 text-center">
            {status.isRunning ? `${status.totalJobs} jobs running` : 'Stopped'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-800">Local Cron Manager</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Refresh status"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className={`w-2 h-2 rounded-full ${
              status.isRunning ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Minimize cron manager (Ctrl/Cmd + M)"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Status</div>
          <div className="text-sm">
            {status.isRunning ? (
              <span className="text-green-600">Running ({status.totalJobs} jobs)</span>
            ) : (
              <span className="text-red-600">Stopped</span>
            )}
          </div>
        </div>

        {/* Job Status */}
        {status.isRunning && (
          <div className="mb-3">
            <div className="text-xs text-gray-600 mb-1">Active Jobs</div>
            <div className="space-y-1">
              {Object.entries(status.jobStatus).map(([jobName, isActive]) => (
                <div key={jobName} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{jobName.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-2">
          <div className="flex space-x-2">
            {!status.isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition-colors"
              >
                Start
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition-colors"
              >
                Stop
              </button>
            )}
            
            <button
              onClick={handleRestart}
              className="flex-1 bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Restart
            </button>
          </div>

          <button
            onClick={handleRunNow}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white text-xs px-3 py-1 rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Running...' : 'Run Now'}
          </button>
        </div>

        {/* Schedules Info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <div>Status Updates: Every 5 min</div>
            <div>Social Posts: Every 10 min</div>
            <div>Engagement: Every 5 min</div>
          </div>
        </div>
      </div>
    </div>
  )
}

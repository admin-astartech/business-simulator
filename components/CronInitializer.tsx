'use client'

import { useEffect, useState } from 'react'

export default function CronInitializer() {
  const [cronStatus, setCronStatus] = useState<'initializing' | 'running' | 'error' | 'external' | 'local'>('initializing')

  useEffect(() => {
    // Initialize cron service and run initial tasks
    const initializeCronService = async () => {
      try {
        console.log('🚀 Initializing cron service...')
        
        // Check if we're in a serverless environment (Vercel)
        const isServerless = process.env.NODE_ENV === 'production'
        
        if (isServerless) {
          // In production, assume external cron is handling the scheduling
          console.log('✅ External cron mode - tasks will be handled by external cron service')
          setCronStatus('external')
          
          // Optionally run tasks once on initialization
          try {
            const response = await fetch('/api/cron-trigger', {
              method: 'GET',
            })
            
            const result = await response.json()
            
            if (result.success) {
              console.log('✅ Initial cron tasks executed successfully')
              console.log('📊 Task results:', result.results)
            } else {
              console.warn('⚠️ Initial cron tasks failed:', result.error)
            }
          } catch (error) {
            console.warn('⚠️ Failed to run initial cron tasks:', error)
          }
        } else {
          // In development, start local cron service via API
          try {
            const response = await fetch('/api/local-cron', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ action: 'start' }),
            })
            
            const result = await response.json()
            
            if (result.success) {
              console.log('✅ Local cron service started successfully')
              setCronStatus('local')
            } else {
              console.error('❌ Failed to start local cron service:', result.error)
              setCronStatus('error')
            }
          } catch (error) {
            console.error('❌ Error starting local cron service:', error)
            setCronStatus('error')
          }
        }
      } catch (error) {
        console.error('❌ Error initializing cron service:', error)
        setCronStatus('error')
      }
    }

    initializeCronService()

    // Cleanup function
    return () => {
      // In development, stop local cron service on unmount
      if (process.env.NODE_ENV === 'development') {
        try {
          fetch('/api/local-cron', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'stop' }),
          }).catch(() => {
            // Ignore errors during cleanup
          })
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [])

  // Show cron status in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          cronStatus === 'running' ? 'bg-green-100 text-green-800' :
          cronStatus === 'local' ? 'bg-blue-100 text-blue-800' :
          cronStatus === 'external' ? 'bg-purple-100 text-purple-800' :
          cronStatus === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          Cron: {cronStatus}
        </div>
      </div>
    )
  }

  return null // This component doesn't render anything in production
}

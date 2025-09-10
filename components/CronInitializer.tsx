'use client'

import { useEffect } from 'react'

export default function CronInitializer() {
  useEffect(() => {
    // Start the cron job when the component mounts
    const startCronJob = async () => {
      try {
        const response = await fetch('/api/cron', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'start' }),
        })
        
        const result = await response.json()
        
        if (result.success) {
          console.log('Cron job started successfully')
        } else {
          console.error('Failed to start cron job:', result.error)
        }
      } catch (error) {
        console.error('Error starting cron job:', error)
      }
    }

    startCronJob()

    // Cleanup function to stop cron job when component unmounts
    return () => {
      const stopCronJob = async () => {
        try {
          await fetch('/api/cron', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'stop' }),
          })
        } catch (error) {
          console.error('Error stopping cron job:', error)
        }
      }
      
      stopCronJob()
    }
  }, [])

  return null // This component doesn't render anything
}

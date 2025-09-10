'use client'

import { useEffect } from 'react'
import AutoResponseNotificationService from '@/lib/autoResponseNotificationService'

export default function AutoResponseNotificationInitializer() {
  useEffect(() => {
    // Start the auto-response notification service when the component mounts
    const startService = () => {
      try {
        const service = AutoResponseNotificationService.getInstance()
        service.start()
        console.log('✅ Auto-response notification service initialized')
      } catch (error) {
        console.error('❌ Error initializing auto-response notification service:', error)
      }
    }

    // Start the service
    startService()

    // Cleanup function to stop the service when component unmounts
    return () => {
      try {
        const service = AutoResponseNotificationService.getInstance()
        service.stop()
        console.log('✅ Auto-response notification service stopped')
      } catch (error) {
        console.error('❌ Error stopping auto-response notification service:', error)
      }
    }
  }, [])

  return null // This component doesn't render anything
}

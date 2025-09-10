/**
 * Service for managing browser notifications
 * Handles permission requests and notification display
 */
class NotificationService {
  private static instance: NotificationService
  private permissionGranted = false

  private constructor() {
    this.checkPermission()
  }

  /**
   * Get the singleton instance of NotificationService
   * @returns The NotificationService instance
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Check if notifications are supported by the browser
   * @returns boolean True if notifications are supported
   */
  public isSupported(): boolean {
    return 'Notification' in window
  }

  /**
   * Check the current notification permission status
   * @returns string The current permission status
   */
  public getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied'
    }
    return Notification.permission
  }

  /**
   * Check if permission is already granted
   * @returns boolean True if permission is granted
   */
  public hasPermission(): boolean {
    return this.permissionGranted
  }

  /**
   * Request notification permission from the user
   * @returns Promise<boolean> True if permission was granted
   */
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications are not supported in this browser')
      return false
    }

    if (this.permissionGranted) {
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      this.permissionGranted = permission === 'granted'
      
      if (this.permissionGranted) {
        console.log('✅ Notification permission granted')
      } else {
        console.log('❌ Notification permission denied')
      }
      
      return this.permissionGranted
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return false
    }
  }

  /**
   * Show a notification for a citizen auto-response
   * @param citizenName The name of the citizen who responded
   * @param citizenRole The role of the citizen
   * @param citizenCompany The company of the citizen
   * @param message The auto-response message
   * @param citizenId The ID of the citizen (for potential click handling)
   */
  public showAutoResponseNotification(
    citizenName: string,
    citizenRole: string,
    citizenCompany: string,
    message: string,
    citizenId: string
  ): void {
    if (!this.permissionGranted) {
      console.warn('Cannot show notification: permission not granted')
      return
    }

    if (!this.isSupported()) {
      console.warn('Cannot show notification: not supported')
      return
    }

    try {
      // Truncate message for notification (first 100 characters)
      const truncatedMessage = message.length > 100 
        ? message.substring(0, 100) + '...' 
        : message

      const notification = new Notification(
        `${citizenName} responded`, 
        {
          body: `${citizenRole} at ${citizenCompany}: ${truncatedMessage}`,
          icon: '/favicon.ico', // Use the app's favicon
          badge: '/favicon.ico',
          tag: `auto-response-${citizenId}`, // Prevent duplicate notifications
          requireInteraction: false, // Auto-dismiss after a few seconds
          silent: false, // Allow sound
          data: {
            citizenId,
            citizenName,
            type: 'auto-response'
          }
        }
      )

      // Handle notification click
      notification.onclick = () => {
        // Focus the window and potentially navigate to the citizen
        window.focus()
        
        // Dispatch a custom event to handle navigation
        window.dispatchEvent(new CustomEvent('notificationClicked', {
          detail: {
            citizenId,
            citizenName,
            type: 'auto-response'
          }
        }))
        
        notification.close()
      }

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close()
      }, 5000)

      console.log(`📱 Notification sent for ${citizenName}'s auto-response`)
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  /**
   * Show a general notification
   * @param title The notification title
   * @param body The notification body
   * @param options Additional notification options
   */
  public showNotification(
    title: string, 
    body: string, 
    options?: NotificationOptions
  ): void {
    if (!this.permissionGranted) {
      console.warn('Cannot show notification: permission not granted')
      return
    }

    if (!this.isSupported()) {
      console.warn('Cannot show notification: not supported')
      return
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        ...options
      })

      // Auto-close after 5 seconds if not specified
      if (!options?.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, 5000)
      }

      console.log(`📱 Notification sent: ${title}`)
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  /**
   * Check permission status on initialization
   */
  private checkPermission(): void {
    if (this.isSupported()) {
      this.permissionGranted = Notification.permission === 'granted'
    }
  }
}

export default NotificationService

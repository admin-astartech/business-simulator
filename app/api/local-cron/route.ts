import { NextRequest, NextResponse } from 'next/server'
import LocalCronService from '../../../lib/localCronService'

/**
 * Local cron API endpoint for development
 * This runs the local cron service on the server side
 */
export async function GET() {
  try {
    const cronService = LocalCronService.getInstance()
    const serviceInfo = cronService.getServiceInfo()
    
    return NextResponse.json({
      success: true,
      data: serviceInfo,
      message: 'Local cron service status retrieved',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error getting local cron status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get local cron status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    const cronService = LocalCronService.getInstance()
    
    switch (action) {
      case 'start':
        console.log('🚀 Starting local cron service via API...')
        cronService.start()
        return NextResponse.json({
          success: true,
          message: 'Local cron service started',
          data: cronService.getServiceInfo(),
          timestamp: new Date().toISOString()
        })
      
      case 'stop':
        console.log('🛑 Stopping local cron service via API...')
        cronService.stop()
        return NextResponse.json({
          success: true,
          message: 'Local cron service stopped',
          data: cronService.getServiceInfo(),
          timestamp: new Date().toISOString()
        })
      
      case 'restart':
        console.log('🔄 Restarting local cron service via API...')
        cronService.restart()
        return NextResponse.json({
          success: true,
          message: 'Local cron service restarted',
          data: cronService.getServiceInfo(),
          timestamp: new Date().toISOString()
        })
      
      case 'runNow':
        console.log('⚡ Running all tasks immediately via API...')
        await cronService.runAllTasksNow()
        return NextResponse.json({
          success: true,
          message: 'All tasks executed immediately',
          data: cronService.getServiceInfo(),
          timestamp: new Date().toISOString()
        })
      
      case 'status':
        return NextResponse.json({
          success: true,
          message: 'Local cron service status retrieved',
          data: cronService.getServiceInfo(),
          timestamp: new Date().toISOString()
        })
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use "start", "stop", "restart", "runNow", or "status"' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error managing local cron service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to manage local cron service',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

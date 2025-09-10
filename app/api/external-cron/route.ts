import { NextRequest, NextResponse } from 'next/server'
import VercelCronService from '../../../lib/vercelCronService'

/**
 * External cron endpoint for use with external cron services
 * This endpoint is designed to be called by external cron services like:
 * - Uptime Robot
 * - Cron-job.org
 * - EasyCron
 * - GitHub Actions
 * - Your own server's cron
 */
export async function GET() {
  try {
    const cronService = VercelCronService.getInstance()
    const status = cronService.getStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        isRunning: status.isRunning,
        environment: status.environment,
        message: 'External cron service is ready',
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error checking external cron status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check external cron status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { action, taskName, auth } = body
    
    // Optional: Add basic authentication for security
    const expectedAuth = process.env.CRON_AUTH_TOKEN
    if (expectedAuth && auth !== expectedAuth) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const cronService = VercelCronService.getInstance()
    
    switch (action) {
      case 'runAll':
        console.log('🚀 External cron triggered - running all tasks...')
        const allResults = await cronService.runAllTasks()
        return NextResponse.json({
          success: allResults.success,
          message: 'All external cron tasks executed',
          results: allResults.results,
          timestamp: new Date().toISOString()
        })
      
      case 'runTask':
        if (!taskName) {
          return NextResponse.json(
            { success: false, error: 'Task name is required for runTask action' },
            { status: 400 }
          )
        }
        console.log(`🚀 External cron triggered - running task: ${taskName}`)
        const taskResult = await cronService.runTask(taskName)
        return NextResponse.json({
          success: taskResult.success,
          message: taskResult.success ? 'Task executed successfully' : 'Task execution failed',
          result: taskResult.result,
          error: taskResult.error,
          timestamp: new Date().toISOString()
        })
      
      case 'status':
        const status = cronService.getStatus()
        return NextResponse.json({
          success: true,
          data: status,
          message: 'External cron service status retrieved',
          timestamp: new Date().toISOString()
        })
      
      default:
        // Default action is to run all tasks (for simple cron setups)
        console.log('🚀 External cron triggered (default) - running all tasks...')
        const defaultResults = await cronService.runAllTasks()
        return NextResponse.json({
          success: defaultResults.success,
          message: 'External cron tasks executed (default action)',
          results: defaultResults.results,
          timestamp: new Date().toISOString()
        })
    }
  } catch (error) {
    console.error('Error in external cron service:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to execute external cron tasks',
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

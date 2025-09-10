import { NextRequest, NextResponse } from 'next/server'
import VercelCronService from '../../../lib/vercelCronService'

export async function GET() {
  try {
    const cronService = VercelCronService.getInstance()
    const status = cronService.getStatus()
    
    return NextResponse.json({
      success: true,
      data: {
        isRunning: status.isRunning,
        environment: status.environment,
        message: 'Vercel cron service is ready'
      }
    })
  } catch (error) {
    console.error('Error checking cron status:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check cron status' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, taskName } = body
    
    const cronService = VercelCronService.getInstance()
    
    switch (action) {
      case 'runAll':
        const allResults = await cronService.runAllTasks()
        return NextResponse.json({
          success: allResults.success,
          message: 'All cron tasks executed',
          results: allResults.results
        })
      
      case 'runTask':
        if (!taskName) {
          return NextResponse.json(
            { success: false, error: 'Task name is required for runTask action' },
            { status: 400 }
          )
        }
        const taskResult = await cronService.runTask(taskName)
        return NextResponse.json({
          success: taskResult.success,
          message: taskResult.success ? 'Task executed successfully' : 'Task execution failed',
          result: taskResult.result,
          error: taskResult.error
        })
      
      case 'status':
        const status = cronService.getStatus()
        return NextResponse.json({
          success: true,
          data: status,
          message: 'Service status retrieved'
        })
      
      case 'start':
        // For compatibility with CronInitializer - just run all tasks
        const startResults = await cronService.runAllTasks()
        return NextResponse.json({
          success: startResults.success,
          message: 'Cron service started and tasks executed',
          results: startResults.results
        })
      
      case 'stop':
        // For compatibility with CronInitializer - just return success
        return NextResponse.json({
          success: true,
          message: 'Cron service stopped (serverless mode)'
        })
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action. Use "runAll", "runTask", "status", "start", or "stop"' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error managing cron service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to manage cron service' },
      { status: 500 }
    )
  }
}

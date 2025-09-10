import { NextResponse } from 'next/server'
import VercelCronService from '../../../lib/vercelCronService'

/**
 * Simple GET endpoint for external cron services that only support GET requests
 * This is a simplified endpoint for services like Uptime Robot, Cron-job.org, etc.
 */
export async function GET() {
  try {
    console.log('🚀 External cron triggered via GET - running all tasks...')
    
    const cronService = VercelCronService.getInstance()
    const results = await cronService.runAllTasks()
    
    const response = {
      success: results.success,
      message: 'External cron tasks executed via GET',
      results: results.results,
      timestamp: new Date().toISOString(),
      executedTasks: results.results?.filter(r => !r.skipped).length || 0,
      skippedTasks: results.results?.filter(r => r.skipped).length || 0
    }
    
    console.log('✅ External cron completed:', response)
    
    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Error in external cron GET endpoint:', error)
    
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

import { NextRequest, NextResponse } from 'next/server'
import CronService from '@/lib/cronService'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing citizen commenting functionality...')
    
    // Get the cron service instance
    const cronService = CronService.getInstance()
    
    // Test the citizen commenting functionality
    await cronService.testCitizenCommenting()
    
    return NextResponse.json({
      success: true,
      message: 'Citizen commenting test completed successfully'
    })
    
  } catch (error) {
    console.error('❌ Error testing citizen commenting:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test citizen commenting functionality' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Citizen commenting test endpoint is available. Use POST to run the test.',
    endpoints: {
      test: 'POST /api/test-citizen-commenting',
      description: 'Tests the citizen commenting simulation functionality'
    }
  })
}

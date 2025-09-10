import { NextRequest, NextResponse } from 'next/server'
import CronService from '@/lib/cronService'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing citizen engagement functionality...')
    
    // Get the cron service instance
    const cronService = CronService.getInstance()
    
    // Test the citizen engagement functionality
    await cronService.testCitizenEngagement()
    
    return NextResponse.json({
      success: true,
      message: 'Citizen engagement test completed successfully'
    })
    
  } catch (error) {
    console.error('❌ Error testing citizen engagement:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test citizen engagement functionality' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Citizen engagement test endpoint is available. Use POST to run the test.',
    endpoints: {
      test: 'POST /api/test-citizen-engagement',
      description: 'Tests the citizen engagement simulation functionality'
    }
  })
}

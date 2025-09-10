import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/mongodb'
import { citizensData } from '@/data/citizens'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const citizenId = (await params).id
    
    if (!citizenId) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Citizen ID is required' 
        },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Try to find citizen in database first
    const citizen = await citizens.findOne({ id: citizenId })
    
    if (citizen) {
      return NextResponse.json({
        success: true,
        citizen
      })
    }
    
    // If not found in database, check static data
    const staticCitizen = citizensData.find(c => c.id === citizenId)
    
    if (staticCitizen) {
      return NextResponse.json({
        success: true,
        citizen: {
          ...staticCitizen,
          isOnline: false, // Default to offline for static data
          lastSeen: new Date().toISOString()
        }
      })
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Citizen not found' 
      },
      { status: 404 }
    )
    
  } catch (error) {
    console.error('Error fetching citizen by ID:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch citizen' 
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/mongodb'

export async function GET() {
  try {
    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Get all online citizens
    const onlineCitizens = await citizens.find({ isOnline: true }).toArray()
    
    return NextResponse.json({
      success: true,
      count: onlineCitizens.length,
      citizens: onlineCitizens
    })

  } catch (error) {
    console.error('Error fetching online citizens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch online citizens' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { citizenIds } = await request.json()
    
    if (!citizenIds || !Array.isArray(citizenIds) || citizenIds.length === 0) {
      return NextResponse.json(
        { error: 'citizenIds array is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Update the online status for the specified citizen IDs
    const result = await citizens.updateMany(
      { id: { $in: citizenIds } },
      { 
        $set: { 
          isOnline: true,
          lastSeen: new Date().toISOString()
        } 
      }
    )

    console.log(`Updated ${result.modifiedCount} citizens to online status`)

    // Note: We can't dispatch browser events from server-side API routes
    // The cron service will handle event dispatching for automated updates
    // Manual updates will be reflected on the next auto-refresh cycle

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      message: `Successfully updated ${result.modifiedCount} citizens to online status`
    })

  } catch (error) {
    console.error('Error updating citizen online status:', error)
    return NextResponse.json(
      { error: 'Failed to update citizen online status' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { citizenIds, isOnline } = await request.json()
    
    if (!citizenIds || !Array.isArray(citizenIds) || citizenIds.length === 0) {
      return NextResponse.json(
        { error: 'citizenIds array is required' },
        { status: 400 }
      )
    }

    if (typeof isOnline !== 'boolean') {
      return NextResponse.json(
        { error: 'isOnline must be a boolean value' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Update the online status for the specified citizen IDs
    const updateData: any = { isOnline }
    
    // Only update lastSeen when citizen comes online
    if (isOnline) {
      updateData.lastSeen = new Date().toISOString()
    }
    
    const result = await citizens.updateMany(
      { id: { $in: citizenIds } },
      { $set: updateData }
    )

    console.log(`Updated ${result.modifiedCount} citizens to ${isOnline ? 'online' : 'offline'} status`)

    // Note: We can't dispatch browser events from server-side API routes
    // The cron service will handle event dispatching for automated updates
    // Manual updates will be reflected on the next auto-refresh cycle

    return NextResponse.json({
      success: true,
      updatedCount: result.modifiedCount,
      message: `Successfully updated ${result.modifiedCount} citizens to ${isOnline ? 'online' : 'offline'}`
    })

  } catch (error) {
    console.error('Error updating citizen online status:', error)
    return NextResponse.json(
      { error: 'Failed to update citizen online status' },
      { status: 500 }
    )
  }
}
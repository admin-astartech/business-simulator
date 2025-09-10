import { NextResponse } from 'next/server'
import { getDatabase } from '../../../../lib/mongodb'
import { citizensData } from '../../../../data/citizens'
import { Citizen } from '../../../../types/citizens'

export async function POST() {
  try {
    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Add online status and lastSeen fields to each citizen
    const citizensWithOnlineStatus: Citizen[] = citizensData.map(citizen => ({
      ...citizen,
      isOnline: Math.random() > 0.7, // 30% chance of being online
      lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString() // Random time in last 24 hours
    }))
    
    // Clear existing citizens collection
    await citizens.deleteMany({})
    console.log('Cleared existing citizens collection')
    
    // Insert citizens with online status
    const result = await citizens.insertMany(citizensWithOnlineStatus)
    console.log(`Inserted ${result.insertedCount} citizens with online status`)
    
    // Count online citizens
    const onlineCount = await citizens.countDocuments({ isOnline: true })
    
    return NextResponse.json({
      success: true,
      message: 'Citizens populated successfully',
      data: {
        totalCitizens: result.insertedCount,
        onlineCitizens: onlineCount,
        offlineCitizens: result.insertedCount - onlineCount
      }
    })
  } catch (error) {
    console.error('Error populating citizens:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to populate citizens' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/mongodb'
import { citizensData } from '@/data/citizens'

export async function GET() {
  try {
    const db = await getDatabase()
    const citizens = db.collection('citizens')
    
    // Check if citizens collection exists and has data
    const count = await citizens.countDocuments()
    
    if (count === 0) {
      // If no data in database, populate it with static data
      console.log('No citizens in database, populating with static data...')
      
      // Add online status to static data
      const citizensWithOnlineStatus = citizensData.map(citizen => ({
        ...citizen,
        isOnline: Math.random() > 0.7, // 30% chance of being online
        lastSeen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      }))
      
      await citizens.insertMany(citizensWithOnlineStatus)
      console.log(`Populated database with ${citizensWithOnlineStatus.length} citizens`)
    }
    
    // Fetch all citizens from database
    const allCitizens = await citizens.find({}).toArray()
    const totalCitizens = allCitizens.length
    
    return NextResponse.json({
      success: true,
      totalCitizens,
      citizens: allCitizens
    })
  } catch (error) {
    console.error('Error fetching citizens:', error)
    
    // Fallback to static data if database fails
    console.log('Database error, falling back to static data...')
    const totalCitizens = citizensData.length
    
    return NextResponse.json({
      success: true,
      totalCitizens,
      citizens: citizensData.map(citizen => ({
        ...citizen,
        isOnline: false, // Default to offline for static data
        lastSeen: new Date().toISOString()
      }))
    })
  }
}

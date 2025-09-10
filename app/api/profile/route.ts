import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '../../../lib/mongodb'

// Default profile data - used when no profile exists in database
const defaultProfile = {
  id: 'user-001',
  name: 'User Name',
  email: 'user@example.com',
  role: 'Business Analyst',
  age: 30,
  department: 'Analytics',
  location: 'New York, NY',
  phone: '+1 (555) 000-0000',
  bio: 'Business analyst focused on data-driven decision making and strategic planning.',
  avatarColor: 'bg-blue-500',
  initials: 'UN',
  xp: 0
}

export async function GET() {
  try {
    const db = await getDatabase()
    const profiles = db.collection('profiles')
    
    // Try to find existing profile
    let profile = await profiles.findOne({ id: 'user-001' })
    
    // If no profile exists, create one with default data
    if (!profile) {
      const insertResult = await profiles.insertOne(defaultProfile)
      profile = { ...defaultProfile, _id: insertResult.insertedId }
    }
    
    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, email, role, age, department, location, phone, bio, avatarColor, xp } = body
    
    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const profiles = db.collection('profiles')
    
    // Get current profile to preserve existing values
    const currentProfile = await profiles.findOne({ id: 'user-001' })
    
    // Prepare updated profile data
    const updatedProfile = {
      id: 'user-001',
      name,
      email,
      role,
      age: parseInt(age) || currentProfile?.age || 30,
      department: department || currentProfile?.department || 'Analytics',
      location: location || currentProfile?.location || 'New York, NY',
      phone: phone || currentProfile?.phone || '+1 (555) 000-0000',
      bio: bio || currentProfile?.bio || 'Business analyst focused on data-driven decision making and strategic planning.',
      avatarColor: avatarColor || currentProfile?.avatarColor || 'bg-blue-500',
      // Update initials based on new name
      initials: name ? name.trim().split(' ').map((part: string) => part[0]).join('').toUpperCase().slice(0, 2) : currentProfile?.initials || 'UN',
      // Handle XP - preserve existing value if not provided, or use provided value
      xp: xp !== undefined ? parseInt(xp) || 0 : currentProfile?.xp || 0
    }
    
    // Update or insert the profile
    const result = await profiles.replaceOne(
      { id: 'user-001' },
      updatedProfile,
      { upsert: true }
    )
    
    if (result.acknowledged) {
      return NextResponse.json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      })
    } else {
      throw new Error('Failed to update profile in database')
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

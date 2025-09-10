const { MongoClient } = require('mongodb')

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DATABASE_NAME = process.env.MONGODB_DATABASE || 'business-simulator'

async function populateCitizens() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(DATABASE_NAME)
    const citizens = db.collection('citizens')
    
    // Import the citizens data
    const { citizensData } = require('../data/citizens.ts')
    
    // Add online status and lastSeen fields to each citizen
    const citizensWithOnlineStatus = citizensData.map(citizen => ({
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
    console.log(`Total online citizens: ${onlineCount}`)
    
  } catch (error) {
    console.error('Error populating citizens:', error)
  } finally {
    await client.close()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
populateCitizens()

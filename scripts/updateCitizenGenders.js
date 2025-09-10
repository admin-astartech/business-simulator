const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'business-simulator';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('Please create a .env.local file with your MongoDB URI:');
  console.error('MONGODB_URI=mongodb+srv://helenfagbemi:Passes12@cluster0.znzzx.mongodb.net/?retryWrites=true&w=majority&appName=cluster0');
  console.error('MONGODB_DATABASE=business-simulator');
  process.exit(1);
}

async function updateCitizenGenders() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db(MONGODB_DATABASE);
    const citizensCollection = db.collection('citizens');
    
    console.log('📊 Fetching all citizens...');
    const citizens = await citizensCollection.find({}).toArray();
    console.log(`Found ${citizens.length} citizens in database`);
    
    if (citizens.length === 0) {
      console.log('⚠️  No citizens found in database. Please populate the database first.');
      return;
    }
    
    // Randomly assign genders
    const genders = ['male', 'female'];
    const updates = [];
    
    for (const citizen of citizens) {
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      updates.push({
        updateOne: {
          filter: { _id: citizen._id },
          update: { $set: { gender: randomGender } }
        }
      });
    }
    
    console.log('🔄 Updating citizen genders...');
    const result = await citizensCollection.bulkWrite(updates);
    
    console.log('✅ Update completed!');
    console.log(`📈 Modified ${result.modifiedCount} citizens`);
    
    // Show gender distribution
    const genderStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    console.log('\n📊 Gender Distribution:');
    genderStats.forEach(stat => {
      const percentage = ((stat.count / citizens.length) * 100).toFixed(1);
      console.log(`   ${stat._id || 'unknown'}: ${stat.count} (${percentage}%)`);
    });
    
  } catch (error) {
    console.error('❌ Error updating citizen genders:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the script
updateCitizenGenders();

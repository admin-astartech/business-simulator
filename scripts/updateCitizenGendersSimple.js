const { MongoClient } = require('mongodb');

// MongoDB connection - you can set these as environment variables or replace with your actual values
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'business-simulator';

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('Please set your MongoDB URI as an environment variable:');
  console.error('export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"');
  console.error('export MONGODB_DATABASE="business-simulator"');
  console.error('');
  console.error('Or run the script with:');
  console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" node scripts/updateCitizenGendersSimple.js');
  process.exit(1);
}

async function updateCitizenGenders() {
  let client;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 Database: ${MONGODB_DATABASE}`);
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
    
    console.log('🎲 Randomly assigning genders...');
    for (const citizen of citizens) {
      const randomGender = genders[Math.floor(Math.random() * genders.length)];
      updates.push({
        updateOne: {
          filter: { _id: citizen._id },
          update: { $set: { gender: randomGender } }
        }
      });
    }
    
    console.log('🔄 Updating citizen genders in database...');
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
      const emoji = stat._id === 'male' ? '👨' : stat._id === 'female' ? '👩' : '❓';
      console.log(`   ${emoji} ${stat._id || 'unknown'}: ${stat.count} (${percentage}%)`);
    });
    
    console.log('\n🎉 All citizens now have randomly assigned genders!');
    
  } catch (error) {
    console.error('❌ Error updating citizen genders:', error.message);
    if (error.message.includes('authentication')) {
      console.error('💡 Check your MongoDB credentials and connection string');
    } else if (error.message.includes('network')) {
      console.error('💡 Check your internet connection and MongoDB cluster status');
    }
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

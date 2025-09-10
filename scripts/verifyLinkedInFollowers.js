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
  console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" node scripts/verifyLinkedInFollowers.js');
  process.exit(1);
}

async function verifyLinkedInFollowers() {
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
    
    // Check LinkedIn followers distribution
    console.log('📈 Checking LinkedIn followers distribution...');
    const followerStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.linkedIn.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 LinkedIn Followers Distribution:');
    followerStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} followers: ${stat.count} citizens`);
    });
    
    // Check if all citizens have 0 followers
    const zeroFollowersCount = followerStats.find(stat => stat._id === 0)?.count || 0;
    const totalCitizens = citizens.length;
    
    console.log('\n📊 Summary:');
    console.log(`   👥 Total citizens: ${totalCitizens}`);
    console.log(`   ✅ Citizens with 0 followers: ${zeroFollowersCount}`);
    console.log(`   ⚠️  Citizens with non-zero followers: ${totalCitizens - zeroFollowersCount}`);
    
    if (zeroFollowersCount === totalCitizens) {
      console.log('\n🎉 SUCCESS! All citizens have 0 LinkedIn followers!');
    } else {
      console.log('\n⚠️  WARNING: Not all citizens have 0 followers.');
      console.log('   Run the update script to fix this:');
      console.log('   node scripts/updateLinkedInFollowers.js');
    }
    
    // Show some examples of citizens with non-zero followers (if any)
    const nonZeroFollowers = citizens.filter(citizen => citizen.socialMedia?.linkedIn?.followers > 0);
    if (nonZeroFollowers.length > 0) {
      console.log('\n👥 Citizens with non-zero followers:');
      nonZeroFollowers.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.linkedIn.followers} followers`);
      });
      if (nonZeroFollowers.length > 5) {
        console.log(`   ... and ${nonZeroFollowers.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verifying LinkedIn followers:', error.message);
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

// Run the verification
verifyLinkedInFollowers();

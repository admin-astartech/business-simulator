const { MongoClient } = require('mongodb');

// MongoDB connection - you can set these as environment variables or replace with your actual values
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://helenfagbemi:Passes12@cluster0.znzzx.mongodb.net/?retryWrites=true&w=majority&appName=cluster0';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'business-simulator';

// if (!process.env.MONGODB_URI) {
//   console.error('❌ MONGODB_URI not found in environment variables');
//   console.error('Please set your MongoDB URI as an environment variable:');
//   console.error('export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"');
//   console.error('export MONGODB_DATABASE="business-simulator"');
//   console.error('');
//   console.error('Or run the script with:');
//   console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" node scripts/verifyTikTokFollowing.js');
//   process.exit(1);
// }

async function verifyTikTokFollowing() {
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
    
    // Check TikTok following distribution
    console.log('📈 Checking TikTok following distribution...');
    const followingStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 TikTok Following Distribution:');
    followingStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} following: ${stat.count} citizens`);
    });
    
    // Check videoCount field existence
    console.log('\n📈 Checking videoCount field status...');
    const citizensWithVideoCount = await citizensCollection.countDocuments({
      'socialMedia.tikTok.videoCount': { $exists: true }
    });
    
    const citizensWithoutVideoCount = citizens.length - citizensWithVideoCount;
    
    console.log('\n📊 VideoCount Field Status:');
    console.log(`   ✅ Citizens without videoCount field: ${citizensWithoutVideoCount}`);
    console.log(`   ⚠️  Citizens with videoCount field: ${citizensWithVideoCount}`);
    
    // Check if all citizens have 0 following and no videoCount
    const zeroFollowingCount = followingStats.find(stat => stat._id === 0)?.count || 0;
    const totalCitizens = citizens.length;
    
    console.log('\n📊 Summary:');
    console.log(`   👥 Total citizens: ${totalCitizens}`);
    console.log(`   ✅ Citizens with 0 following: ${zeroFollowingCount}`);
    console.log(`   ⚠️  Citizens with non-zero following: ${totalCitizens - zeroFollowingCount}`);
    console.log(`   ✅ Citizens without videoCount field: ${citizensWithoutVideoCount}`);
    console.log(`   ⚠️  Citizens with videoCount field: ${citizensWithVideoCount}`);
    
    if (zeroFollowingCount === totalCitizens && citizensWithVideoCount === 0) {
      console.log('\n🎉 SUCCESS! All citizens have 0 TikTok following and videoCount field has been removed!');
    } else {
      console.log('\n⚠️  WARNING: Not all citizens have been updated correctly.');
      console.log('   Run the update script to fix this:');
      console.log('   node scripts/updateTikTokFollowing.js');
    }
    
    // Show some examples of citizens with non-zero following (if any)
    const nonZeroFollowing = citizens.filter(citizen => citizen.socialMedia?.tikTok?.following > 0);
    if (nonZeroFollowing.length > 0) {
      console.log('\n👥 Citizens with non-zero following:');
      nonZeroFollowing.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.tikTok.following} following`);
      });
      if (nonZeroFollowing.length > 5) {
        console.log(`   ... and ${nonZeroFollowing.length - 5} more`);
      }
    }
    
    // Show some examples of citizens with videoCount field (if any)
    const citizensWithVideoCountField = citizens.filter(citizen => 
      citizen.socialMedia?.tikTok?.videoCount !== undefined
    );
    if (citizensWithVideoCountField.length > 0) {
      console.log('\n🎥 Citizens with videoCount field:');
      citizensWithVideoCountField.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.tikTok.videoCount} videos`);
      });
      if (citizensWithVideoCountField.length > 5) {
        console.log(`   ... and ${citizensWithVideoCountField.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verifying TikTok following and videoCount:', error.message);
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
verifyTikTokFollowing();

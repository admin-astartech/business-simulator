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
//   console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" node scripts/updateTikTokFollowers.js');
//   process.exit(1);
// }

async function updateTikTokFollowers() {
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
    
    // Check current TikTok followers, following, and likes distribution
    console.log('📈 Checking current TikTok followers distribution...');
    const followersStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current TikTok Followers Distribution:');
    followersStats.forEach(stat => {
      console.log(`   👥 ${stat._id} followers: ${stat.count} citizens`);
    });
    
    console.log('\n📈 Checking current TikTok following distribution...');
    const followingStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current TikTok Following Distribution:');
    followingStats.forEach(stat => {
      console.log(`   👥 ${stat._id} following: ${stat.count} citizens`);
    });
    
    console.log('\n📈 Checking current TikTok total likes distribution...');
    const likesStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.totalLikes',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current TikTok Total Likes Distribution:');
    likesStats.forEach(stat => {
      console.log(`   ❤️  ${stat._id} total likes: ${stat.count} citizens`);
    });
    
    // Update all citizens' TikTok followers, following, total likes to 0, and replace videoCount with postCount
    const updates = [];
    
    console.log('\n🔄 Updating all citizens TikTok followers, following, total likes to 0, and replacing videoCount with postCount...');
    for (const citizen of citizens) {
      updates.push({
        updateOne: {
          filter: { _id: citizen._id },
          update: { 
            $set: { 
              'socialMedia.tikTok.followers': 0,
              'socialMedia.tikTok.following': 0,
              'socialMedia.tikTok.totalLikes': 0,
              'socialMedia.tikTok.postCount': 0
            },
            $unset: {
              'socialMedia.tikTok.videoCount': ""
            }
          }
        }
      });
    }
    
    const result = await citizensCollection.bulkWrite(updates);
    
    console.log('✅ Update completed!');
    console.log(`📈 Modified ${result.modifiedCount} citizens`);
    
    // Verify the update
    console.log('\n🔍 Verifying the update...');
    const updatedFollowersStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedFollowingStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedLikesStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.totalLikes',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedPostCountStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.postCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // Check if videoCount field still exists
    const citizensWithVideoCount = await citizensCollection.countDocuments({
      'socialMedia.tikTok.videoCount': { $exists: true }
    });
    
    console.log('\n📊 Updated TikTok Followers Distribution:');
    updatedFollowersStats.forEach(stat => {
      console.log(`   👥 ${stat._id} followers: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated TikTok Following Distribution:');
    updatedFollowingStats.forEach(stat => {
      console.log(`   👥 ${stat._id} following: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated TikTok Total Likes Distribution:');
    updatedLikesStats.forEach(stat => {
      console.log(`   ❤️  ${stat._id} total likes: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated TikTok PostCount Distribution:');
    updatedPostCountStats.forEach(stat => {
      console.log(`   📝 ${stat._id} posts: ${stat.count} citizens`);
    });
    
    console.log(`\n📊 VideoCount Field Status:`);
    console.log(`   🎥 Citizens with videoCount field: ${citizensWithVideoCount}`);
    console.log(`   ✅ Citizens without videoCount field: ${citizens.length - citizensWithVideoCount}`);
    
    // Check if all citizens now have 0 followers, 0 following, 0 likes, 0 postCount, and no videoCount
    const zeroFollowersCount = updatedFollowersStats.find(stat => stat._id === 0)?.count || 0;
    const zeroFollowingCount = updatedFollowingStats.find(stat => stat._id === 0)?.count || 0;
    const zeroLikesCount = updatedLikesStats.find(stat => stat._id === 0)?.count || 0;
    const zeroPostCountCount = updatedPostCountStats.find(stat => stat._id === 0)?.count || 0;
    
    if (zeroFollowersCount === citizens.length && zeroFollowingCount === citizens.length && zeroLikesCount === citizens.length && zeroPostCountCount === citizens.length && citizensWithVideoCount === 0) {
      console.log('\n🎉 Success! All citizens now have 0 TikTok followers, 0 following, 0 total likes, 0 postCount, and videoCount field has been removed!');
    } else {
      console.log('\n⚠️  Warning: Not all citizens have been updated correctly. Please check the update.');
      if (zeroFollowersCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroFollowersCount} citizens still have non-zero followers`);
      }
      if (zeroFollowingCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroFollowingCount} citizens still have non-zero following`);
      }
      if (zeroLikesCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroLikesCount} citizens still have non-zero total likes`);
      }
      if (zeroPostCountCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroPostCountCount} citizens still have non-zero postCount`);
      }
      if (citizensWithVideoCount > 0) {
        console.log(`   - ${citizensWithVideoCount} citizens still have videoCount field`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating TikTok followers and likes:', error.message);
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
updateTikTokFollowers();

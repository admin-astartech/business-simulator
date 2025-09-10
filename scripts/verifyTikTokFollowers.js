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
//   console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" node scripts/verifyTikTokFollowers.js');
//   process.exit(1);
// }

async function verifyTikTokFollowers() {
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
    
    // Check TikTok followers distribution
    console.log('📈 Checking TikTok followers distribution...');
    const followersStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 TikTok Followers Distribution:');
    followersStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} followers: ${stat.count} citizens`);
    });
    
    // Check TikTok following distribution
    console.log('\n📈 Checking TikTok following distribution...');
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
    
    // Check TikTok total likes distribution
    console.log('\n📈 Checking TikTok total likes distribution...');
    const likesStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.totalLikes',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 TikTok Total Likes Distribution:');
    likesStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} total likes: ${stat.count} citizens`);
    });
    
    // Check TikTok postCount distribution
    console.log('\n📈 Checking TikTok postCount distribution...');
    const postCountStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.postCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 TikTok PostCount Distribution:');
    postCountStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} posts: ${stat.count} citizens`);
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
    
    // Check if all citizens have 0 followers, 0 following, 0 likes, 0 postCount, and no videoCount
    const zeroFollowersCount = followersStats.find(stat => stat._id === 0)?.count || 0;
    const zeroFollowingCount = followingStats.find(stat => stat._id === 0)?.count || 0;
    const zeroLikesCount = likesStats.find(stat => stat._id === 0)?.count || 0;
    const zeroPostCountCount = postCountStats.find(stat => stat._id === 0)?.count || 0;
    const totalCitizens = citizens.length;
    
    console.log('\n📊 Summary:');
    console.log(`   👥 Total citizens: ${totalCitizens}`);
    console.log(`   ✅ Citizens with 0 followers: ${zeroFollowersCount}`);
    console.log(`   ⚠️  Citizens with non-zero followers: ${totalCitizens - zeroFollowersCount}`);
    console.log(`   ✅ Citizens with 0 following: ${zeroFollowingCount}`);
    console.log(`   ⚠️  Citizens with non-zero following: ${totalCitizens - zeroFollowingCount}`);
    console.log(`   ✅ Citizens with 0 total likes: ${zeroLikesCount}`);
    console.log(`   ⚠️  Citizens with non-zero total likes: ${totalCitizens - zeroLikesCount}`);
    console.log(`   ✅ Citizens with 0 postCount: ${zeroPostCountCount}`);
    console.log(`   ⚠️  Citizens with non-zero postCount: ${totalCitizens - zeroPostCountCount}`);
    console.log(`   ✅ Citizens without videoCount field: ${citizensWithoutVideoCount}`);
    console.log(`   ⚠️  Citizens with videoCount field: ${citizensWithVideoCount}`);
    
    if (zeroFollowersCount === totalCitizens && zeroFollowingCount === totalCitizens && zeroLikesCount === totalCitizens && zeroPostCountCount === totalCitizens && citizensWithVideoCount === 0) {
      console.log('\n🎉 SUCCESS! All citizens have 0 TikTok followers, 0 following, 0 total likes, 0 postCount, and videoCount field has been removed!');
    } else {
      console.log('\n⚠️  WARNING: Not all citizens have been updated correctly.');
      console.log('   Run the update script to fix this:');
      console.log('   node scripts/updateTikTokFollowers.js');
    }
    
    // Show some examples of citizens with non-zero followers, following, likes, postCount, or videoCount (if any)
    const nonZeroFollowers = citizens.filter(citizen => citizen.socialMedia?.tikTok?.followers > 0);
    const nonZeroFollowing = citizens.filter(citizen => citizen.socialMedia?.tikTok?.following > 0);
    const nonZeroLikes = citizens.filter(citizen => citizen.socialMedia?.tikTok?.totalLikes > 0);
    const nonZeroPostCount = citizens.filter(citizen => citizen.socialMedia?.tikTok?.postCount > 0);
    const citizensWithVideoCountField = citizens.filter(citizen => 
      citizen.socialMedia?.tikTok?.videoCount !== undefined
    );
    
    if (nonZeroFollowers.length > 0) {
      console.log('\n👥 Citizens with non-zero followers:');
      nonZeroFollowers.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.tikTok.followers} followers`);
      });
      if (nonZeroFollowers.length > 5) {
        console.log(`   ... and ${nonZeroFollowers.length - 5} more`);
      }
    }
    
    if (nonZeroFollowing.length > 0) {
      console.log('\n👥 Citizens with non-zero following:');
      nonZeroFollowing.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.tikTok.following} following`);
      });
      if (nonZeroFollowing.length > 5) {
        console.log(`   ... and ${nonZeroFollowing.length - 5} more`);
      }
    }
    
    if (nonZeroLikes.length > 0) {
      console.log('\n❤️  Citizens with non-zero total likes:');
      nonZeroLikes.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.tikTok.totalLikes} total likes`);
      });
      if (nonZeroLikes.length > 5) {
        console.log(`   ... and ${nonZeroLikes.length - 5} more`);
      }
    }
    
    if (nonZeroPostCount.length > 0) {
      console.log('\n📝 Citizens with non-zero postCount:');
      nonZeroPostCount.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.tikTok.postCount} posts`);
      });
      if (nonZeroPostCount.length > 5) {
        console.log(`   ... and ${nonZeroPostCount.length - 5} more`);
      }
    }
    
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
    console.error('❌ Error verifying TikTok followers and likes:', error.message);
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
verifyTikTokFollowers();

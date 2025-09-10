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
//   console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" node scripts/verifyInstagramData.js');
//   process.exit(1);
// }

async function verifyInstagramData() {
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
    
    // Check Instagram followers distribution
    console.log('📈 Checking Instagram followers distribution...');
    const followersStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Instagram Followers Distribution:');
    followersStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} followers: ${stat.count} citizens`);
    });
    
    // Check Instagram following distribution
    console.log('\n📈 Checking Instagram following distribution...');
    const followingStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Instagram Following Distribution:');
    followingStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} following: ${stat.count} citizens`);
    });
    
    // Check Instagram posts distribution
    console.log('\n📈 Checking Instagram posts distribution...');
    const postsStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.postsCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Instagram Posts Distribution:');
    postsStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} posts: ${stat.count} citizens`);
    });
    
    // Check Instagram avgLikes distribution
    console.log('\n📈 Checking Instagram avgLikes distribution...');
    const avgLikesStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.avgLikes',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Instagram AvgLikes Distribution:');
    avgLikesStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} avg likes: ${stat.count} citizens`);
    });
    
    // Check Instagram avgComments distribution
    console.log('\n📈 Checking Instagram avgComments distribution...');
    const avgCommentsStats = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.avgComments',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Instagram AvgComments Distribution:');
    avgCommentsStats.forEach(stat => {
      const emoji = stat._id === 0 ? '✅' : '⚠️';
      console.log(`   ${emoji} ${stat._id} avg comments: ${stat.count} citizens`);
    });
    
    // Check if all citizens have 0 for all Instagram metrics
    const zeroFollowersCount = followersStats.find(stat => stat._id === 0)?.count || 0;
    const zeroFollowingCount = followingStats.find(stat => stat._id === 0)?.count || 0;
    const zeroPostsCount = postsStats.find(stat => stat._id === 0)?.count || 0;
    const zeroAvgLikesCount = avgLikesStats.find(stat => stat._id === 0)?.count || 0;
    const zeroAvgCommentsCount = avgCommentsStats.find(stat => stat._id === 0)?.count || 0;
    const totalCitizens = citizens.length;
    
    console.log('\n📊 Summary:');
    console.log(`   👥 Total citizens: ${totalCitizens}`);
    console.log(`   ✅ Citizens with 0 followers: ${zeroFollowersCount}`);
    console.log(`   ⚠️  Citizens with non-zero followers: ${totalCitizens - zeroFollowersCount}`);
    console.log(`   ✅ Citizens with 0 following: ${zeroFollowingCount}`);
    console.log(`   ⚠️  Citizens with non-zero following: ${totalCitizens - zeroFollowingCount}`);
    console.log(`   ✅ Citizens with 0 posts: ${zeroPostsCount}`);
    console.log(`   ⚠️  Citizens with non-zero posts: ${totalCitizens - zeroPostsCount}`);
    console.log(`   ✅ Citizens with 0 avgLikes: ${zeroAvgLikesCount}`);
    console.log(`   ⚠️  Citizens with non-zero avgLikes: ${totalCitizens - zeroAvgLikesCount}`);
    console.log(`   ✅ Citizens with 0 avgComments: ${zeroAvgCommentsCount}`);
    console.log(`   ⚠️  Citizens with non-zero avgComments: ${totalCitizens - zeroAvgCommentsCount}`);
    
    if (zeroFollowersCount === totalCitizens && zeroFollowingCount === totalCitizens && zeroPostsCount === totalCitizens && zeroAvgLikesCount === totalCitizens && zeroAvgCommentsCount === totalCitizens) {
      console.log('\n🎉 SUCCESS! All citizens have 0 Instagram followers, following, posts, avgLikes, and avgComments!');
    } else {
      console.log('\n⚠️  WARNING: Not all citizens have been updated correctly.');
      console.log('   Run the update script to fix this:');
      console.log('   node scripts/updateInstagramData.js');
    }
    
    // Show some examples of citizens with non-zero values (if any)
    const nonZeroFollowers = citizens.filter(citizen => citizen.socialMedia?.instagram?.followers > 0);
    const nonZeroFollowing = citizens.filter(citizen => citizen.socialMedia?.instagram?.following > 0);
    const nonZeroPosts = citizens.filter(citizen => citizen.socialMedia?.instagram?.postsCount > 0);
    const nonZeroAvgLikes = citizens.filter(citizen => citizen.socialMedia?.instagram?.avgLikes > 0);
    const nonZeroAvgComments = citizens.filter(citizen => citizen.socialMedia?.instagram?.avgComments > 0);
    
    if (nonZeroFollowers.length > 0) {
      console.log('\n👥 Citizens with non-zero followers:');
      nonZeroFollowers.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.instagram.followers} followers`);
      });
      if (nonZeroFollowers.length > 5) {
        console.log(`   ... and ${nonZeroFollowers.length - 5} more`);
      }
    }
    
    if (nonZeroFollowing.length > 0) {
      console.log('\n👥 Citizens with non-zero following:');
      nonZeroFollowing.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.instagram.following} following`);
      });
      if (nonZeroFollowing.length > 5) {
        console.log(`   ... and ${nonZeroFollowing.length - 5} more`);
      }
    }
    
    if (nonZeroPosts.length > 0) {
      console.log('\n📸 Citizens with non-zero posts:');
      nonZeroPosts.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.instagram.postsCount} posts`);
      });
      if (nonZeroPosts.length > 5) {
        console.log(`   ... and ${nonZeroPosts.length - 5} more`);
      }
    }
    
    if (nonZeroAvgLikes.length > 0) {
      console.log('\n❤️  Citizens with non-zero avgLikes:');
      nonZeroAvgLikes.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.instagram.avgLikes} avg likes`);
      });
      if (nonZeroAvgLikes.length > 5) {
        console.log(`   ... and ${nonZeroAvgLikes.length - 5} more`);
      }
    }
    
    if (nonZeroAvgComments.length > 0) {
      console.log('\n💬 Citizens with non-zero avgComments:');
      nonZeroAvgComments.slice(0, 5).forEach(citizen => {
        console.log(`   - ${citizen.name}: ${citizen.socialMedia.instagram.avgComments} avg comments`);
      });
      if (nonZeroAvgComments.length > 5) {
        console.log(`   ... and ${nonZeroAvgComments.length - 5} more`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error verifying Instagram data:', error.message);
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
verifyInstagramData();

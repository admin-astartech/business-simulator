import { MongoClient, Db, Collection, BulkWriteResult } from 'mongodb';

// MongoDB connection - you can set these as environment variables or replace with your actual values
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://helenfagbemi:Passes12@cluster0.znzzx.mongodb.net/?retryWrites=true&w=majority&appName=cluster0';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'business-simulator';

interface Citizen {
  _id: any;
  socialMedia: {
    instagram: {
      followers: number;
      following: number;
      postsCount: number;
      avgLikes: number;
      avgComments: number;
    };
  };
}

interface Stats {
  _id: number;
  count: number;
}

// if (!process.env.MONGODB_URI) {
//   console.error('❌ MONGODB_URI not found in environment variables');
//   console.error('Please set your MongoDB URI as an environment variable:');
//   console.error('export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"');
//   console.error('export MONGODB_DATABASE="business-simulator"');
//   console.error('');
//   console.error('Or run the script with:');
//   console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" npx ts-node scripts/updateInstagramData.ts');
//   process.exit(1);
// }

async function updateInstagramData(): Promise<void> {
  let client: MongoClient | undefined;
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log(`📍 Database: ${MONGODB_DATABASE}`);
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db: Db = client.db(MONGODB_DATABASE);
    const citizensCollection: Collection<Citizen> = db.collection('citizens');
    
    console.log('📊 Fetching all citizens...');
    const citizens: Citizen[] = await citizensCollection.find({}).toArray();
    console.log(`Found ${citizens.length} citizens in database`);
    
    if (citizens.length === 0) {
      console.log('⚠️  No citizens found in database. Please populate the database first.');
      return;
    }
    
    // Check current Instagram data distribution
    console.log('📈 Checking current Instagram followers distribution...');
    const followersStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current Instagram Followers Distribution:');
    followersStats.forEach((stat: Stats) => {
      console.log(`   👥 ${stat._id} followers: ${stat.count} citizens`);
    });
    
    console.log('\n📈 Checking current Instagram following distribution...');
    const followingStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current Instagram Following Distribution:');
    followingStats.forEach((stat: Stats) => {
      console.log(`   👥 ${stat._id} following: ${stat.count} citizens`);
    });
    
    console.log('\n📈 Checking current Instagram posts distribution...');
    const postsStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.postsCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current Instagram Posts Distribution:');
    postsStats.forEach((stat: Stats) => {
      console.log(`   📸 ${stat._id} posts: ${stat.count} citizens`);
    });
    
    console.log('\n📈 Checking current Instagram avgLikes distribution...');
    const avgLikesStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.avgLikes',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current Instagram AvgLikes Distribution:');
    avgLikesStats.forEach((stat: Stats) => {
      console.log(`   ❤️  ${stat._id} avg likes: ${stat.count} citizens`);
    });
    
    console.log('\n📈 Checking current Instagram avgComments distribution...');
    const avgCommentsStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.avgComments',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current Instagram AvgComments Distribution:');
    avgCommentsStats.forEach((stat: Stats) => {
      console.log(`   💬 ${stat._id} avg comments: ${stat.count} citizens`);
    });
    
    // Update all citizens' Instagram data to 0
    const updates: any[] = [];
    
    console.log('\n🔄 Updating all citizens Instagram data to 0...');
    for (const citizen of citizens) {
      updates.push({
        updateOne: {
          filter: { _id: citizen._id },
          update: { 
            $set: { 
              'socialMedia.instagram.followers': 0,
              'socialMedia.instagram.following': 0,
              'socialMedia.instagram.postsCount': 0,
              'socialMedia.instagram.avgLikes': 0,
              'socialMedia.instagram.avgComments': 0
            } 
          }
        }
      });
    }
    
    const result: BulkWriteResult = await citizensCollection.bulkWrite(updates);
    
    console.log('✅ Update completed!');
    console.log(`📈 Modified ${result.modifiedCount} citizens`);
    
    // Verify the update
    console.log('\n🔍 Verifying the update...');
    const updatedFollowersStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedFollowingStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedPostsStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.postsCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedAvgLikesStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.avgLikes',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    const updatedAvgCommentsStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.instagram.avgComments',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Updated Instagram Followers Distribution:');
    updatedFollowersStats.forEach((stat: Stats) => {
      console.log(`   👥 ${stat._id} followers: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated Instagram Following Distribution:');
    updatedFollowingStats.forEach((stat: Stats) => {
      console.log(`   👥 ${stat._id} following: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated Instagram Posts Distribution:');
    updatedPostsStats.forEach((stat: Stats) => {
      console.log(`   📸 ${stat._id} posts: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated Instagram AvgLikes Distribution:');
    updatedAvgLikesStats.forEach((stat: Stats) => {
      console.log(`   ❤️  ${stat._id} avg likes: ${stat.count} citizens`);
    });
    
    console.log('\n📊 Updated Instagram AvgComments Distribution:');
    updatedAvgCommentsStats.forEach((stat: Stats) => {
      console.log(`   💬 ${stat._id} avg comments: ${stat.count} citizens`);
    });
    
    // Check if all citizens now have 0 for all Instagram metrics
    const zeroFollowersCount: number = updatedFollowersStats.find((stat: Stats) => stat._id === 0)?.count || 0;
    const zeroFollowingCount: number = updatedFollowingStats.find((stat: Stats) => stat._id === 0)?.count || 0;
    const zeroPostsCount: number = updatedPostsStats.find((stat: Stats) => stat._id === 0)?.count || 0;
    const zeroAvgLikesCount: number = updatedAvgLikesStats.find((stat: Stats) => stat._id === 0)?.count || 0;
    const zeroAvgCommentsCount: number = updatedAvgCommentsStats.find((stat: Stats) => stat._id === 0)?.count || 0;
    
    if (zeroFollowersCount === citizens.length && zeroFollowingCount === citizens.length && zeroPostsCount === citizens.length && zeroAvgLikesCount === citizens.length && zeroAvgCommentsCount === citizens.length) {
      console.log('\n🎉 Success! All citizens now have 0 Instagram followers, following, posts, avgLikes, and avgComments!');
    } else {
      console.log('\n⚠️  Warning: Not all citizens have been updated correctly. Please check the update.');
      if (zeroFollowersCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroFollowersCount} citizens still have non-zero followers`);
      }
      if (zeroFollowingCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroFollowingCount} citizens still have non-zero following`);
      }
      if (zeroPostsCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroPostsCount} citizens still have non-zero posts`);
      }
      if (zeroAvgLikesCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroAvgLikesCount} citizens still have non-zero avgLikes`);
      }
      if (zeroAvgCommentsCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroAvgCommentsCount} citizens still have non-zero avgComments`);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error updating Instagram data:', error.message);
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
updateInstagramData();

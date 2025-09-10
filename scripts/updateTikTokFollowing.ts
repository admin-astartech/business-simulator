import { MongoClient, Db, Collection, BulkWriteResult } from 'mongodb';

// MongoDB connection - you can set these as environment variables or replace with your actual values
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://helenfagbemi:Passes12@cluster0.znzzx.mongodb.net/?retryWrites=true&w=majority&appName=cluster0';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'business-simulator';

interface Citizen {
  _id: any;
  socialMedia: {
    tikTok: {
      following: number;
      videoCount?: number;
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
//   console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" npx ts-node scripts/updateTikTokFollowing.ts');
//   process.exit(1);
// }

async function updateTikTokFollowing(): Promise<void> {
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
    
    // Check current TikTok following distribution
    console.log('📈 Checking current TikTok following distribution...');
    const followingStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current TikTok Following Distribution:');
    followingStats.forEach((stat: Stats) => {
      console.log(`   👥 ${stat._id} following: ${stat.count} citizens`);
    });
    
    // Check current videoCount distribution
    console.log('\n📈 Checking current TikTok videoCount distribution...');
    const videoCountStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.videoCount',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current TikTok VideoCount Distribution:');
    videoCountStats.forEach((stat: Stats) => {
      console.log(`   🎥 ${stat._id} videos: ${stat.count} citizens`);
    });
    
    // Update all citizens' TikTok following to 0 and remove videoCount
    const updates: any[] = [];
    
    console.log('\n🔄 Updating all citizens TikTok following to 0 and removing videoCount...');
    for (const citizen of citizens) {
      updates.push({
        updateOne: {
          filter: { _id: citizen._id },
          update: { 
            $set: { 
              'socialMedia.tikTok.following': 0
            },
            $unset: {
              'socialMedia.tikTok.videoCount': ""
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
    const updatedFollowingStats: Stats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.tikTok.following',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    // Check if videoCount field still exists
    const citizensWithVideoCount: number = await citizensCollection.countDocuments({
      'socialMedia.tikTok.videoCount': { $exists: true }
    });
    
    console.log('\n📊 Updated TikTok Following Distribution:');
    updatedFollowingStats.forEach((stat: Stats) => {
      console.log(`   👥 ${stat._id} following: ${stat.count} citizens`);
    });
    
    console.log(`\n📊 VideoCount Field Status:`);
    console.log(`   🎥 Citizens with videoCount field: ${citizensWithVideoCount}`);
    console.log(`   ✅ Citizens without videoCount field: ${citizens.length - citizensWithVideoCount}`);
    
    // Check if all citizens now have 0 following and no videoCount
    const zeroFollowingCount: number = updatedFollowingStats.find((stat: Stats) => stat._id === 0)?.count || 0;
    
    if (zeroFollowingCount === citizens.length && citizensWithVideoCount === 0) {
      console.log('\n🎉 Success! All citizens now have 0 TikTok following and videoCount field has been removed!');
    } else {
      console.log('\n⚠️  Warning: Not all citizens have been updated correctly. Please check the update.');
      if (zeroFollowingCount !== citizens.length) {
        console.log(`   - ${citizens.length - zeroFollowingCount} citizens still have non-zero following`);
      }
      if (citizensWithVideoCount > 0) {
        console.log(`   - ${citizensWithVideoCount} citizens still have videoCount field`);
      }
    }
    
  } catch (error: any) {
    console.error('❌ Error updating TikTok following and removing videoCount:', error.message);
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
updateTikTokFollowing();

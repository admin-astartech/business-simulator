import { MongoClient, Db, Collection, BulkWriteResult } from 'mongodb';

// MongoDB connection - you can set these as environment variables or replace with your actual values
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'business-simulator';

interface Citizen {
  _id: any;
  socialMedia: {
    linkedIn: {
      followers: number;
    };
  };
}

interface FollowerStats {
  _id: number;
  count: number;
}

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  console.error('Please set your MongoDB URI as an environment variable:');
  console.error('export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"');
  console.error('export MONGODB_DATABASE="business-simulator"');
  console.error('');
  console.error('Or run the script with:');
  console.error('MONGODB_URI="your-uri" MONGODB_DATABASE="your-db" npx ts-node scripts/updateLinkedInFollowers.ts');
  process.exit(1);
}

async function updateLinkedInFollowers(): Promise<void> {
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
    
    // Check current LinkedIn followers distribution
    console.log('📈 Checking current LinkedIn followers distribution...');
    const currentStats: FollowerStats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.linkedIn.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Current LinkedIn Followers Distribution:');
    currentStats.forEach((stat: FollowerStats) => {
      console.log(`   👥 ${stat._id} followers: ${stat.count} citizens`);
    });
    
    // Update all citizens' LinkedIn followers to 0
    const updates: any[] = [];
    
    console.log('\n🔄 Updating all citizens LinkedIn followers to 0...');
    for (const citizen of citizens) {
      updates.push({
        updateOne: {
          filter: { _id: citizen._id },
          update: { $set: { 'socialMedia.linkedIn.followers': 0 } }
        }
      });
    }
    
    const result: BulkWriteResult = await citizensCollection.bulkWrite(updates);
    
    console.log('✅ Update completed!');
    console.log(`📈 Modified ${result.modifiedCount} citizens`);
    
    // Verify the update
    console.log('\n🔍 Verifying the update...');
    const updatedStats: FollowerStats[] = await citizensCollection.aggregate([
      {
        $group: {
          _id: '$socialMedia.linkedIn.followers',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    console.log('\n📊 Updated LinkedIn Followers Distribution:');
    updatedStats.forEach((stat: FollowerStats) => {
      console.log(`   👥 ${stat._id} followers: ${stat.count} citizens`);
    });
    
    // Check if all citizens now have 0 followers
    const zeroFollowersCount: number = updatedStats.find((stat: FollowerStats) => stat._id === 0)?.count || 0;
    if (zeroFollowersCount === citizens.length) {
      console.log('\n🎉 Success! All citizens now have 0 LinkedIn followers!');
    } else {
      console.log('\n⚠️  Warning: Not all citizens have 0 followers. Please check the update.');
    }
    
  } catch (error: any) {
    console.error('❌ Error updating LinkedIn followers:', error.message);
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
updateLinkedInFollowers();

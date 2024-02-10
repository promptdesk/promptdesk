import mongoose from 'mongoose';

export default async function connectToDatabase() {
  console.log('INFO :: MONGODB CONNECTING', process.env.MONGO_URL)
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL+"_test" as string, {
      connectTimeoutMS: 5000,
      retryWrites: false
    });
    //get database name
    const dbName = mongoose.connection.db.databaseName;
    console.log('INFO :: MONGODB CONNECTED TO DATABASE', dbName);
    //if _test in database name, drop and recreate database
    if (dbName.includes('_test')) {
      console.log('INFO :: MONGODB RESET DATABASE');
      await mongoose.connection.db.dropDatabase();
    }
  } catch (error) {
    console.log('INFO :: MONGODB ERROR', error);
    return "ERROR"
  }
}
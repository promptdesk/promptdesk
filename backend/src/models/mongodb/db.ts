import mongoose from 'mongoose';

export default async function connectToDatabase() {
  console.log('INFO :: MONGODB CONNECTING', process.env.MONGO_URL)
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL as string, {
      connectTimeoutMS: 5000,
      retryWrites: false
    });
    console.log('INFO :: MONGODB CONNECTED');
    return "CONNECTED"
  } catch (error) {
    console.log('INFO :: MONGODB ERROR', error);
    return "ERROR"
  }
}
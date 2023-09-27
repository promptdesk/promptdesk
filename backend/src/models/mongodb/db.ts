import mongoose from 'mongoose';

export default async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL as string, {
      connectTimeoutMS: 5000,
    });
    console.log('INFO :: MONGODB CONNECTED');
    return "CONNECTED"
  } catch (error) {
    console.log('Error connecting to DB.', error);
    return "ERROR"
  }
}
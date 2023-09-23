import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export default async function connectToDatabase() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGODB_URI as string);
    return "CONNECTED"
    console.log('Successfully connected to DB.');
  } catch (error) {
    console.log('Error connecting to DB.', error);
    return "ERROR"
  }
}

// Call the connectToDatabase function to establish the connection
connectToDatabase();
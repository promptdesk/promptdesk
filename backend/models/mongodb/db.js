import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({path:'../.env'})

try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Successfully connected to DB.')
} catch (error) {
    console.log('Error connecting to DB.', error)
}
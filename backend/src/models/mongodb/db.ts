import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export default async function connectToDatabase(test = false) {
  console.log("INFO :: MONGODB CONNECTING", process.env.MONGO_URL);
  try {
    mongoose.set("strictQuery", false);

    let mongo_uri = process.env.MONGO_URL as string;

    await mongoose.connect(mongo_uri as string, {
      connectTimeoutMS: 5000,
      retryWrites: false,
    });

    const dbName = mongoose.connection.db.databaseName;
    console.log("INFO :: MONGODB CONNECTED TO DATABASE", dbName);

    return "CONNECTED";
  } catch (error) {
    console.log("INFO :: MONGODB ERROR", error);
    return "ERROR";
  }
}

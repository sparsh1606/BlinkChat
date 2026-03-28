import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
console.log(MONGODB_URL);

if (!MONGODB_URL) {
  throw new Error("MongoDB URL doesnot exist...");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    console.log("MongoDB connected!!!");
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  console.log("MongoDB connected...");
  return cached.conn;
};

export default connectDb;

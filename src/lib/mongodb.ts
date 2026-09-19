import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectMongo() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection && mongoose.connection.readyState === 2 && cached.promise) {
    await cached.promise;
    return mongoose.connection;
  }

  const opts = {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
    socketTimeoutMS: 5000,
    maxPoolSize: 25,
    minPoolSize: 0,
  };

  cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
    cached.conn = m;
    return m;
  });

  try {
    await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export default connectMongo;

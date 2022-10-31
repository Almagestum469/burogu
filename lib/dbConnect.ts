import mongoose from 'mongoose'


const MONGODB_URI = process.env.MONGODB_URI ?? ''

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, bucket: null }
}

async function dbConnect() {
  if (cached.conn && cached.bucket) {
    return [cached.conn, cached.bucket]
  }

  if (!cached.promise || !cached.bucket) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      if(!cached.bucket) {
        cached.bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
          bucketName: 'images',
        })
      }
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return [cached.conn, cached.bucket]
}

export default dbConnect
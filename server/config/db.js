import mongoose from 'mongoose'

const connectDB = async () => {
  const uri = process.env.MONGO_URI
  if (!uri) {
    console.warn(
      '[ConnectSphere API] MONGO_URI is not defined in environment variables. Skipping MongoDB connection.'
    )
    return false
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`[ConnectSphere API] MongoDB connected: ${conn.connection.host}`)
    return true
  } catch (error) {
    console.error(`[ConnectSphere API] MongoDB connection error: ${error.message}`)
    return false
  }
}

export default connectDB

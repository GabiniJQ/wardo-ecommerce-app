import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer: MongoMemoryServer

// Connect to in-memory database before all tests
export const connectTestDB = async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  await mongoose.connect(mongoUri)
}

// Clear all test data after each test
export const clearTestDB = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

// Disconnect and stop in-memory database after all tests
export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer.stop()
}

import mongoose from 'mongoose'
import chalk from 'chalk'

const connectDB = async () => {
  if (process.env.MONGO_URI) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI)

      console.log(chalk.cyan(`MongoDB connected: ${conn.connection.host}`))
    } catch (error) {
      console.log(error)
      process.exit(1)
    }
  }
}

export default connectDB
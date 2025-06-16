import mongoose from "mongoose"

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    verificationCodeExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

pendingUserSchema.index(
  { verificationCodeExpiresAt: 1 },
  { expireAfterSeconds: 0 }
)

export const PendingUser = mongoose.model('pending_user', pendingUserSchema)
export default PendingUser
import { UserDb, UserResponse } from '../types/userTypes.js'

const sanitizeUser = (user: UserDb): UserResponse => {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    addresses: user.addresses,
    lastLogin: user.lastLogin,
  }
}

export default sanitizeUser

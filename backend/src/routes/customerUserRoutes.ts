import express from 'express'
import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
  checkAuth,
  changeName,
  changePassword,
  changeAddress,
  deleteAddress,
  addAddress,
  changeMainAddress,
  checkPasswordToken,
  loginDemo,
} from '../controllers/customerUserController.js'
import protect from '../middlewares/verifyTokenMiddleware.js'
import passwordToken from '../middlewares/passwordTokenMiddleware.js'

const customerRouter = express.Router()

customerRouter.post('/', registerUser)

customerRouter.get('/check-auth', protect, checkAuth)

customerRouter.post('/login', loginUser)
customerRouter.post('/login-demo', loginDemo)
customerRouter.post('/logout', logoutUser)

customerRouter.get('/me', protect, getMe)

customerRouter.post('/verify-email', verifyEmail)
customerRouter.post('/forgot-password', forgotPassword)
customerRouter.post('/reset-password/:token', passwordToken, resetPassword)
customerRouter.get('/check-password-token/:token', passwordToken, checkPasswordToken)

customerRouter.put('/change-password/:userId', changePassword)
customerRouter.put('/change-name/:userId', changeName)
customerRouter.put('/change-address/:userId/', changeAddress)
customerRouter.put('/change-main-address/:userId', changeMainAddress)

customerRouter.delete('/address/:userId/:addressId', deleteAddress)
customerRouter.post('/address/:userId/', addAddress)


export default customerRouter

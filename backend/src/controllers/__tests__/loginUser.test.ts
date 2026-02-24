import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import axios from 'axios'
import { generateTokenAndSetCookie } from '../../utils/generateTokenAndSetCookie'
import express, { Express } from 'express'
import { clearTestDB, connectTestDB, disconnectTestDB } from '../../tests/setup'
import { loginUser } from '../customerUserController'
import { hash } from 'bcrypt'
import User from '../../models/userModel'
import request from 'supertest'
import { errorHandler } from '../../middlewares/errorMiddleware'

jest.mock('mailtrap')
jest.mock('../../mailtrap/emails.js')
jest.mock('../../utils/generateTokenAndSetCookie.js')
jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedGenerateToken = generateTokenAndSetCookie as jest.MockedFunction<
  typeof generateTokenAndSetCookie
>

describe('POST /api/users/login - Integration', () => {
  // Setup express
  let app: Express

  beforeAll(async () => {
    await connectTestDB()

    app = express()
    app.use(express.json())
    app.post('/api/users/login', loginUser)
    app.use(errorHandler)

    // Mock env variables
    process.env.RECAPTCHA_SECRET_KEY = 'test-recaptcha-secret'
  })

  afterAll(async () => {
    await disconnectTestDB()
  })

  beforeEach(async () => {
    await clearTestDB()
    jest.resetAllMocks()

    // Default mock: reCAPTCHA verification succeeds
    mockedAxios.post.mockResolvedValue({
      data: { success: true },
    })

    // Mock token generation
    mockedGenerateToken.mockReturnValue('mock-jwt-token')
  })

  describe('successful login', () => {
    it('should successfully log in the user with valid credentials', async () => {
      const hashedPassword = await hash('Password123!', 10)
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'customer',
      })

      const response = await request(app).post('/api/users/login').send({
        email: 'test@example.com',
        password: 'Password123!',
        recaptchaToken: 'valid-token',
      })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        message: 'El usuario ha iniciado sesión exitosamente',
        user: {
          _id: testUser._id.toString(),
          name: 'Test User',
          email: 'test@example.com',
          role: 'customer',
          addresses: [],
          lastLogin: expect.any(String),
        },
      })

      // reCAPTCHA was verified
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://www.google.com/recaptcha/api/siteverify',
        null,
        {
          params: {
            secret: 'test-recaptcha-secret',
            response: 'valid-token',
          },
        },
      )

      // Token was generated
      expect(mockedGenerateToken).toHaveBeenCalledWith(
        expect.anything(), // res object
        testUser._id,
      )
      expect(mockedGenerateToken).toHaveBeenCalledTimes(1)
    })
  })

  describe('validation errors', () => {
    it('should return 401 when recaptcha is missing', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'Test@example.com',
        password: 'Password123!',
        // Missing recaptcha
      })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Captcha inválido. Intenta nuevamente')
      expect(mockedAxios).not.toHaveBeenCalledTimes(1)
      expect(mockedGenerateToken).not.toHaveBeenCalledTimes(1)
    })

    it('should return 401 when email is missing', async () => {
      const response = await request(app).post('/api/users/login').send({
        password: 'Password123!',
        recaptchaToken: 'valid-token',
      })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Usuario e email requeridos')
    })

    it('should return 401 when password is missing', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'Test@example.com',
        recaptchaToken: 'valid-token',
      })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Usuario e email requeridos')
    })
  })

  describe('reCAPTCHA verification', () => {
    it('should return 403 when reCAPTCHA verification fails', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { success: false },
      })

      const response = await request(app).post('/api/users/login').send({
        email: 'Test@example.com',
        password: 'Password123!',
        recaptchaToken: 'invalid-token',
      })

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Verificación de CAPTCHA fallida')
      expect(mockedGenerateToken).not.toHaveBeenCalled()
    })
  })

  describe('authentication errors', () => {
    it('should return 400 when user is not found', async () => {
      const response = await request(app).post('/api/users/login').send({
        email: 'nonexistent@example.com',
        password: 'Password123!',
        recaptchaToken: 'valid-token',
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Credenciales inválidas')
    })

    it('should return 400 when password does not match', async () => {
      const hashedPassword = await hash('Password123!', 10)
      await User.create({
        name: 'Test User',
        email: 'Test@example.com',
        password: hashedPassword,
      })

      const response = await request(app).post('/api/users/login').send({
        email: 'Test@example.com',
        password: 'invalid-password',
        recaptchaToken: 'valid-token',
      })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Credenciales inválidas')
      expect(mockedGenerateToken).not.toHaveBeenCalled()
    })
  })
})

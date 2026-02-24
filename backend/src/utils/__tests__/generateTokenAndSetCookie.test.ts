import { Response } from 'express'
import { generateTokenAndSetCookie } from '../generateTokenAndSetCookie'
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')

describe('generateTokenAndSetCookie', () => {
  let mockResponse: Partial<Response>
  let mockUserId: mongoose.Types.ObjectId
  const mockToken = 'mock.jwt.token'
  const originalEnv = process.env

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()

    mockResponse = {
      cookie: jest.fn() as Response['cookie'],
    }

    mockUserId = new mongoose.Types.ObjectId();

    (jwt.sign as jest.Mock).mockReturnValue(mockToken)

    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment after tests
    process.env = originalEnv
  })

  describe('when JWT_SECRET exists', () => {
    beforeEach(() => {
      process.env.JWT_SECRET = 'test-secret-key'
    })

    it('should generate a JWT token with correct payload and correct expiration',
      () => {
        process.env.NODE_ENV = 'development' 

        generateTokenAndSetCookie(mockResponse as Response, mockUserId)

        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: mockUserId },
          'test-secret-key',
          { expiresIn: '7d' }
        )
        expect(jwt.sign).toHaveBeenCalledTimes(1)
      }
    )

    it('should set cookie with correct token value', () => {
      process.env.NODE_ENV = 'development'

      generateTokenAndSetCookie(mockResponse as Response, mockUserId)

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'token',
        mockToken,
        expect.any(Object)
      )
    })

    it('should return the generated token', () => {
      process.env.NODE_ENV = 'development' 

      const response = generateTokenAndSetCookie(mockResponse as Response, mockUserId)

      expect(response).toBe(mockToken)
    })

    describe('cookie options in development mode', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development'
      })

      it('should set cookie with correct security options', () => {
        generateTokenAndSetCookie(mockResponse as Response, mockUserId)

        expect(mockResponse.cookie).toHaveBeenCalledWith(
          'token',
          mockToken,
          {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
          }
        )
      })
    })

    describe('cookie options in production mode', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production'
      })

      it('should set cookie with production security options', () => {
        generateTokenAndSetCookie(mockResponse as Response, mockUserId)

        expect(mockResponse.cookie).toHaveBeenCalledWith(
          'token',
          mockToken,
          {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
          }
        )
      })
    })
  })

  describe('when JWT is missing', () => {
    beforeEach(() => {
      delete process.env.JWT_SECRET
    })

    it('should throw an error with correct message', () => {
      expect(() => {
        generateTokenAndSetCookie(mockResponse as Response, mockUserId)
      }).toThrow('No JWT Secret found')
    })

    it('should not call jwt.sign when JWT_SECRET is missing', () => {
      expect(() => {
        generateTokenAndSetCookie(mockResponse as Response, mockUserId)
      }).toThrow()

      expect(jwt.sign).not.toHaveBeenCalled()
    })
  })

})


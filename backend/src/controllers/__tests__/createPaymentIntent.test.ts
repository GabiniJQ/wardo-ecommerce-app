import {
  describe,
  it,
  jest,
  beforeAll,
  beforeEach,
  expect,
} from '@jest/globals'
import express, { Express } from 'express'
import { stripeService } from '../../services/stripeService'
import { orderService } from '../../services/orderService'
import { createPaymentIntent } from '../paymentController'
import { errorHandler } from '../../middlewares/errorMiddleware'
import request from 'supertest'
import mongoose from 'mongoose'
import Stripe from 'stripe'
import { IOrder } from '../../types/orderTypes'

jest.mock('../../services/stripeService', () => ({
  stripeService: {
    createPaymentIntent: jest.fn(),
  },
}))
jest.mock('../../services/orderService', () => ({
  orderService: {
    createOrder: jest.fn(),
  },
}))

const mockedCreatePaymentIntent =
  stripeService.createPaymentIntent as jest.MockedFunction<
    typeof stripeService.createPaymentIntent
  >
const mockedCreateOrder = orderService.createOrder as jest.MockedFunction<
  typeof orderService.createOrder
>

describe('createPaymentIntent', () => {
  let app: Express
  let mockOrderId: mongoose.Types.ObjectId
  let mockUserId: mongoose.Types.ObjectId

  beforeAll(async () => {
    mockUserId = new mongoose.Types.ObjectId()
    const mockAuthMiddleware = (req: any, res: any, next: any) => {
      req.user = { _id: mockUserId }
      next()
    }

    app = express()
    app.use(express.json())
    app.use(mockAuthMiddleware)
    app.post('/api/payments/create-payment-intent', createPaymentIntent)
    app.use(errorHandler)
  })

  beforeEach(() => {
    jest.resetAllMocks()

    mockedCreatePaymentIntent.mockResolvedValue({
      client_secret: 'client-secret',
      amount: 1000,
      currency: 'usd',
    } as Stripe.PaymentIntent)

    mockOrderId = new mongoose.Types.ObjectId()
    mockedCreateOrder.mockResolvedValue({
      _id: mockOrderId,
    } as IOrder)
  })

  describe('successfull payment intent created', () => {
    it('returns a response object with an status of 200', async () => {
      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          items: [
            {
              _id: new mongoose.Types.ObjectId(),
              productId: new mongoose.Types.ObjectId(),
              quantity: 2,
            },
          ],
          customerEmail: 'Test@example.com',
          shippingAddress: 'Example-address',
        })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        clientSecret: 'client-secret',
        amount: 1000,
        currency: 'usd',
        orderId: mockOrderId.toString(),
      })
    })

    it('should call orderService.createOrder with correct userId', async () => {
      await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          items: [
            {
              _id: new mongoose.Types.ObjectId(),
              productId: new mongoose.Types.ObjectId(),
              quantity: 2,
            },
          ],
          customerEmail: 'Test@example.com',
          shippingAddress: 'Example-address',
        })

      expect(mockedCreateOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          client_secret: 'client-secret',
          amount: 1000,
          currency: 'usd',
        }),
        mockUserId,
      )
    })
  })

  describe('data validation', () => {
    it('should return 400 if no payment data in the req body', async () => {
      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send()

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Información de pago no encontrada')
    })

    it('should return 400 if no customer email in payment data', async () => {
      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          items: [
            {
              _id: new mongoose.Types.ObjectId(),
              productId: new mongoose.Types.ObjectId(),
              quantity: 2,
            },
          ],
          shippingAddress: 'Example-address',
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Información de pago no válida')
    })

    it('should return 400 if no items in payment data', async () => {
      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          customerEmail: 'Test@example.com',
          shippingAddress: 'Example-address',
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Información de pago no válida')
    })

    it('should return 400 if no shipping address in payment data', async () => {
      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          items: [
            {
              _id: new mongoose.Types.ObjectId(),
              productId: new mongoose.Types.ObjectId(),
              quantity: 2,
            },
          ],
          customerEmail: 'Test@example.com',
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Información de pago no válida')
    })
  })
})

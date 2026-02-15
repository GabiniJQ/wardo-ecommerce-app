import express from 'express'
import { webhookController } from '../controllers/webhookController.js'

const webhookRoutes = express.Router()

// Webhook route must use raw body
webhookRoutes.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook.bind(webhookController),
)

export default webhookRoutes

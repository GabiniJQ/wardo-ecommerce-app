import express from 'express'
import { webhookController } from '../controllers/webhookController'

const router = express.Router()

// IMPORTANT: Webhook route must use raw body
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookController.handleStripeWebhook.bind(webhookController),
)

export default router

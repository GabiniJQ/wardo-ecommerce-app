import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'

export const validateCreatePaymentIntent = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Items must be a non-empty array'),
  body('items.*.id').isString().notEmpty().withMessage('Item ID is required'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('customerEmail')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }
    next()
  },
]

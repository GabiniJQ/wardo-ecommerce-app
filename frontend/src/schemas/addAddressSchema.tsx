import { z } from 'zod'

export const addAddressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Campo requerido')
    .max(100),
  addressType: z
    .enum(['hogar', 'trabajo', 'casillero'], {
      errorMap: () => ({ message: 'Tipo de dirección no válido'})
    }),
  addressInfo: z.object({
    street: z.string().trim().min(1, 'Campo requerido'),
    number1: z.string().trim().min(1, 'Campo requerido'),
    number2: z.string().trim().min(1, 'Campo requerido'),
    additionalInfo: z.string().trim().max(100),
    postalCode: z.string().trim().max(10, 'Longitud de código inválida'),
  }),
  department: z.string().min(1, 'Campo requerido'),
  city: z.string().min(1, 'Campo requerido'),
  phone: z
    .string()
    .regex(/^3\d{9}$/, 'Número inválido (debe comenzar con 3 y tener 10 dígitos)')
})
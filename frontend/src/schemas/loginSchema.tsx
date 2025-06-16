import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().trim().min(1, { message: 'E-mail requerido.' }).email({
    message: 'E-mail no válido.',
  }),
  password: z.string().trim().min(1, { message: 'Contraseña requerida.' }),
})

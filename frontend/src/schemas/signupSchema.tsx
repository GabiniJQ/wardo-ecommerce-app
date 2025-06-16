import { z } from 'zod'

export const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'E-mail requerido.' })
    .email({ message: 'Ingresa un e-mail válido.' })
    .max(254),
  password: z
    .string()
    .trim()
    .min(1, { message: 'Contraseña requerida.' })
    .regex(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/,
      {
        message:
          'La contraseña debe contener mínimo 8 caracteres y debe contener letras, números y caracteres especiales.',
      }
    )
    .max(72),
  name: z
    .string()
    .trim()
    .min(2, { message: 'Nombre del usuario requerido.' })
    .max(100),
})

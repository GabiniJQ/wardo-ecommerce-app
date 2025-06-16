import { z } from 'zod'

export const newPassSchema = z
  .object({
    currentPass: z
      .string()
      .min(1, 'Contraseña actual requerida')
      .max(72),
    newPass: z
      .string()
      .min(1, 'Contraseña nueva requerida')
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!-/:-@[-`{-~])[A-Za-z\d!-/:-@[-`{-~]+$/,
        {
          message: 'La contraseña debe contener mínimo 8 caracteres y debe contener letras, números y caracteres especiales'
        }
      )
      .max(72),
    newPassConfirmation: z
    .string()
    .min(1, 'Confirmación requerida')
    .max(72),
  })
  .refine((data) => data.newPass === data.newPassConfirmation, {
    path: ['newPassConfirmation'],
    message: 'Las contraseñas nuevas no coinciden',
  })
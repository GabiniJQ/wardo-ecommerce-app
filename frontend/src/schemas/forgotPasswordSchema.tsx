import { z } from 'zod'

const forgotPasswordSchema = z
  .string()
  .trim()
  .email('Email no válido')
  .nonempty('Campo requerido')
  
export default forgotPasswordSchema
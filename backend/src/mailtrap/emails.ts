import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from '@/mailtrap/emailTemplates'
import { mailtrapClient, sender } from '@/mailtrap/mailtrapConfig'

export const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const recipient = [{ email }]

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Verifica tu correo',
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        '{verificationCode}',
        verificationToken
      ),
      category: 'Email Verification',
    })

    console.log('Email sent successfully')
  } catch (error) {
    const err = new Error('Error interno al enviar correo de verificación') as Error & { statusCode?: number }
    err.statusCode = 500
    throw err
  }
}

export const sendWelcomeEmail = async (email: string, name: string) => {
  const recipient = [{ email }]

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: '4be00242-28d4-4a8f-b9b8-daf118569588',
      template_variables: {
        name: name,
      },
    })

    console.log('Welcome email sent successfully', response)
  } catch (error) {
    const err = new Error('Error interno al enviar correo de bienvenida') as Error & { statusCode?: number }
    err.statusCode = 500
    throw err
  }
}

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
  const recipient = [{ email }]

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Cambio de contraseña',
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
      category: 'Password Reset',
    })
  } catch (error) {
    const err = new Error('Error interno al enviar correo de reinicio') as Error & { statusCode?: number }
    err.statusCode = 500
    throw err
  }
}

export const sendResetSuccessEmail = async (email: string) => {
  const recipient = [{ email }]

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: 'Cambio de contraseña exitoso',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: 'Password Reset',
    })

    console.log('Password reset email sent successfully', response)
  } catch (error) {
    const err = new Error('Error interno al enviar correo de reinicio exitoso') as Error & { statusCode?: number }
    err.statusCode = 500
    throw err
  }
}

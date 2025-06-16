import { MailtrapClient } from 'mailtrap'
import dotenv from 'dotenv'

dotenv.config()

const token = process.env.MAILTRAP_TOKEN

if (!token) {
  throw new Error('MAILTRAP_TOKEN is not defined in the environment variables')
}

export const mailtrapClient = new MailtrapClient({
  token: token,
})

export const sender = {
  email: 'hello@demomailtrap.co',
  name: 'Wardo',
}

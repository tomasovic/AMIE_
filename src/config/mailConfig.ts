import * as dotenv from 'dotenv'
import {MailConfig} from '../types/types'

dotenv.config()

export const mailConfig: MailConfig = {
    connection: process.env.MAIL_CONNECTION || 'smtp',
    from: process.env.SENDGRID_FROM_EMAIL,

    smtp: {
        driver: 'smtp',
        host: process.env.SENDGRID_HOST,
        port: process.env.SENDGRID_PORT,
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_API_KEY
        }
    }
}
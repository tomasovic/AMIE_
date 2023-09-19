import * as dotenv from 'dotenv'

dotenv.config()

export const appConfig = {
    port: process.env.PORT!,
    jwtKey: process.env.JWT_KEY!,
    appEnv: process.env.APP_ENV || 'development',
}
import * as dotenv from 'dotenv'
dotenv.config()

export const redisConfig = {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT!) || 6379,
    password: process.env.REDIS_PASSWORD!,
    db: 0
}
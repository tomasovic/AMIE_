import Redis from 'ioredis'
import {redisConfig} from '../../config/redisConfig'
import * as dotenv from 'dotenv'
dotenv.config()

export const redis = new Redis(redisConfig)
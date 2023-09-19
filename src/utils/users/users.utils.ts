import * as dotenv from 'dotenv'
import client from '../../api/client'
import {appConfig} from '../../config/appConfig'
import fileLogger from '../../utils/logger/logger'
import jwt from 'jsonwebtoken'

dotenv.config()

export const getUser = async (token: string) => {
    try {
        if (!token) {
            return null
        }

        const verifiedToken: any = jwt.verify(token, appConfig.jwtKey)
        if ('userId' in verifiedToken) {
            const user = await client.user.findUnique({
                where: {
                    id: verifiedToken['userId'],
                },
            })
            return user ? user : null
        }
    } catch (error: any) {
        fileLogger.error(error?.message)
        console.log('🛑', error)
        return null
    }
}

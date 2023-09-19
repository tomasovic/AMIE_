import * as dotenv from 'dotenv'
import fileLogger from '../utils/logger/logger'

dotenv.config()

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID!,
        authority: process.env.CLOUD_INSTANCE! + process.env.TENANT_ID!,
        clientSecret: process.env.CLIENT_SECRET!
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel: any, message: any, containsPii: any) {
                fileLogger.info(message)
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
}

const REDIRECT_URI = process.env.REDIRECT_URI!
const POST_LOGOUT_REDIRECT_URI = process.env.POST_LOGOUT_REDIRECT_URI!
const GRAPH_ME_ENDPOINT = process.env.GRAPH_API_ENDPOINT! + 'v1.0/me'

export default {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT
}
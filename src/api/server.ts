import {ApolloServer} from '@apollo/server'
import schema from './schema'
import {appConfig} from '../config/appConfig'
import {formatError} from '../utils/errors/formattingErrors'
import Scheduler from '../scheduler'
import setupPassport from '../lib/passport/passport'
import * as dotenv from 'dotenv'
import * as process from 'process'
import express from 'express'
import * as http from 'http'
import {expressMiddleware} from '@apollo/server/express4'
import bodyParser from 'body-parser'
import {UserContext} from '../types/types'
import {getUser} from '../utils/users/users.utils'
import client from './client'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

dotenv.config()

export class Server {
    public app: express.Application = express()

    constructor(app?: express.Application) {
        this.app = app || express()
    }

    public createServer = async (): Promise<void> => {
        Scheduler.runTasks()

        const passport = setupPassport({JWT_KEY: process.env.JWT_KEY!})
        const httpServer = http.createServer(this.app)
        const server = new ApolloServer<UserContext>({
            schema,
            status400ForVariableCoercionErrors: true,
            includeStacktraceInErrorResponses: appConfig.appEnv === 'development',
            formatError,
            plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        })

        await server.start()

        this.app.use(passport.initialize())

        this.app.use('/', bodyParser.json(), expressMiddleware(server,
            {
                context: async ({req, res}) => {
                    const loggedInUser = await getUser(req.headers.authorization as string)
                    const jsonError = !!req.headers.accept?.includes('application/json')

                    return {
                        loggedInUser,
                        client,
                        jsonError,
                    } as UserContext

                    // if we want to use passport.js
                    // return buildContext({req, res})
                },
            }
        ))

        await new Promise<void>((resolve) => httpServer.listen(3000, resolve));
        console.log(`🚀 Server ready at http://localhost:3000`)
    }
}
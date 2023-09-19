import {GraphQLError} from 'graphql'

export class BaseException extends GraphQLError {
    statusCode: number

    constructor(message: string, statusCode: number = 500) {
        super(message)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'INTERNAL_SERVER_ERROR',
                http: {status: statusCode},
            },
        })
    }
}
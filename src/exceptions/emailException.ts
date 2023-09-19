import {BaseException} from './baseException'

export class EmailException extends BaseException {
    constructor(message = 'Wrong connection type.', statusCode = 500) {
        super(message, statusCode)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'EMAIL_CONNECTION_TYPE',
                http: {status: statusCode},
            },
        })
    }
}
import {BaseException} from './baseException'

export class UnauthenticatedException extends BaseException {
    constructor(message = 'You need to be authenticated for this action.', statusCode = 401) {
        super(message, statusCode)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'UNAUTHENTICATED',
                http: {status: statusCode},
            },
        })
    }
}
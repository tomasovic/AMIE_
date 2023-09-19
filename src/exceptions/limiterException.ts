import {BaseException} from './baseException'

export class LimiterException extends BaseException {
    constructor(message = 'You have exceeded number of queries. Try again later!', statusCode = 429) {
        super(message, statusCode)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'EXCEEDED_QUERIES_LIMIT',
                http: {status: statusCode},
            },
        })
    }
}
import {BaseException} from './baseException'

export class CronException extends BaseException {
    constructor(message = 'Cron job didnt finish.', statusCode = 301) {
        super(message, statusCode)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'CRON_EXCEPTION',
                http: {status: statusCode},
            },
        })
    }
}
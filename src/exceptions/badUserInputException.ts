import {BaseException} from './baseException'

export class BadUserInputException extends BaseException {
    constructor(argumentName: string, message: string = 'Invalid argument value', statusCode: number = 422) {
        super(message)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'BAD_USER_INPUT',
                argumentName,
                http: {status: statusCode},
            },
        })
    }
}

import {BaseException} from './baseException'

export class EntityMissingException extends BaseException {
    constructor(message: string, statusCode: number = 400) {
        super(message)

        Object.defineProperty(this, 'extensions', {
            configurable: true,
            enumerable: true,
            value: {
                code: 'ENTITY_MISSING',
                http: {status: statusCode},
            },
        })
    }
}
import {UnauthenticatedException} from '../../../src/exceptions/unauthenticatedException'

describe('UnauthenticatedException', () => {
    it('should create an instance of UnauthenticatedException with default values', () => {
        const exception = new UnauthenticatedException('You need to be authenticated for this action.',
            401)

        expect(exception.message).toBe('You need to be authenticated for this action.')
        expect(exception.extensions).toEqual({
            code: 'UNAUTHENTICATED',
            http: {status: 401},
        })
    })

    it('should create an instance of UnauthenticatedException with custom message and status code', () => {
        const customMessage = 'Custom unauthenticated message'
        const customStatusCode = 403

        const exception = new UnauthenticatedException(customMessage, customStatusCode)

        expect(exception.message).toBe(customMessage)
        expect(exception.extensions).toEqual({
            code: 'UNAUTHENTICATED',
            http: {status: customStatusCode},
        })
    })
})

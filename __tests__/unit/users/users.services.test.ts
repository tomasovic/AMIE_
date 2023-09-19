import {PrismaClient} from '@prisma/client'
import {userServices} from '../../../src/api/users/services/user.services'
import {findUserByEmail} from '../../../src/api/users/model/user.model'
import {EntityMissingException} from '../../../src/exceptions/entityMissingException'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import {UnauthenticatedException} from '../../../src/exceptions/unauthenticatedException'

jest.mock('bcryptjs')
jest.mock('jsonwebtoken')
jest.mock('../../../src/api/users/model/user.model')
jest.mock('../../../src/api/client')

describe('login function', () => {
    let mockClient: PrismaClient

    beforeEach(() => {
        mockClient = {} as unknown as PrismaClient
        jest.clearAllMocks()

    })

    it('should throw an error if user not found', async () => {
        (findUserByEmail as jest.Mock).mockResolvedValueOnce(null)
        try {
            await userServices.login({email: 'amie@amie.co', password: 'amie'})
        } catch (error) {
            expect(error).toBeInstanceOf(EntityMissingException)
        }
    })

    it('should return user data when email and password are correct', async () => {
        const mockUser = {
            id: 1,
            email: 'johndoe@example.com',
            password: '$2a$10$hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcryptjs.compare as jest.Mock).mockResolvedValue(true)

        const jwtToken = 'mockJwtToken';
        (jwt.sign as jest.Mock).mockReturnValue('mockJwtToken')


        const input = {email: 'johndoe@example.com', password: 'plainPassword'}
        const result = await userServices.login(input)

        expect(result).toEqual({
            user: mockUser,
            jwt: jwtToken,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt,
        })
        expect(findUserByEmail).toBeCalledTimes(1)
    })

    it('should throw an UnauthenticatedException when password is incorrect', async () => {
        const mockUser = {
            id: 1,
            email: 'johndoe@example.com',
            password: '$2a$10$hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        (findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

        (bcryptjs.compare as jest.Mock).mockResolvedValue(false)

        const input = {email: 'johndoe@example.com', password: 'wrongPassword'}

        await expect(userServices.login(input)).rejects.toThrow(UnauthenticatedException)
        await expect(userServices.login(input)).rejects.toThrow('Wrong credentials')
    })
})

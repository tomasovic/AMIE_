import {PrismaClient} from '@prisma/client'
import {userServices} from '../../src/api/users/services/user.services'
import {EntityMissingException} from '../../src/exceptions/entityMissingException'
import {UnauthenticatedException} from '../../src/exceptions/unauthenticatedException'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

describe('Integration Test: login function', () => {
    let testUserId: number
    let testUserEmail: string
    let testFirstName: string
    let testLastName: string

    beforeAll(async () => {
        await prisma.todo.deleteMany()
        await prisma.user.deleteMany()

        const hashedPassword = await bcryptjs.hash('amie', 10)

        const user = await prisma.user.create({
            data: {
                email: 'amie@amie.co',
                password: hashedPassword,
                firstName: 'Amie',
                lastName: 'Amie',
            },
        })

        testUserId = user.id
        testUserEmail = user.email
        testFirstName = user.firstName!
        testLastName = user.lastName!
    })

    afterAll(async () => {
        if (testUserId !== undefined) {
            await prisma.todo.deleteMany({
                where: {
                    userId: testUserId,
                },
            })

            if (testUserEmail !== 'amie@amie.co') {
                await prisma.user.delete({
                    where: {id: testUserId},
                })
            }
        }

        await prisma.$disconnect()
    })

    it('should throw an error if user not found', async () => {
        await expect(
            userServices.login({
                email: 'noone@nowhere.com',
                password: 'wrongPassword',
            })
        ).rejects.toThrow(EntityMissingException)
    })

    it('should throw an error when password is incorrect', async () => {
        await expect(
            userServices.login({
                email: 'amie@amie.co',
                password: 'wrongPassword',
            })
        ).rejects.toThrow(UnauthenticatedException)
    })

    it('should return user data when email and password are correct', async () => {
        const result = await userServices.login({
            email: 'amie@amie.co',
            password: 'amie',
        })

        expect(result).toHaveProperty('user')
        expect(result).toHaveProperty('jwt')
        expect(result).toHaveProperty('createdAt')
        expect(result).toHaveProperty('updatedAt')
    })
})
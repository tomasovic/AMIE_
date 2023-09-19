import request from 'supertest'
import bcrypt from 'bcryptjs'
import {Server} from '../../src/api/server'
import {Application} from 'express'
import {PrismaClient} from '@prisma/client'

const client = new PrismaClient()
let app: Application

describe('E2E Tests for GraphQL User API', () => {
    let testUserId: number
    let testUserEmail: string = 'amie@amie.co'
    let testUserPassword: string = 'amie'

    beforeAll(async () => {
        const serverInstance = new Server()
        await serverInstance.createServer()
        app = serverInstance.app

        try {
            await client.user.deleteMany()
        } catch (error) {
            console.error('Error:', error)
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(testUserPassword, salt)
        
        try {
            const user = await client.user.create({
                data: {
                    email: testUserEmail,
                    password: hashedPassword,
                },
            })

            testUserId = user.id
        } catch (error) {
            console.error('Error:', error)
        }
    })

    afterAll(async () => {  
        await client.user.deleteMany()
        await client.$disconnect()
    })

    it('should get the status 200', async () => {
        const response = await request(app).get('/graphql')
        expect(response.status).toBe(200)
    })

    // xit('should login the user', async () => {
    //     const query = `
    //   mutation {
    //     login(email: "${testUserEmail}", password: "${testUserPassword}") {
    //       jwt
    //     }
    //   }
    // `
    //
    //     const response = await request(app)
    //         .post('/graphql')
    //         .send({query})
    //
    //     expect(response.status).toBe(200)
    //     expect(response.body.data.login).toHaveProperty('jwt')
    // })
    //
    // xit('should not login with wrong password', async () => {
    //     const query = `
    //   mutation {
    //     login(email: "${testUserEmail}", password: "wrongPassword") {
    //       jwt
    //     }
    //   }
    // `
    //
    //     const response = await request(app)
    //         .post('/graphql')
    //         .send({query})
    //
    //     expect(response.status).toBe(200)
    //     expect(response.body.errors).toBeTruthy()
    // })
})

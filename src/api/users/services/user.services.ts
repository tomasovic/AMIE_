import {PrismaClient} from '@prisma/client'
import {
    AuthResponse,
    CreateUserInput,
    List,
    LoginUserInput,
    ThirdPartyAccount,
    Todo,
    UpdateUserInput,
    User
} from 'src/types/resolvers-types'
import {
    createUser,
    findManyUsers,
    findUserByEmail,
    findUserById,
    getListsByUserId,
    getThirdPartyAccountsByUserId,
    getTodosByUserId,
    getTotalListsByUserId,
    getTotalTodosByUserId,
    updateUser,
} from '../model/user.model'
import client from '../../client'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import {appConfig} from '../../../config/appConfig'
import {BaseException} from '../../../exceptions/baseException'
import {EntityMissingException} from '../../../exceptions/entityMissingException'
import {UnauthenticatedException} from '../../../exceptions/unauthenticatedException'
import Mail from '../../../utils/mail'
import {Message} from '../../../utils/mail/message'
import {mailConfig} from '../../../config/mailConfig'
import validator from 'validator'
import {BadUserInputException} from '../../../exceptions/badUserInputException'

class UserServices {
    constructor(private readonly client: PrismaClient) {
        this.client = client
    }

    public async getAllUsers(): Promise<User[]> {
        return await findManyUsers(this.client)
    }

    public async getUserById(userId: number): Promise<User | null> {
        return await findUserById(userId, this.client)
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return await findUserByEmail(email, this.client)
    }

    public async getTotalLists(userId: number): Promise<number> {
        return getTotalListsByUserId(userId, this.client)
    }

    public async getTotalTodos(userId: number): Promise<number> {
        return getTotalTodosByUserId(userId, this.client)
    }

    public async getTodosByUserId(userId: number): Promise<Todo[] | null> {
        return getTodosByUserId(userId, this.client)
    }

    public async getListsByUserId(userId: number): Promise<List[] | null> {
        return getListsByUserId(userId, this.client)
    }

    public async signUpUser(input: CreateUserInput): Promise<AuthResponse> {

        if (!validator.isEmail(input.email) || !validator.normalizeEmail(input.email, {all_lowercase: true})) {
            throw new BadUserInputException('email', 'Email is not valid')
        }

        const hashedPassword = await bcryptjs.hash(input.password, 10)

        const cleanedInput = {
            ...input,
            email: input.email.toLowerCase(),
            password: hashedPassword,
            firstName: input.firstName ? validator.escape(input.firstName.trim()) : '',
            lastName: input.lastName ? validator.escape(input.lastName?.trim()) : '',
        }

        const user = await createUser({
            ...cleanedInput,
        }, this.client)
        if (!user) {
            throw new BaseException('User creation failed', 400)
        }

        const jwtPayload = {email: user.email, userId: user.id}
        const jwtToken = jwt.sign(jwtPayload, appConfig.jwtKey,
            {expiresIn: '1d'})

        await Mail.send((message: Message) => {
            message
                .from(mailConfig.from!)
                .to(user.email)
                .subject('Email verification for AMIE Todo App')
                .text('Welcome to AMIE Todo App!')
                .with({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                })
        })

        return {
            user: {
                ...user,
            },
            jwt: jwtToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }

    public async login(input: LoginUserInput): Promise<AuthResponse> {
        const {email, password} = input

        const user = await findUserByEmail(email, this.client)
        if (!user) {
            throw new EntityMissingException('User not found', 404)
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            throw new UnauthenticatedException('Wrong credentials',)
        }

        const jwtPayload = {email: user.email, userId: user.id}
        const jwtToken = jwt.sign(jwtPayload, appConfig.jwtKey, {expiresIn: '1d'})

        return {
            user: {
                ...user,
            },
            jwt: jwtToken,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    };

    public async updateUser(input: UpdateUserInput, loggedInUser: number): Promise<User> {
        if (input.password) {
            input.password = await bcryptjs.hash(input.password, 10)
        }

        const cleanedInput = {
            ...input,
            password: input.password,
            firstName: input.firstName ? validator.escape(input.firstName.trim()) : '',
            lastName: input.lastName ? validator.escape(input.lastName?.trim()) : '',
        }

        const updatedUser = await updateUser(cleanedInput, loggedInUser, this.client)
        if (!updatedUser) {
            throw new EntityMissingException('User not found', 404)
        }

        return updatedUser
    };

    public async getThirdPartyAccounts(userId: number): Promise<ThirdPartyAccount[] | null> {
        return await getThirdPartyAccountsByUserId(userId, this.client)
    }
}


export const userServices = new UserServices(client)
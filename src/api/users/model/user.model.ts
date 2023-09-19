import {PrismaClient} from '@prisma/client'
import {
    CreateUserInput,
    List,
    Maybe,
    ThirdPartyAccount,
    ThirdPartyAccountInput,
    UpdateUserInput,
    User
} from '../../../types/resolvers-types'
import {CustomUser, GQLList, GQLTodo, GQLUser, UserWithPassword} from '../../../types/types'
import {EntityMissingException} from '../../../exceptions/entityMissingException'
import bcryptjs from 'bcryptjs'

const toGQLList = (list: List): GQLList => {
    return <List & { user: CustomUser }>{
        ...list,
        user: toCustomUser(list.user),
        createdAt: list.createdAt.toString(),
        updatedAt: list.updatedAt.toString(),
    }
}
const toCustomUser = (user: Maybe<User> | undefined): CustomUser | null => {
    if (!user) return null
    return {
        ...user,
        isMe: false,
        totalLists: 0,
        totalTodos: 0
    }
}

/**
 * Find all users
 * @param client
 */
export const findManyUsers = async (client: PrismaClient): Promise<GQLUser[]> => {
    const users = await client.user.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })

    if (users) {
        //@ts-ignore - docker prisma bug
        return users.map((user) => ({
            ...user,
            isMe: false,
            lists: [],
            todos: [],
            totalLists: 0,
            totalTodos: 0,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }))
    }

    return []
}


/**
 * Find user by id
 * @param userId
 * @param client
 */
export const findUserById = async (userId: number, client: PrismaClient): Promise<GQLUser | null> => {
    const user = await client.user.findUnique({
        where: {
            id: userId,
        },
        // include: {
        //     lists: true,
        //     todos: true,
        // }
    })

    if (user) {
        return {
            ...user,
            isMe: false,
            lists: [],
            todos: [],
            totalLists: 0,
            totalTodos: 0,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        }
    }

    return null
}

/**
 * Get total lists by user id
 * @param userId
 * @param client
 */
export const getTotalListsByUserId = async (userId: number, client: PrismaClient): Promise<number> => {
    return client.list.count({
        where: {
            userId,
        },
    })
}

/**
 * Get total todos by user id
 * @param userId
 * @param client
 */
export const getTotalTodosByUserId = async (userId: number, client: PrismaClient): Promise<number> => {
    return client.todo.count({
        where: {
            userId,
        },
    })
}

/**
 * Get todos by user id
 * @param userId
 * @param client
 */
export const getTodosByUserId = async (userId: number, client: PrismaClient): Promise<GQLTodo[] | null> => {
    const todos = await client.todo.findMany({
        where: {
            userId,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    if (todos) {
        //@ts-ignore - docker prisma bug
        return todos.map((todo) => ({
            ...todo,
            subtasks: [],
            User: todo.user || null,
        })) as unknown as GQLTodo[]
    }

    return null
}

/**
 * Get lists by user id
 * @param userId
 * @param client
 */
export const getListsByUserId = async (userId: number, client: PrismaClient): Promise<GQLList[] | null> => {
    const lists = await client.list.findMany({
        where: {
            userId,
        },
        include: {
            user: true,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })
    if (lists) {
        // @ts-ignore
        return lists.map(toGQLList)
    }

    return null
}

/**
 * Create user
 * @param input
 * @param client
 */
export const createUser = async (input: CreateUserInput, client: PrismaClient): Promise<User | null> => {
    const existingUser = await client.user.findUnique({
        where: {
            email: input.email,
        },
    })
    if (existingUser) {
        throw new EntityMissingException('User already exists.')
    }

    const user = await client.user.create({
        data: input,
    })

    return {
        ...user,
    } as unknown as User
}

/**
 * Find user by email
 * @param email
 * @param client
 */
export const findUserByEmail = async (email: string, client: PrismaClient): Promise<UserWithPassword | null> => {
    const user = await client.user.findUnique({
        where: {
            email,
        },
    })
    if (!user) {
        return null
    }

    return {
        ...user,
        password: user.password,
    } as unknown as UserWithPassword
}

/**
 * Update user
 * @param input
 * @param userId
 * @param client
 */
export const updateUser = async (input: UpdateUserInput, userId: number, client: PrismaClient): Promise<User | null> => {
    const user = await client.user.findUnique({
            where: {
                id: userId,
            },
            include: {thirdPartyAccounts: true},
        }
    )
    if (!user) {
        return null
    }

    const updatedUser = await client.user.update({
        where: {id: userId},
        data: {
            firstName: input.firstName,
            lastName: input.lastName,
        }
    })

    if (input.thirdPartyAccount) {
        if (input.thirdPartyAccount.externalId) {
            input.thirdPartyAccount.externalId = await bcryptjs.hash(input.thirdPartyAccount.externalId, 10)
        }

        if (input.thirdPartyAccount.accessToken) {
            input.thirdPartyAccount.accessToken = await bcryptjs.hash(input.thirdPartyAccount.accessToken, 10)
        }

        if (input.thirdPartyAccount.refreshToken) {
            input.thirdPartyAccount.refreshToken = await bcryptjs.hash(input.thirdPartyAccount.refreshToken, 10)
        }

        const existingThirdPartyAccount = await client.thirdPartyAccount.findFirst({
            where: {userId},
        })

        const thirdPartyData: ThirdPartyAccountInput = input.thirdPartyAccount

        if (existingThirdPartyAccount) {
            await client.thirdPartyAccount.update({
                where: {id: existingThirdPartyAccount.id},
                //@ts-ignore
                data: {...thirdPartyData},
            })
        } else {
            await client.thirdPartyAccount.create({
                //@ts-ignore
                data: {
                    ...thirdPartyData,
                    userId,
                },
            })
        }
    }

    return updatedUser as unknown as User
}

/**
 * Get third party accounts by user id
 * @param userId
 * @param client
 */
export const getThirdPartyAccountsByUserId = async (userId: number, client: PrismaClient): Promise<ThirdPartyAccount[] | null> => {
    const thirdPartyAccounts = await client.thirdPartyAccount.findMany({
        where: {
            userId
        },
    })
    if (thirdPartyAccounts.length === 0) {
        return null
    }

    return thirdPartyAccounts as unknown as ThirdPartyAccount[]
}

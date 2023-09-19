import {PrismaClient} from '@prisma/client'
import {CreateListInput, List, Todo, UpdateListInput, User} from '../../../types/resolvers-types'
import fileLogger from '../../../utils/logger/logger'

/**
 * Get all lists for a user
 * @param userId
 * @param client
 */
export const getAllUserLists = async (userId: number, client: PrismaClient): Promise<List[] | null> => {
    const lists = await client.list.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (lists.length === 0) {
        return null
    }

    return lists as unknown as List[]
}

/**
 * Get a list by id
 * @param listId
 * @param userId
 * @param client
 */
export const getUserListById = async (listId: number, userId: number, client: PrismaClient): Promise<List | null> => {
    const list = await client.list.findFirst({
        where: {
            AND: [
                {
                    id: listId
                },
                {
                    userId
                }
            ]
        }
    })
    if (!list) {
        return null
    }

    return list as unknown as List
}

/**
 * Get a user by list id
 * @param listId
 * @param userId
 * @param client
 */
export const getListUser = async (listId: number, userId: number, client: PrismaClient): Promise<User | null> => {
    const list = await client.list.findFirst({
        where: {
            AND: [
                {
                    id: listId
                },
                {
                    userId
                }
            ]
        }
    })
    if (!list || list.userId === null) {
        return null
    }

    const user = await client.user.findFirst({
        where: {
            id: list.userId
        }
    })

    return user as unknown as User
}

/**
 *  Get all todos for a list
 * @param listId
 * @param userId
 * @param client
 */
export const getListTodos = async (listId: number, userId: number, client: PrismaClient): Promise<Todo[] | null> => {
    const list = await client.list.findFirst({
        where: {
            AND: [
                {
                    id: listId
                },
                {
                    userId
                }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    if (!list) {
        return null
    }

    const todos = await client.todo.findMany({
        where: {
            listId: list.id
        }
    })

    return todos as unknown as Todo[]
}

/**
 * Update list
 * @param listId
 * @param input
 * @param userId
 * @param client
 */
export const updateList = async (listId: number, input: UpdateListInput, userId: number, client: PrismaClient): Promise<List | null> => {
    const list = await client.list.findFirst({
        where: {
            AND: [
                {
                    id: listId
                },
                {
                    userId
                }
            ]
        }
    })
    if (!list) {
        return null
    }

    const updatedList = await client.list.update({
        where: {
            id: listId
        },
        //@ts-ignore
        data: {
            ...input
        }
    })

    return updatedList as unknown as List
}

/**
 * Create list
 * @param input
 * @param userId
 * @param client
 */
export const createList = async (input: CreateListInput, userId: number, client: PrismaClient): Promise<List | null> => {
    const list = await client.list.create({
        data: {
            ...input,
            userId
        }
    })
    if (!list) {
        return null
    }

    return list as unknown as List
}

/**
 * Delete list
 * @param listId
 * @param userId
 * @param client
 */
export const deleteList = async (listId: number, userId: number, client: PrismaClient): Promise<boolean> => {
    const list = await client.list.findFirst({
        where: {
            AND: [
                {
                    id: listId
                },
                {
                    userId
                }
            ]
        }
    })
    if (list) {
        await client.list.delete({
            where: {
                id: listId
            }
        })

        fileLogger.info(`List with id ${listId} deleted.`, {loggedIdUser: userId})

        return true
    }

    return false
}

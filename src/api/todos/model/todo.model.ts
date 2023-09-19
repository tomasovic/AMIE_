import {PrismaClient} from '@prisma/client'
import {CreateTodoInput, List, Subtask, Todo, UpdateTodoInput} from '../../../types/resolvers-types'
import fileLogger from '../../../utils/logger/logger'
import {Options, TodoWithUserId} from '../../../types/types'


/**
 * Get todo by id
 * @param todoId
 * @param loggedInUser
 * @param client
 */
export const getTodoById = async (todoId: number, loggedInUser: number, client: PrismaClient): Promise<TodoWithUserId | null> => {
    const todo = await client.todo.findFirst({
        where:
            {
                AND: [
                    {
                        id: todoId
                    },
                    {
                        userId: loggedInUser
                    },
                    {
                        deletedAt: null
                    }
                ]
            }
    })
    if (!todo) {
        return null
    }

    return {
        ...todo,
        userId: todo.userId
    } as unknown as TodoWithUserId
}

/**
 * Get all todos for a user
 * @param userId
 * @param client
 * @param options
 */
export const getAllUserTodos = async (userId: number, client: PrismaClient, options: Options): Promise<TodoWithUserId[] | null> => {
    const {cursor, take, done, status} = options || {}
    const todos = await client.todo.findMany({
        where: {
            AND: [
                {
                    userId
                },
                {
                    deletedAt: null
                },
                {
                    done
                },
                {
                    status
                }
            ]
        },
        orderBy: [
            {
                createdAt: 'asc'
            },
            {
                id: 'asc'
            }],
        cursor: cursor ? {id: cursor} : undefined,
        take: take || parseInt(process.env.PAGE_TAKE!),
        skip: cursor ? 1 : 0
    })
    if (todos.length === 0) {
        return null
    }

    // @ts-ignore - docker prisma bug
    return todos.map((todo) => {
        return {
            ...todo,
            userId: todo.userId
        } as unknown as TodoWithUserId
    })
}

/**
 * Get all todo subtasks for the user
 * @param todoId
 * @param loggedInUserId
 * @param client
 */
export const getTodoSubtasks = async (todoId: number, loggedInUserId: number, client: PrismaClient): Promise<Subtask[] | null> => {
    const todo = await client.todo.findFirst({
        where: {
            AND: [
                {
                    id: todoId
                },
                {
                    userId: loggedInUserId
                },
                {
                    deletedAt: null
                }
            ]
        }
    })
    if (!todo) {
        return null
    }

    const subtasks = await client.subtask.findMany({
        where: {
            todoId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return subtasks as unknown as Subtask[]
}

/**
 * Get todo list
 * @param todoId
 * @param loggedInUserId
 * @param client
 */
export const getTodoList = async (todoId: number, loggedInUserId: number, client: PrismaClient): Promise<List | null> => {
    const todo = await client.todo.findFirst({
        where: {
            AND: [
                {
                    id: todoId
                },
                {
                    userId: loggedInUserId
                },
                {
                    deletedAt: null
                }
            ]
        }
    })
    if (!todo) {
        return null
    }

    const list = await client.list.findFirst({
            where: {
                userId: loggedInUserId,
            }
        }
    )

    return list as unknown as List
}

/**
 * Create todo
 * @param input
 * @param userId
 * @param client
 */
export const createTodo = async (input: CreateTodoInput, userId: number, client: PrismaClient): Promise<Todo> => {
    const todo = await client.todo.create({
        data: {
            ...input,
            userId
        }
    })

    return todo as unknown as Todo
}

/**
 * Update todo
 * @param todoId
 * @param input
 * @param loggedInUserId
 * @param client
 */
export const updateTodo = async (todoId: number, input: UpdateTodoInput, loggedInUserId: number, client: PrismaClient): Promise<Todo | null> => {
    const todo = await client.todo.findFirst({
        where: {
            AND: [
                {
                    id: todoId
                },
                {
                    userId: loggedInUserId
                },
                {
                    deletedAt: null
                }
            ]
        }
    })
    if (!todo) {
        return null
    }

    const updatedTodo = await client.todo.update({
        where: {
            id: todoId
        },
        // @ts-ignore
        data: {
            ...input,
            done: input.status === 'DONE'
        }
    })
    if (!updatedTodo) {
        return null
    }

    return updatedTodo as unknown as Todo
}

/**
 * Delete todo
 * @param todoId
 * @param loggedInUserId
 * @param client
 */
export const deleteTodo = async (todoId: number, loggedInUserId: number, client: PrismaClient): Promise<boolean | null> => {
    const todo = await client.todo.findFirst({
        where: {
            AND: [
                {
                    id: todoId
                },
                {
                    userId: loggedInUserId
                },
                {
                    deletedAt: null
                }
            ]
        }
    })

    if (todo) {
        // await client.todo.delete({
        //     where: {
        //         id: todoId
        //     }
        // })
        await client.todo.update({
            where: {
                id: todoId
            },
            data: {
                // @ts-ignore
                deletedAt: new Date()
            }
        })

        fileLogger.info(`Todo with id ${todoId} deleted.`, {loggedInUserId})

        return true
    }

    return false
}
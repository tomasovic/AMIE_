import {PrismaClient} from '@prisma/client'
import {CreateSubtaskInput, Subtask, Todo, UpdateSubtaskInput} from '../../../types/resolvers-types'
import {getTodoById} from '../../todos/model/todo.model'
import fileLogger from '../../../utils/logger/logger'

/**
 * Get todo from subtask
 * @param subtaskId
 * @param loggedInUser
 * @param client
 */
export const getTodoFromSubtask = async (subtaskId: number, loggedInUser: number, client: PrismaClient): Promise<Todo | null> => {
    const subtask = await client.subtask.findUnique({
        where: {
            id: subtaskId
        }
    })
    if (!subtask) {
        return null
    }

    const todo = await client.todo.findFirst({
        where: {
            AND: [
                {
                    id: subtask.todoId
                },
                {
                    userId: loggedInUser
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
    } as unknown as Todo
}

/**
 * Get subtask by id
 * @param subtaskId
 * @param loggedInUser
 * @param client
 */
export const getSubtaskById = async (subtaskId: number, loggedInUser: number, client: PrismaClient): Promise<Subtask | null> => {
    const subtask = await client.subtask.findFirst({
        where: {
            AND: [
                {
                    id: subtaskId
                }
            ]
        }
    })
    if (!subtask) {
        return null
    }

    const todo = await getTodoById(subtask.todoId, loggedInUser, client)
    if (!todo) {
        return null
    }

    return subtask as unknown as Subtask
}

/**
 * Create todo subtask
 * @param input
 * @param loggedInUser
 * @param client
 */
export const createTodoSubtask = async (input: CreateSubtaskInput, loggedInUser: number, client: PrismaClient): Promise<Subtask | null> => {
    const todo = await getTodoById(input.todoId, loggedInUser, client)
    if (!todo) {
        return null
    }

    const subtask = await client.subtask.create({
        data: {
            ...input,
            todoId: input.todoId
        }
    })
    if (!subtask) {
        return null
    }

    return subtask as unknown as Subtask
}

/**
 * Update todo subtask
 * @param subtaskId
 * @param input
 * @param loggedInUser
 * @param client
 */
export const updateTodoSubtask = async (subtaskId: number, input: UpdateSubtaskInput,
                                        loggedInUser: number, client: PrismaClient): Promise<Subtask | null> => {
    const todo = await getTodoFromSubtask(subtaskId, loggedInUser, client)
    if (!todo) {
        return null
    }

    const subtask = await client.subtask.update({
        where: {
            id: subtaskId
        },
        //@ts-ignore
        data: {
            ...input
        }
    })

    return subtask as unknown as Subtask
}

/**
 * Delete todo subtask
 * @param subtaskId
 * @param loggedInUser
 * @param client
 */
export const deleteSubtask = async (subtaskId: number, loggedInUser: number, client: PrismaClient): Promise<boolean | null> => {
    const subtask = await getSubtaskById(subtaskId, loggedInUser, client)
    if (subtask) {
        await client.subtask.delete({
            where: {
                id: subtaskId
            }
        })

        fileLogger.info(`Subtask with id ${subtaskId} deleted.`, {loggedInUser})

        return true
    }

    return false
}
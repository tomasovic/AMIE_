import {PrismaClient} from '@prisma/client'
import {CreateSubtaskInput, Subtask, Todo, UpdateSubtaskInput} from 'src/types/resolvers-types'
import client from '../../client'
import {getTodoById, getTodoSubtasks} from '../../todos/model/todo.model'
import {
    createTodoSubtask,
    deleteSubtask,
    getSubtaskById,
    getTodoFromSubtask,
    updateTodoSubtask
} from '../model/subtask.model'
import {EntityMissingException} from '../../../exceptions/entityMissingException'
import validator from 'validator'
import {BadUserInputException} from '../../../exceptions/badUserInputException'

class SubtaskServices {
    constructor(private readonly client: PrismaClient) {
        this.client = client
    }

    public async getAllSubtasks(todoId: number, loggedInUser: number): Promise<Subtask[]> {
        const subtasks = await getTodoSubtasks(todoId, loggedInUser, this.client)
        if (!subtasks) {
            throw new EntityMissingException('Subtasks not found.')
        }

        return subtasks
    }

    public async getTodoFromSubtask(subtaskId: number, loggedInUser: number): Promise<Todo> {
        const todo = await getTodoFromSubtask(subtaskId, loggedInUser, this.client)
        if (!todo) {
            throw new EntityMissingException('Todo not found.')
        }

        return todo
    }

    public async getSubtaskById(subtaskId: number, loggedInUser: number): Promise<Subtask> {
        const subtask = await getSubtaskById(subtaskId, loggedInUser, this.client)
        if (!subtask) {
            throw new EntityMissingException('Subtask not found.')
        }

        return subtask
    }

    public async createTodoSubtask(input: CreateSubtaskInput, loggedInUser: number): Promise<Subtask> {
        if (!input.todoId) {
            throw new EntityMissingException('Todo not found.')
        }

        const existingTodo = await getTodoById(input.todoId, loggedInUser, this.client)
        if (!existingTodo) {
            throw new EntityMissingException('Todo not found.')
        }

        const cleanedInput = {
            ...input,
            todoId: existingTodo.id,
            title: input.title || '',
        }

        const subtask = await createTodoSubtask(cleanedInput, loggedInUser, this.client)
        if (!subtask) {
            throw new EntityMissingException('Subtask not created.')
        }

        return subtask
    }

    public async updateTodoSubtask(subtaskId: number, input: UpdateSubtaskInput, loggedInUser: number): Promise<Subtask> {
        if (input.done && !validator.isBoolean(String(input.done))) {
            throw new BadUserInputException('done', 'Done must be a boolean.')
        }

        if (input.status && !validator.isIn(input.status, ['NOT_STARTED', 'IN_PROGRESS', 'DONE'])) {
            throw new BadUserInputException('status', 'Status must be one of NOT_STARTED, IN_PROGRESS, DONE.')
        }

        const cleanedInput = {
            ...input,
            title: input.title || '',
        }

        const subtask = await updateTodoSubtask(subtaskId, cleanedInput, loggedInUser, this.client)
        if (!subtask) {
            throw new EntityMissingException('Subtask not updated.')
        }

        return subtask
    }

    public async deleteSubtask(subtaskId: number, loggedInUserId: number | undefined): Promise<boolean> {
        const subtask = await deleteSubtask(subtaskId, loggedInUserId!, this.client)
        if (!subtask) {
            throw new EntityMissingException('Subtask not found.')
        }

        return true
    }
}

export const subtaskServices = new SubtaskServices(client)
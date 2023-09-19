import {PrismaClient} from '@prisma/client'
import {CreateTodoInput, List, Subtask, Todo, UpdateTodoInput} from 'src/types/resolvers-types'
import {
    createTodo,
    deleteTodo,
    getAllUserTodos,
    getTodoById,
    getTodoList,
    getTodoSubtasks,
    updateTodo
} from '../model/todo.model'
import client from '../../client'
import {EntityMissingException} from '../../../exceptions/entityMissingException'
import validator from 'validator'
import {getUserListById} from '../../lists/model/list.model'
import {BadUserInputException} from '../../../exceptions/badUserInputException'
import {Options} from '../../../types/types'

class TodoServices {
    constructor(private readonly client: PrismaClient) {
        this.client = client
    }

    public async getUserTodo(todoId: number, loggedInUserId: number | undefined): Promise<Todo> {
        const todo = await getTodoById(todoId, loggedInUserId!, this.client)
        if (!todo) {
            throw new EntityMissingException('Todo not found.')
        }

        return todo
    }

    public async getAllUserTodos(loggedInUserId: number | undefined, options: Options): Promise<Todo[]> {
        const todos = await getAllUserTodos(loggedInUserId!, this.client, options)
        if (!todos) {
            throw new EntityMissingException('Todos not found.')
        }

        return todos
    }

    public async getTodoSubtasks(todoId: number, loggedInUserId: number | undefined): Promise<Subtask[]> {
        const subtasks = await getTodoSubtasks(todoId, loggedInUserId!, this.client)
        if (!subtasks) {
            throw new EntityMissingException('Subtasks not found',)
        }

        return subtasks
    }

    public async getTodoList(todoId: number, loggedInUserId: number | undefined): Promise<List | null> {
        const list = await getTodoList(todoId, loggedInUserId!, this.client)

        return list
    }

    public async createTodo(input: CreateTodoInput, loggedInUser: number): Promise<Todo> {
        let existingList: List | null = null
        if (input.listId) {
            existingList = await getUserListById(input.listId, loggedInUser, this.client)
        }

        const cleanedInput = {
            ...input,
            listId: existingList ? existingList.id : null,
            description: input.description ? validator.escape(input.description) : '',
            title: input.title || '',
        }

        return await createTodo(cleanedInput, loggedInUser, this.client)
    }

    public async updateTodo(todoId: number, input: UpdateTodoInput, loggedInUserId: number | undefined): Promise<Todo> {

        if (input.done && !validator.isBoolean(String(input.done))) {
            throw new BadUserInputException('done', 'Done must be a boolean.')
        }

        if (input.status && !validator.isIn(input.status, ['NOT_STARTED', 'IN_PROGRESS', 'DONE'])) {
            throw new BadUserInputException('status', 'Status must be one of NOT_STARTED, IN_PROGRESS, DONE.')
        }

        const cleanedInput = {
            ...input,
            description: input.description ? validator.escape(input.description) : '',
            title: input.title || '',
        }

        const todo = await updateTodo(todoId, cleanedInput, loggedInUserId!, this.client)
        if (!todo) {
            throw new EntityMissingException('Todo not found.')
        }

        return todo
    }

    public async deleteTodo(todoId: number, loggedInUserId: number | undefined): Promise<boolean> {
        const todo = await deleteTodo(todoId, loggedInUserId!, this.client)
        if (!todo) {
            throw new EntityMissingException('Todo not found.')
        }

        return true
    }
}

export const todoService = new TodoServices(client)
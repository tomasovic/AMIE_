import {PrismaClient} from '@prisma/client'
import {CreateListInput, List, Todo, UpdateListInput, User} from '../../../types/resolvers-types'
import client from '../../client'
import {
    createList,
    deleteList,
    getAllUserLists,
    getListTodos,
    getListUser,
    getUserListById,
    updateList
} from '../model/list.model'
import {EntityMissingException} from '../../../exceptions/entityMissingException'
import validator from 'validator'

class ListServices {
    constructor(private readonly client: PrismaClient) {
        this.client = client
    }

    public async getAllUserLists(loggedInUser: number): Promise<List[]> {
        const lists = await getAllUserLists(loggedInUser, this.client)
        if (!lists) {
            throw new EntityMissingException('Lists not found.')
        }

        return lists
    }

    public async getUserListById(listId: number, loggedInUser: number): Promise<List> {
        const list = await getUserListById(listId, loggedInUser, this.client)
        if (!list) {
            throw new EntityMissingException('List not found.')
        }

        return list
    }

    public async getListUser(listId: number, loggedInUser: number): Promise<User> {
        const user = await getListUser(listId, loggedInUser, this.client)
        if (!user) {
            throw new EntityMissingException('User not found.')
        }

        return user
    }

    public async getListTodos(listId: number, loggedInUser: number): Promise<Todo[]> {
        const todos = await getListTodos(listId, loggedInUser, this.client)
        if (!todos) {
            throw new EntityMissingException('No todos in list.')
        }

        return todos
    }

    public async updateList(listId: number, input: UpdateListInput, loggedInUser: number): Promise<List> {

        const cleanedInput = {
            ...input,
            name: input.name ? validator.escape(input.name) : null,
        }

        const list = await updateList(listId, cleanedInput, loggedInUser, this.client)
        if (!list) {
            throw new EntityMissingException('List not found.')
        }

        return list
    }

    public async createList(input: CreateListInput, loggedInUser: number): Promise<List> {
        if (input.name === null || validator.isEmpty(input.name)) {
            throw new EntityMissingException('List name is required.')
        }

        const cleanedInput = {
            ...input,
            name: validator.escape(input.name),
        }

        const list = await createList(cleanedInput, loggedInUser, this.client)
        if (!list) {
            throw new EntityMissingException('List was not created.')
        }

        return list
    }

    public async deleteList(listId: number, loggedInUser: number): Promise<boolean> {
        const list = await deleteList(listId, loggedInUser, this.client)
        if (!list) {
            throw new EntityMissingException('List not found.')
        }

        return true
    }
}

export const listServices = new ListServices(client)
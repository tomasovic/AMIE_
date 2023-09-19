import {Resolvers} from '../../../types/resolvers-types'
import {todoService} from '../services/todo.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {Options} from '../../../types/types'

const todoResolvers: Resolvers = {
    Todo: {
        subtasks: protectedResolver(async ({id}, _, {loggedInUser}) => {
            return await todoService.getTodoSubtasks(id, loggedInUser!.id)
        }),
        list: protectedResolver(async ({id}, _, {loggedInUser}) => {
            return await todoService.getTodoList(id, loggedInUser!.id)
        })
    },
    Query: {
        todos: protectedResolver(async (_, {options}: { options: Options }, {loggedInUser}) => {
            return await todoService.getAllUserTodos(loggedInUser!.id, options)
        }),
        todo: protectedResolver(async (_, {id}, {loggedInUser}) => {
            return await todoService.getUserTodo(id, loggedInUser!.id)
        }),
    },
}

export default todoResolvers
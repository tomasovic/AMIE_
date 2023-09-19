import {CreateTodoInput, Resolvers} from '../../../types/resolvers-types'
import {todoService} from '../services/todo.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const createTodoResolvers: Resolvers = {
    Mutation: {
        createTodo: protectedResolver(async (_: any, {input}: { input: CreateTodoInput }, {loggedInUser}) => {
            return await todoService.createTodo(input, loggedInUser!.id)
        }),
    },
}

export default createTodoResolvers
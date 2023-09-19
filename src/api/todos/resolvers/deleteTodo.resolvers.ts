import {Resolvers} from '../../../types/resolvers-types'
import {todoService} from '../services/todo.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const deleteTodoResolvers: Resolvers = {
    Mutation: {
        deleteTodo: protectedResolver(async (_: any, {todoId}, {loggedInUser}) => {
            return await todoService.deleteTodo(todoId, loggedInUser!.id)
        }),
    },
}

export default deleteTodoResolvers
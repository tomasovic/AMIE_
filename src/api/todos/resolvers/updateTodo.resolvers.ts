import {Resolvers, UpdateTodoInput} from '../../../types/resolvers-types'
import {todoService} from '../services/todo.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const updateTodoResolvers: Resolvers = {
    Mutation: {
        updateTodo: protectedResolver(async (_: any, {todoId, input}: {
            todoId: number,
            input: UpdateTodoInput
        }, {loggedInUser}) => {
            return await todoService.updateTodo(todoId, input, loggedInUser!.id)
        }),
    },
}

export default updateTodoResolvers
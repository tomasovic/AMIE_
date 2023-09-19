import {CreateSubtaskInput, Resolvers} from '../../../types/resolvers-types'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {subtaskServices} from '../services/subtask.services'

const subtaskCreateResolvers: Resolvers = {
    Mutation: {
        createSubtask: protectedResolver(async (_, {input}: {
            input: CreateSubtaskInput
        }, {loggedInUser}, info) => {
            return await subtaskServices.createTodoSubtask(input, loggedInUser!.id)
        }),
    },
}

export default subtaskCreateResolvers
import {Resolvers, UpdateSubtaskInput} from '../../../types/resolvers-types'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {subtaskServices} from '../services/subtask.services'

const subtaskUpdateResolvers: Resolvers = {
    Mutation: {
        updateSubtask: protectedResolver(async (_, {subtaskId, input}: {
            subtaskId: number, input: UpdateSubtaskInput
        }, {loggedInUser}) => {
            return await subtaskServices.updateTodoSubtask(subtaskId, input, loggedInUser!.id)
        }),
    },
}

export default subtaskUpdateResolvers
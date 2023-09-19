import {Resolvers} from '../../../types/resolvers-types'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {subtaskServices} from '../services/subtask.services'

const subtaskDeleteResolvers: Resolvers = {
    Mutation: {
        deleteSubtask: protectedResolver(async (_, {subtaskId}: {
            subtaskId: number
        }, {loggedInUser}, info) => {
            return await subtaskServices.deleteSubtask(subtaskId, loggedInUser!.id)
        }),
    },
}

export default subtaskDeleteResolvers
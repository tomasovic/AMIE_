import {Resolvers} from '../../../types/resolvers-types'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {subtaskServices} from '../services/subtask.services'

const subtaskResolvers: Resolvers = {
    Subtask: {
        todo: protectedResolver(async ({id}, _, {loggedInUser}) => {
            return await subtaskServices.getTodoFromSubtask(id, loggedInUser!.id)
        }),
    },
    Query: {
        subtasks: protectedResolver(async (_, {todoId}, {loggedInUser}) => {
            return await subtaskServices.getAllSubtasks(todoId, loggedInUser!.id)
        }),
        subtask: protectedResolver(async (_, {subtaskId}, {loggedInUser}) => {
            return await subtaskServices.getSubtaskById(subtaskId, loggedInUser!.id)
        }),
    },
}

export default subtaskResolvers
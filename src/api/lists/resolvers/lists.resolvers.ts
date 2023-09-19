import {Resolvers} from '../../../types/resolvers-types'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {listServices} from '../services/list.services'

const listResolvers: Resolvers = {
    List: {
        todos: protectedResolver(async ({id}, _, {loggedInUser}) => {
            return await listServices.getListTodos(id, loggedInUser!.id)
        }),
        user: protectedResolver(async ({id}, _, {loggedInUser}) => {
            return await listServices.getListUser(id, loggedInUser!.id)
        })
    },
    Query: {
        lists: protectedResolver(async (_, __, {loggedInUser}) => {
            return await listServices.getAllUserLists(loggedInUser!.id)
        }),
        list: protectedResolver(async (_, {listId}, {loggedInUser}) => {
            return await listServices.getUserListById(listId, loggedInUser!.id)
        }),
    },
}

export default listResolvers
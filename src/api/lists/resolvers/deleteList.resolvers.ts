import {Resolvers} from '../../../types/resolvers-types'
import {listServices} from '../services/list.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const deleteListResolvers: Resolvers = {
    Mutation: {
        deleteList: protectedResolver(async (_: any, {listId}, {loggedInUser}) => {
            return await listServices.deleteList(listId, loggedInUser!.id)
        }),
    },
}

export default deleteListResolvers
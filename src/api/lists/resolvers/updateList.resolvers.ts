import {Resolvers, UpdateListInput} from '../../../types/resolvers-types'
import {listServices} from '../services/list.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const updateListResolvers: Resolvers = {
    Mutation: {
        updateList: protectedResolver(async (_: any, {listId, input}: {
            listId: number,
            input: UpdateListInput
        }, {loggedInUser}) => {
            return await listServices.updateList(listId, input, loggedInUser!.id)
        }),
    },
}

export default updateListResolvers
import {CreateListInput, Resolvers} from '../../../types/resolvers-types'
import {listServices} from '../services/list.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const createListResolvers: Resolvers = {
    Mutation: {
        createList: protectedResolver(async (_: any, {input}: {
            input: CreateListInput
        }, {loggedInUser}) => {
            return await listServices.createList(input, loggedInUser!.id)
        }),
    },
}

export default createListResolvers
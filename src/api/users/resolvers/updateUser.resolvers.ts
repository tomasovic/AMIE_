import {Resolvers, UpdateUserInput} from '../../../types/resolvers-types'
import {userServices} from '../services/user.services'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'

const updateUserResolvers: Resolvers = {
    Mutation: {
        updateUser: protectedResolver(async (_: any, {input}: {
            input: UpdateUserInput
        }, {loggedInUser}) => {
            return await userServices.updateUser(input, loggedInUser!.id)
        }),
    },
}

export default updateUserResolvers
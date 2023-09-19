import {LoginUserInput, Resolvers} from '../../../types/resolvers-types'
import {userServices} from '../services/user.services'

const createUserResolvers: Resolvers = {
    Mutation: {
        login: async (_: any, {input}: { input: LoginUserInput }, {loggedInUser}) => {
            return await userServices.login(input)
        },
    },
}

export default createUserResolvers
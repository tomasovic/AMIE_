import {CreateUserInput, Resolvers} from '../../../types/resolvers-types'
import {userServices} from '../services/user.services'

const createUserResolvers: Resolvers = {
    Mutation: {
        signup: async (_: any, {input}: { input: CreateUserInput }) => {
            return await userServices.signUpUser(input)
        },
    },
}

export default createUserResolvers
import {Resolvers} from '../../../types/resolvers-types'
import {protectedResolver} from '../../../auth/middleware/auth.protected.resolver'
import {userServices} from '../services/user.services'

const userResolvers: Resolvers = {
    User: {
        // If we want to protect some of the resolvers
        // totalLists: protectedResolver(
        //     async (parent: { id: number }, args: any, context: UserContext, info: GraphQLResolveInfo) => {
        //         return await userService.getTotalLists(parent.id);
        //     }
        // ),
        totalLists: async ({id}) => {
            return await userServices.getTotalLists(id)
        },
        totalTodos: async ({id}) => {
            return await userServices.getTotalTodos(id)
        },
        todos: async ({id}) => {
            return await userServices.getTodosByUserId(id)
        },
        lists: async ({id}) => {
            return await userServices.getListsByUserId(id)
        },
        isMe: async ({id}, _, {loggedInUser}) => {
            if (!loggedInUser) return false
            return id === loggedInUser.id
        },
        thirdPartyAccounts: async ({id}) => {
            return await userServices.getThirdPartyAccounts(id)
        }
    },
    Query: {
        users: protectedResolver(async () => {
            return await userServices.getAllUsers()
        }),
        user: async (_, {userId}: { userId: number }) => {
            return await userServices.getUserById(userId)
        },
    },
}

export default userResolvers
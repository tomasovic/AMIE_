import {ResolversTypes} from '../../types/resolvers-types'
import {FunctionResolver, UserContext} from '../../types/types'
import {GraphQLResolveInfo} from 'graphql'
import {UnauthenticatedException} from '../../exceptions/unauthenticatedException'
import {LimiterException} from '../../exceptions/limiterException'
import {getGraphQLRateLimiter, RedisStore} from 'graphql-rate-limit'
import {redis} from '../../utils/redis/redisClient'

const store = new RedisStore(redis)

const rateLimiter = getGraphQLRateLimiter({
        identifyContext: (ctx) => ctx.loggedInUser?.id?.toString(),
        store,
    }
)

export const protectedResolver = (
    resolver: FunctionResolver | ResolversTypes
) => async (
    parent: any,
    args: any,
    context: UserContext,
    info: GraphQLResolveInfo
) => {
    // if we want to use passport.js
    // const {users} = await context.authenticate('graphql-local',
    //     {email: args.input.email, password: args.input.password})

    if (!context.loggedInUser) {
        throw new UnauthenticatedException()
    }

    const errorMessage = await rateLimiter(
        {parent, args, context, info},
        {max: 5, window: '10s'}
    )

    if (errorMessage) throw new LimiterException(errorMessage)

    // Type guard to check if resolver is callable
    if (typeof resolver === 'function') {
        return resolver(parent, args, context, info)
    } else if ('resolve' in resolver && typeof resolver.resolve === 'function') {
        return resolver.resolve(parent, args, context, info)
    } else {
        throw new Error('Invalid resolver')
    }
}
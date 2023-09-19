import {GraphQLFormattedError} from 'graphql/error'

/**
 * This function is used to format errors that are thrown by the GraphQL server.
 * Example:
 *     if (
 *         formattedError.extensions?.code ===
 *         ApolloServerErrorCode.INTERNAL_SERVER_ERROR
 *     ) {
 *         return {
 *             ...formattedError,
 *             message: 'Your query doesn\'t match the schema. Try double-checking it!',
 *         }
 *     }
 * @param formattedError
 * @param error
 */
export const formatError = (formattedError: GraphQLFormattedError, error: any): {
    message: string
} => {

    // if (
    //     formattedError.extensions?.code ===
    //     ApolloServerErrorCode.INTERNAL_SERVER_ERROR
    // ) {
    //     throw new BaseException('Something really bad happened!')
    // }

    return formattedError
}
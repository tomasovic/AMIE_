import {mergeResolvers, mergeTypeDefs} from '@graphql-tools/merge'
import {makeExecutableSchema} from '@graphql-tools/schema'
import {loadFilesSync} from '@graphql-tools/load-files'

import path from 'path'

const srcDir = path.join(__dirname, '..', '..', '..', 'src')
const loadedTypes = loadFilesSync(`${srcDir}/**/*.graphql`)
const loadedResolvers = loadFilesSync(`${srcDir}/**/resolvers/*.resolvers.ts`)

export const typeDefs = mergeTypeDefs(loadedTypes)
export const resolvers = mergeResolvers(loadedResolvers)

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

export default schema
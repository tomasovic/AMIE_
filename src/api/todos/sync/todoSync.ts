// Mocked file for the todo DB functions

async function findTodoByExternalId(externalId: string) {
    console.log('🚀 ~ file: todoSync.ts ~ line 2 ~ 11:42:5 findTodoByExternalId')
}

async function isNew(externalTodo: any) {
    console.log('🚀 ~ file: todoSync.ts ~ line 6 ~ 11:42:21 isNew')
}

async function isUpdated(externalTodo: any) {
    console.log('🚀 ~ file: todoSync.ts ~ line 10 ~ 11:42:37 isUpdated')
}

async function isDeleted(externalTodo: any) {
    console.log('🚀 ~ file: todoSync.ts ~ line 14 ~ 11:42:53 isDeleted')
}

export default {
    findTodoByExternalId,
    isNew,
    isUpdated,
    isDeleted
}
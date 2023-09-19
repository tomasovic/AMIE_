// @ts-nocheck

// This script could be called in these scenarios:
// 1. On Application startup
// 2. User Login
// 3. CRon Job
// 4. User-Triggered
// 5. User logout

import {MicrosoftTodo} from '../thirdParty/microsoft/microsoftTodo'
import {createTodo, deleteTodo, updateTodo} from '../api/todos/model/todo.model'
import todoSync from '../api/todos/sync/todoSync'

const POLL_INTERVAL = 60000 // 60 seconds

const pollMicrosoftTodo = async (accessToken: string) => {
    const microsoftTodo = new MicrosoftTodo(accessToken)

    setInterval(async () => {
        const todos = await microsoftTodo.fetchTodos()

        for (const todo of todos) {
            if (await todoSync.isNew(todo)) {
                await createTodo(todo)
            } else if (await todoSync.isUpdated(todo)) {
                await updateTodo(todo)
            } else if (await todoSync.isDeleted(todo)) {
                await deleteTodo(todo.id)
            }
        }
    }, POLL_INTERVAL)
}

export default pollMicrosoftTodo
import axios from 'axios'
import {AuthProvider, authProvider} from './auth/authProvider'

export class MicrosoftTodo {
    private readonly accessToken: string
    private authProvider: AuthProvider

    constructor(accessToken: string) {
        this.accessToken = accessToken
        this.authProvider = authProvider
    }

    async login(microsoftEmail: string, microsoftPassword: string) {
        this.authProvider.login({microsoftEmail, microsoftPassword})
    }

    async acquireToken() {
        this.authProvider.acquireToken()
    }

    async createTodo(title: string) {
        const response = await axios.post(
            'https://graph.microsoft.com/v1.0/me/todo/lists/{todoListId}/tasks',
            {
                title,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        )
        return response.data
    }

    async updateTodo(todoId: string, title: string) {
        const response = await axios.patch(
            `https://graph.microsoft.com/v1.0/me/todo/lists/{todoListId}/tasks/${todoId}`,
            {
                title,
            },
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        )
        return response.data
    }

    async deleteTodo(todoId: string) {
        const response = await axios.delete(
            `https://graph.microsoft.com/v1.0/me/todo/lists/{todoListId}/tasks/${todoId}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            }
        )
        return response.data
    }
}
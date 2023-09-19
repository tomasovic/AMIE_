import {List, Subtask, Todo, TodoStatus, User} from './resolvers-types'
import {PrismaClient} from '@prisma/client'
import {GraphQLResolveInfo} from 'graphql/type'
import {Smtp} from '../utils/mail/drivers/smtp'

export interface UserContext {
    loggedInUser?: User
    client?: PrismaClient
    jsonError?: boolean
    authenticate: (strategy: string, options: any) => Promise<any>
}

export type FunctionResolver = (
    root: any,
    args: any,
    context: UserContext,
    info: GraphQLResolveInfo
) => any;

export type GQLUser = User & {
    isMe: boolean;
    lists: List[];
    todos: Todo[];
    totalLists: number;
    totalTodos: number;
};

export type TodoWithUserId = Todo & {
    userId: number;
}

export interface Options {
    cursor?: number;
    take?: number;
    status?: TodoStatus;
    done?: boolean;
}

export type UserWithPassword = User & {
    password: string;
}

export type GQLTodo = Todo & {
    subtasks: Subtask[];
    User: User;
};

export type CustomUser = User & {
    isMe?: boolean;
    totalLists?: number;
    totalTodos?: number;
};

export type GQLList = List & {
    user: CustomUser;
};

export type JsonError = {
    ok: boolean;
    error: string;
};

interface MailAuth {
    user: string | undefined;
    pass: string | undefined;
}

interface SmtpConfig {
    driver: string;
    host: string | undefined;
    port: string | undefined;
    auth: MailAuth;
}

export interface MailConfig {
    connection: string;
    from: string | undefined;
    smtp: SmtpConfig;
}

export interface MailData {
    to: string,
    from: string,
    subject: string,
    context?: any,
    text: string
}

export interface Drivers {
    smtp: typeof Smtp
}

export interface LoggerOptions {
    filename: string
    datePattern: string
    dirname: string
    maxSize: string
    maxFiles: string
}
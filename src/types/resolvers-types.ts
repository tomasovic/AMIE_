import { GraphQLResolveInfo } from 'graphql';
import { UserContext } from './types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  createdAt?: Maybe<Scalars['String']['output']>;
  jwt: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type CreateListInput = {
  name: Scalars['String']['input'];
};

export type CreateSubtaskInput = {
  title: Scalars['String']['input'];
  todoId: Scalars['Int']['input'];
};

export type CreateTodoInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  listId?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type List = {
  __typename?: 'List';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  todos?: Maybe<Array<Maybe<Todo>>>;
  updatedAt: Scalars['String']['output'];
  user?: Maybe<User>;
};

export type LoginUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createList: List;
  createSubtask: Subtask;
  createTodo: Todo;
  deleteList: Scalars['Boolean']['output'];
  deleteSubtask: Scalars['Boolean']['output'];
  deleteTodo: Scalars['Boolean']['output'];
  login: AuthResponse;
  signup: AuthResponse;
  updateList: List;
  updateSubtask: Subtask;
  updateTodo: Todo;
  updateUser: User;
};


export type MutationCreateListArgs = {
  input: CreateListInput;
};


export type MutationCreateSubtaskArgs = {
  input: CreateSubtaskInput;
};


export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};


export type MutationDeleteListArgs = {
  listId: Scalars['Int']['input'];
};


export type MutationDeleteSubtaskArgs = {
  subtaskId: Scalars['Int']['input'];
};


export type MutationDeleteTodoArgs = {
  todoId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  input: LoginUserInput;
};


export type MutationSignupArgs = {
  input: CreateUserInput;
};


export type MutationUpdateListArgs = {
  input: UpdateListInput;
  listId: Scalars['Int']['input'];
};


export type MutationUpdateSubtaskArgs = {
  input: UpdateSubtaskInput;
  subtaskId: Scalars['Int']['input'];
};


export type MutationUpdateTodoArgs = {
  input: UpdateTodoInput;
  todoId: Scalars['Int']['input'];
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

export type MutationResponse = {
  __typename?: 'MutationResponse';
  error?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Options = {
  cursor?: InputMaybe<Scalars['Int']['input']>;
  done?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<TodoStatus>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  list?: Maybe<List>;
  lists?: Maybe<Array<Maybe<List>>>;
  subtask?: Maybe<Subtask>;
  subtasks?: Maybe<Array<Maybe<Subtask>>>;
  todo?: Maybe<Todo>;
  todos?: Maybe<Array<Maybe<Todo>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryListArgs = {
  listId: Scalars['Int']['input'];
};


export type QuerySubtaskArgs = {
  subtaskId: Scalars['Int']['input'];
};


export type QuerySubtasksArgs = {
  todoId: Scalars['Int']['input'];
};


export type QueryTodoArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTodosArgs = {
  options?: InputMaybe<Options>;
};


export type QueryUserArgs = {
  userId: Scalars['Int']['input'];
};

export type Subtask = {
  __typename?: 'Subtask';
  createdAt: Scalars['String']['output'];
  done: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  status: TodoStatus;
  title: Scalars['String']['output'];
  todo: Todo;
  updatedAt: Scalars['String']['output'];
};

export type ThirdPartyAccount = {
  __typename?: 'ThirdPartyAccount';
  accessToken: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  externalId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  service: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type ThirdPartyAccountInput = {
  accessToken?: InputMaybe<Scalars['String']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
  service?: InputMaybe<Scalars['String']['input']>;
};

export type Todo = {
  __typename?: 'Todo';
  createdAt: Scalars['String']['output'];
  deletedAt?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  done: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  list?: Maybe<List>;
  status: TodoStatus;
  subtasks?: Maybe<Array<Maybe<Subtask>>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export enum TodoStatus {
  Done = 'DONE',
  InProgress = 'IN_PROGRESS',
  NotStarted = 'NOT_STARTED'
}

export type UpdateListInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSubtaskInput = {
  done?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<TodoStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTodoInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  done?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<TodoStatus>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  thirdPartyAccount?: InputMaybe<ThirdPartyAccountInput>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isMe: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  lists?: Maybe<Array<Maybe<List>>>;
  thirdPartyAccounts?: Maybe<Array<Maybe<ThirdPartyAccount>>>;
  todos?: Maybe<Array<Maybe<Todo>>>;
  totalLists: Scalars['Int']['output'];
  totalTodos: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CreateListInput: CreateListInput;
  CreateSubtaskInput: CreateSubtaskInput;
  CreateTodoInput: CreateTodoInput;
  CreateUserInput: CreateUserInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  List: ResolverTypeWrapper<List>;
  LoginUserInput: LoginUserInput;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResponse: ResolverTypeWrapper<MutationResponse>;
  Options: Options;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subtask: ResolverTypeWrapper<Subtask>;
  ThirdPartyAccount: ResolverTypeWrapper<ThirdPartyAccount>;
  ThirdPartyAccountInput: ThirdPartyAccountInput;
  Todo: ResolverTypeWrapper<Todo>;
  TodoStatus: TodoStatus;
  UpdateListInput: UpdateListInput;
  UpdateSubtaskInput: UpdateSubtaskInput;
  UpdateTodoInput: UpdateTodoInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AuthResponse: AuthResponse;
  Boolean: Scalars['Boolean']['output'];
  CreateListInput: CreateListInput;
  CreateSubtaskInput: CreateSubtaskInput;
  CreateTodoInput: CreateTodoInput;
  CreateUserInput: CreateUserInput;
  Int: Scalars['Int']['output'];
  List: List;
  LoginUserInput: LoginUserInput;
  Mutation: {};
  MutationResponse: MutationResponse;
  Options: Options;
  Query: {};
  String: Scalars['String']['output'];
  Subtask: Subtask;
  ThirdPartyAccount: ThirdPartyAccount;
  ThirdPartyAccountInput: ThirdPartyAccountInput;
  Todo: Todo;
  UpdateListInput: UpdateListInput;
  UpdateSubtaskInput: UpdateSubtaskInput;
  UpdateTodoInput: UpdateTodoInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
}>;

export type AuthResponseResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = ResolversObject<{
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  jwt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ListResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['List'] = ResolversParentTypes['List']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationCreateListArgs, 'input'>>;
  createSubtask?: Resolver<ResolversTypes['Subtask'], ParentType, ContextType, RequireFields<MutationCreateSubtaskArgs, 'input'>>;
  createTodo?: Resolver<ResolversTypes['Todo'], ParentType, ContextType, RequireFields<MutationCreateTodoArgs, 'input'>>;
  deleteList?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteListArgs, 'listId'>>;
  deleteSubtask?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteSubtaskArgs, 'subtaskId'>>;
  deleteTodo?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTodoArgs, 'todoId'>>;
  login?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  signup?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  updateList?: Resolver<ResolversTypes['List'], ParentType, ContextType, RequireFields<MutationUpdateListArgs, 'input' | 'listId'>>;
  updateSubtask?: Resolver<ResolversTypes['Subtask'], ParentType, ContextType, RequireFields<MutationUpdateSubtaskArgs, 'input' | 'subtaskId'>>;
  updateTodo?: Resolver<ResolversTypes['Todo'], ParentType, ContextType, RequireFields<MutationUpdateTodoArgs, 'input' | 'todoId'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
}>;

export type MutationResponseResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse']> = ResolversObject<{
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  list?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType, RequireFields<QueryListArgs, 'listId'>>;
  lists?: Resolver<Maybe<Array<Maybe<ResolversTypes['List']>>>, ParentType, ContextType>;
  subtask?: Resolver<Maybe<ResolversTypes['Subtask']>, ParentType, ContextType, RequireFields<QuerySubtaskArgs, 'subtaskId'>>;
  subtasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subtask']>>>, ParentType, ContextType, RequireFields<QuerySubtasksArgs, 'todoId'>>;
  todo?: Resolver<Maybe<ResolversTypes['Todo']>, ParentType, ContextType, RequireFields<QueryTodoArgs, 'id'>>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType, Partial<QueryTodosArgs>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'userId'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
}>;

export type SubtaskResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['Subtask'] = ResolversParentTypes['Subtask']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  done?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TodoStatus'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  todo?: Resolver<ResolversTypes['Todo'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ThirdPartyAccountResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['ThirdPartyAccount'] = ResolversParentTypes['ThirdPartyAccount']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  externalId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  refreshToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  service?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TodoResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['Todo'] = ResolversParentTypes['Todo']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deletedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  done?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  list?: Resolver<Maybe<ResolversTypes['List']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['TodoStatus'], ParentType, ContextType>;
  subtasks?: Resolver<Maybe<Array<Maybe<ResolversTypes['Subtask']>>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = UserContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isMe?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lists?: Resolver<Maybe<Array<Maybe<ResolversTypes['List']>>>, ParentType, ContextType>;
  thirdPartyAccounts?: Resolver<Maybe<Array<Maybe<ResolversTypes['ThirdPartyAccount']>>>, ParentType, ContextType>;
  todos?: Resolver<Maybe<Array<Maybe<ResolversTypes['Todo']>>>, ParentType, ContextType>;
  totalLists?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalTodos?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = UserContext> = ResolversObject<{
  AuthResponse?: AuthResponseResolvers<ContextType>;
  List?: ListResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subtask?: SubtaskResolvers<ContextType>;
  ThirdPartyAccount?: ThirdPartyAccountResolvers<ContextType>;
  Todo?: TodoResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;


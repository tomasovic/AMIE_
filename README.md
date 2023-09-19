# AMIE

Challenge TODO list

# START ( with docker )
- have docker, docker compose on the machine
- clone the repo
- start the commands from the project root folder
```shell
# build the images
docker compose build
# start the containers
docker compose up
# kill the containers
docker compose down
```

# START ( without docker )
- clone the repo
- create postgres db called amie
- start redis
- node version 18
- start the commands
```shell
tsc
yarn run generate
yarn run start
```
- there are env vars in the project which cannot be shared, so please contact me for the env vars, or at least to tell what to do 

# Request:

### Todo service

Build a service to manage Todos.

#### Requirements

- Features
    - [ ] API to query Todos (potentially many!)
        - Query Todos that are not done
        - Todos can be grouped in lists
    - [ ] API to add a Todo
    - [ ] API to update Todos
        - Mark Todos as done
    - [ ] We would like you to integrate with another service provider. It can be any Todo service (e.g. Microsoft Todo
      APIs), or you can also use a mock provider. Todos should be kept in sync between our service and the third-party
      integration
        - Todos created in the third-party integration should always be created in our service
        - The status of todos should always be in sync between our service and the integration

- Tech
    - If possible use a relational DB, PostgreSQL would be perfect!
    - Provide data model for Todos

Bonus:

- Let's create GraphQL APIs
- typescript would be great, but most common languages are okay

> Note: We expect you to treat the challenge as a real world production app development that is meant to:
> Scale to 10+ engineers contributing simultaneous
> Wherever you might have to take shortcuts point it out and explain what you would do differently!
> We would like you to take assumptions and decisions of how the product and the third-party integration should work, if
> needed you can highlight and explain decisions in a README inside the project.

### Resolvers

#### Role: Handle incoming API requests and delegate the actual business logic to the appropriate services.

#### Responsibilities:

Parse incoming queries or mutations.
Validate input data.
Call the appropriate service methods to handle the business logic.
Return the response back to the client.

### Services

#### Role: Contain the core business logic of the application.

### Responsibilities:

Perform CRUD operations.
Implement business rules and validations.
Interact with the data models to fetch, create, update, or delete data.
May call other services or utility functions.

### Models

#### Role: Represent the data structure and handle direct interactions with the database.

### Responsibilities:

Define the schema for the data (e.g., tables in SQL, collections in NoSQL).
Provide methods for CRUD operations.
May include hooks, indexes, and additional configurations specific to the database.

## Using classes for Models and Services

For Models: If models have complex behaviors and shared logic, classes might be beneficial. Otherwise, simple data
structures and functions could suffice.
For Services: Services often benefit from the encapsulation and structure that classes provide, especially as the
application grows in complexity.

#### FEATURES

- checks todo ownership
- if the todo is not yours, cannot use subtask
- todo cursor pagination
- user needs to be authenticated to use the app
- custom error notification, GraphQL Error or json error - headers Accept - application/json
- removed error stacking in production. stacking can be enabled from the winston config in errors({stack: true})
- custom error handling
- custom GraphQL error handling
- sending emails when the user is registered
- redis for caching and storing sessions
- rate limiter on protected routes
- cleaning the DB with cron job, for the todos with deletedAt records after 30 days
- validation's for the input data
- winston logger, logging exceptions and deleting records, cron job
- winston reader and filtering
- filtering and pagination only for todo
- third party per user with protected values in the DB
- added an idea of third party integration for Microsoft TODO. The code is valid, just the implementation is not
  finished cause of lack of the time. Needed to open account on Azure and getting API keys
- polling for the third party integration. in the /api/polling/microsoftTodoPolling.ts are possible scenarios
- passport.js for authentication if we need some other strategy, Microsoft, Google, Twitter, OAuth
- jest testing, for unit, integration and e2e testing

#### What could be added

- using TypeGraphQL for types
- deletedAt for other records, except only todo
- add dueDate for todo
- before touching DB, we can check if the argument is passed
- use Prisma soft delete instead deletedAt field
- when the cron deletes the todo, it also deletes the subtasks, but it should not
- crud for multiple third party accounts. right now, user can have only one third party account. db and schema are
  prepared, resolvers are not.
- time of the challenge is little tricky, so the implementation of the microsoft third party didnt finished. but the
  idea is there. i have prepared everything, just need to implement it. thirdParty folder
- documentation like SpectaQL
- third party integration is added just like an idea of implementation. it is not finished.
- sync with third party integration can be done with Webhooks if there is an API for that, cron job, polling, or GraphQl
  Subscription

#### Folder schema

AMIE/
├── __tests__
│ ├── e2e
│ ├── integration
│ └── unit
│ ├── exceptions
│ └── users
├── prisma
│ └── migrations
├── scripts
└── src
├── api
│ ├── lists
│ │ ├── model
│ │ ├── resolvers
│ │ └── services
│ ├── subtasks
│ │ ├── model
│ │ ├── resolvers
│ │ └── services
│ ├── todos
│ │ ├── model
│ │ ├── resolvers
│ │ ├── services
│ │ └── sync
│ └── users
│ ├── model
│ ├── resolvers
│ └── services
├── auth
│ ├── middleware
│ └── strategies
├── config
├── exceptions
├── lib
│ └── passport
├── middlewares
├── polling
├── scheduler
│ └── tasks
├── thirdParty
│ ├── microsoft
│ │ ├──auth
├── types
└── utils
├── errors
├── logger
│ └── logs
├── mail
│ └── drivers
├── redis
├── types
└── users
│─── launcher.ts // Entry point
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env
└── README.md

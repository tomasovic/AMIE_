import client from './../src/api/client'
import bcryptjs from 'bcryptjs'

async function main() {
    const amie = await client.user.upsert({
        where: {email: 'alice@prisma.io'},
        update: {},
        create: {
            email: 'amie@amie.io',
            firstName: 'Amie',
            lastName: 'Amie',
            password: await bcryptjs.hash('amie', 10),
            lists: {
                create: [
                    {
                        name: 'Shopping',
                        description: 'Shopping list',
                    }
                ]
            },
            todos: {
                create: [
                    {
                        title: 'Buy milk',
                        description: 'Buy milk for breakfast',
                        done: false,
                        status: 'NOT_STARTED',
                        listId: 1
                    }
                ]
            },
        },
    })

    console.log({amie})
}

main()
    .then(async () => {
        await client.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await client.$disconnect()
        process.exit(1)
    })
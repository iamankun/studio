// run inside `async` function
const newUser = await prisma.user.create({
    data: {
        name: 'An Kun',
        email: ' admin@ankun.dev',
        password: '@iamAnKun',
    },
})

const users = await prisma.user.findMany()
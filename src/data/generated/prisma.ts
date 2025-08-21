// run inside `async` function
const newUser = await prisma.user.create({
    data: {
        name: 'An Kun',
        email: 'ankun.n.m@gmail.com, admin@ankun.dev',
        password: '@iamAnKun',
    },
})

const users = await prisma.user.findMany()
// index.js
import express from 'express'
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

/**
 * logic for our api will go here
 */
export default {
    path: '/api',
    handler: app
}

// index.js
app.post(`/user`, async (req, res) => {
    const result = await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
        },
    })
    res.json(result)
})

// index.js
app.post('/post', async (req, res) => {
    const {title, content, authorEmail} = req.body
    const post = await prisma.post.create({
        data: {
            title,
            content,
            author: {
                connectOrCreate: {
                    email: authorEmail
                }
            }
        }
    })
    res.status(200).json(post)
})

// index.js
app.get('/drafts', async (req, res) => {
    const posts = await prisma.post.findMany({
        where: {published: false},
        include: {author: true}
    })
    res.json(posts)
})

// index.js
app.get('/post/:id', async (req, res) => {
    const {id} = req.params
    const post = await prisma.post.findUnique({
        where: {
            id: Number(id),
        },
        include: {author: true}
    })
    res.json(post)
})




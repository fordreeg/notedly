const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

require('dotenv').config()
const db = require('./db')

const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

db.connect(DB_HOST)

const models = require('./models')

const typeDefs = gql`
    type Query {
        hello: String
        notes: [Note]!
        note(id: ID!): Note!
    },
    type Note {
        id: ID!
        content: String!
        author: String!
    },
    type Mutation {
        newNote(content: String!, author: String!): Note!
    }
`

const resolvers = {
    Query: {
        hello: () => 'Hello world!!',
        notes: async () => await models.Note.find(),
        note: async (parent, args) => await models.Note.findById(args.id),
    },
    Mutation: {
        newNote: async (parent, args) => {
            return await models.Note.create({
                content: args.content,
                author: args.author
            })
        }
    }
}

async function startApolloServer(typeDefs, resolvers) {
    const server = new ApolloServer({ typeDefs, resolvers })
    const app = express()
    await server.start()
    server.applyMiddleware({ app, path: '/api' })
    app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`))
}

startApolloServer(typeDefs, resolvers);






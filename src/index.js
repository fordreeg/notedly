const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const port = process.env.PORT || 4000

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

let notes = [
    { id: '1', content: 'This is a note', author: 'Adam Scott' },
    { id: '2', content: 'This is another note', author: 'Harlow Everly' },
    { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
]

const resolvers = {
    Query: {
        hello: () => 'Hello world!!',
        notes: () => notes,
        note: (parent, args) => notes.find(note => note.id === args.id)
    },
    Mutation: {
        newNote: (parent, args) => {
            let newValue = {
                id: String(notes.length + 1),
                content: args.content,
                author: args.author
            }

            notes.push(newValue)
            console.log('notes :>> ', notes);
            return newValue
        }
    }
}

async function startApolloServer(typeDefs, resolvers) {
    const server = new ApolloServer({ typeDefs, resolvers })
    const app = express()
    await server.start()
    server.applyMiddleware({ app, path: '/api' })
    app.listen({ port }, () => console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}!`))
}

startApolloServer(typeDefs, resolvers);





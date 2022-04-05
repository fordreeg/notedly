const express = require('express')
const { ApolloServer } = require('apollo-server-express')

require('dotenv').config()
const db = require('./db')

const port = process.env.PORT || 4000
const DB_HOST = process.env.DB_HOST

db.connect(DB_HOST)

const models = require('./models')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ models }),
  })
  const app = express()
  await server.start()
  server.applyMiddleware({ app, path: '/api' })
  app.listen({ port }, () =>
    console.log(
      `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
    )
  )
}

startApolloServer(typeDefs, resolvers)

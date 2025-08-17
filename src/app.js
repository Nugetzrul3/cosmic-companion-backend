const express = require('express');
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { getUserFromToken } = require("./utils/auth");

const createApp = async () => {
    const app = express()

    app.get('/health', (req, res) => {
        res.status(200).send({ message: "Server is running" })
    });

    const server = new ApolloServer(
        {
            typeDefs,
            resolvers,
            context: ({ req }) => {
                const token = req.headers.authorization || '';
                const user = getUserFromToken(token);
                return { user };
            }
        }
    );

    await server.start();
    server.applyMiddleware({ app });

    return app;
};

module.exports = { createApp };
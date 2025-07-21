const express = require("express");
const sequelize = require("./db");
const User = require("./models/user");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typedefs");
const resolvers = require("./graphql/resolvers");
const { getUserFromToken } = require('./utils/auth')
require("dotenv").config();

const app = express();
const router = express.Router();

router.get("/health", (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
})

const startServer = async () => {
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

    sequelize.sync({ alter: true }).then(() => {
        app.listen(3000, 'localhost', () => console.log(`Server running on port 3000, ${server.graphqlPath}`));
    });
}

startServer();

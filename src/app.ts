import { ApolloServer } from "apollo-server-express";
import { getUserFromToken } from "./utils/auth";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import express, { Application, Request, Response } from 'express';
import path from "node:path";

const createApp = async (): Promise<Application> => {
    const app: Application = express();

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).send({ message: "Server is running" });
    });

    app.use("/", express.static(path.join(__dirname, "..", "docs")));

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => {
            const token = req.headers.authorization || '';
            const user = getUserFromToken(token);
            return { user, req, res };
        }
    });

    await server.start();
    server.applyMiddleware({ app });

    return app;
};

export default createApp;
import express, { Application, Request, Response } from 'express';
import { expressMiddleware } from "@as-integrations/express4";
import { getUserFromToken } from "./utils/auth";
import { ApolloServer } from "@apollo/server";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import bodyParser from "body-parser";
import path from "node:path";
import cors from "cors";

const createApp = async (): Promise<Application> => {
    const app: Application = express();

    app.get('/health', (req: Request, res: Response) => {
        res.status(200).send({ message: "Server is running" });
    });

    app.use("/", express.static(path.join(__dirname, "..", "docs")));

    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    await server.start();

    app.use(
        "/graphql",
        cors<cors.CorsRequest>(),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                const token = req.headers.authorization || "";
                const user = getUserFromToken(token);
                return { user, req, res };
            }
        })
    )

    return app;
};

export default createApp;
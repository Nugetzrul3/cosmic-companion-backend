import { createToken, createRefreshToken, getRefreshToken, getCookie } from '../../utils/auth';
import {AuthPayload, LoginBody, RefreshPayload, RegisterBody} from "../../interfaces/graphql";
import { UserJWTPayload } from "../../interfaces/models";
import { Response, Request } from "express";
import { User } from "../../models";
import bcrypt from 'bcryptjs';

const resolvers = {
    Query: {
        me: (_parent: any, _args: any, context: { user?: UserJWTPayload }) => {
            return context.user ? User.findOne({ where: { email: context.user.email }}) : null;
        },

        refresh: async (_parent: any, _args: any, context: { req: Request }): Promise<RefreshPayload> => {
            if (!context.req.headers.cookie) {
                return { error: "Cookie not found" };
            }
            const refreshToken = getCookie(context.req.headers.cookie, 'refreshToken');

            if (!refreshToken) {
                return { error: "Refresh token not found in cookie" };
            }

            const payload = getRefreshToken(refreshToken);
            if (!payload || !payload.id) return { error: 'Refresh token invalid' }

            const user = await User.findByPk(payload.id)
            if (!user) return { error: 'User does not exist'};

            const new_token = createToken(user)

            return { token: new_token, user }
        }
    },

    Mutation: {
        signup: async (_parent: any, args: { data: RegisterBody }, context: { res: Response }): Promise<AuthPayload> => {
            const existingUser = await User.findOne({ where: { email: args.data.email }});

            if (existingUser) return { error: 'User already exists' };

            const hashedPassword = await bcrypt.hash(args.data.password, 10);
            const user = await User.create(
                {
                    first_name: args.data.firstName,
                    last_name: args.data.lastName,
                    username: args.data.username,
                    email: args.data.email,
                    password: hashedPassword,
                }
            );
            const token = createToken(user);
            const refreshToken = createRefreshToken(user)

            context.res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "lax"
            });

            return { token, refreshToken, user };
        },

        login: async (_parent: any, args: { data: LoginBody }, context: { res: Response }): Promise<AuthPayload> => {
            const user = await User.findOne({ where: { email: args.data.email } });
            if (!user) return { error: "User does not exist" }

            const valid = await bcrypt.compare(args.data.password, user.password);
            if (!valid) return { error: "Invalid credentials" }

            const token = createToken(user);
            const refreshToken = createRefreshToken(user);

            context.res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "lax"
            });

            return { token, refreshToken, user };
        }
    }
}

export default resolvers;

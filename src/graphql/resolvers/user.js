const User = require('../../models/User');
const {
    createToken,
    createRefreshToken,
    getRefreshToken,
    bcrypt,
    getCookie
} = require('../../utils/auth');

module.exports = {
    Query: {
        me: (_, __, { user }) => {
            return user ? User.findOne({ where: { email: user.email }}) : null;
        }
    },

    Mutation: {
        signup: async (_, { data }, { res }) => {
            const existingUser = await User.findOne({ where: { email: data.email }});

            if (existingUser) return { error: 'User already exists' };

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await User.create(
                {
                    first_name: data.firstName,
                    last_name: data.lastName,
                    username: data.username,
                    email: data.email,
                    password: hashedPassword,
                }
            );
            const token = createToken(user);
            const refreshToken = createRefreshToken(user)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "lax"
            });

            return { token, refreshToken, user };
        },

        login: async (_, { data }, { res }) => {
            const user = await User.findOne({ where: { email: data.email } });
            if (!user) return { error: "User does not exist" }

            const valid = await bcrypt.compare(data.password, user.password);
            if (!valid) return { error: "Invalid credentials" }

            const token = createToken(user);
            const refreshToken = createRefreshToken(user);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                sameSite: "lax"
            });

            return { token, refreshToken, user };
        },

        refresh: async (_, __, { req }) => {
            const refreshToken = getCookie(req.headers.cookie, 'refreshToken');
            const payload = getRefreshToken(refreshToken);
            if (!payload) return { error: 'Refresh token invalid' }

            const user = await User.findByPk(payload.id)
            if (!user) return { error: 'User does not exist'};

            const new_token = createToken(user)

            return { token: new_token, user }

        }
    }
}

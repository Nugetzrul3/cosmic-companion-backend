const User = require('../../models/user');
const { createToken, createRefreshToken, getRefreshToken, bcrypt } = require('../../utils/auth');

module.exports = {
    Query: {
        me: (_, __, { user }) => {
            return user ? User.findOne( { where: { email: user.email } } ) : null;
        }
    },

    Mutation: {
        signup: async (_, { data }) => {
            const existingUser = await User.findOne({ where: { email: data.email } });

            if (existingUser) return { error: 'User already exists' };

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = await User.create(
                {
                    email: data.email,
                    password: hashedPassword,
                }
            );
            const token = createToken(user);
            const refreshToken = createRefreshToken(user)

            return { token, refreshToken, user };
        },

        login: async (_, { data }) => {
            const user = await User.findOne({ where: { email: data.email } });
            if (!user) return { error: "User does not exist" }

            const valid = await bcrypt.compare(data.password, user.password);
            if (!valid) return { error: "Invalid credentials" }

            const token = createToken(user);
            const refreshToken = createRefreshToken(user)

            return { token, refreshToken, user };
        },

        refreshToken: async (_, { token }) => {
            const payload = getRefreshToken(token);
            if (!payload) throw new Error('Refresh token invalid');

            const user = await User.findByPk(payload.id)
            if (!user) throw new Error('User does not exist');

            const new_token = createToken(user)

            return { token: new_token, user }

        }
    }
}

const User = require('../../models/user');
const { createToken, bcrypt } = require('../../utils/auth');

module.exports = {
    Query: {
        me: (_, __, { user }) => {
            return user ? User.findByPk(user.id) : null;
        }
    },

    Mutation: {
        signup: async (_, { email, password }) => {
            const existingUser = await User.findOne({ where: { email: email } });

            if (existingUser) throw new Error('User already exists');

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create(
                {
                    email: email,
                    password: hashedPassword,
                }
            );
            const token = createToken(user);

            return { token, user };
        },

        login: async (_, { email, password }) => {
            const user = await User.findOne({ where: { email: email } });
            if (!user) throw new Error('User does not exist');

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) throw new Error('Invalid credentials');

            const token = createToken(user);
            return { token, user };
        }
    }
}

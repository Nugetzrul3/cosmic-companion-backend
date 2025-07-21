const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, { expiresIn: '7d' });
}

const getUserFromToken = (token) => {
    try {
        if (token.startsWith('Bearer ')) token = token.split(' ')[1];
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        console.error('getUserFromToken', token);
        return null;
    }
}

module.exports = { createToken, getUserFromToken, bcrypt };

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '12h' });
}

const createRefreshToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

const getUserFromToken = (token) => {
    try {
        if (token.startsWith('Bearer ')) token = token.split(' ')[1];
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        return null;
    }
}

const getRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (e) {
        console.error('getRefreshToken', e.message);
        return null;
    }
}

module.exports = { createToken, createRefreshToken, getUserFromToken, getRefreshToken, bcrypt };

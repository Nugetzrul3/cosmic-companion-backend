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

const getCookie = (cookieString, cookieName) => {
    if (!cookieString) {
        return null; // No cookie header found
    }

    const cookies = cookieString.split(';'); // Split the string into individual cookie parts
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim(); // Trim whitespace
        // Find the index of the first '=' to separate name and value
        const eqIndex = cookie.indexOf('=');
        if (eqIndex > -1) {
            const name = cookie.substring(0, eqIndex);
            const value = cookie.substring(eqIndex + 1);

            if (name === cookieName) {
                return decodeURIComponent(value); // Decode the value and return
            }
        }
    }
    return null; // Cookie not found
}

module.exports = { createToken, createRefreshToken, getUserFromToken, getRefreshToken, getCookie, bcrypt };

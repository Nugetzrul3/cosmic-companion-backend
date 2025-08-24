import jwt from 'jsonwebtoken';
import { User } from "../models/User";
import {UserJWTPayload} from "../interfaces/models";

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

export const createToken = (user: User) => {
    const payload: UserJWTPayload = { id: user.id, email: user.email }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
};

export const createRefreshToken = (user: User) => {
    const payload: UserJWTPayload = { id: user.id, email: user.email }
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const getUserFromToken = (token: string): UserJWTPayload | null => {
    try {
        if (token.startsWith('Bearer ')) token = token.split(' ')[1];
        return jwt.verify(token, JWT_SECRET) as UserJWTPayload;
    } catch {
        return null;
    }
};

export const getRefreshToken = (token: string): UserJWTPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as UserJWTPayload;
    } catch {
        return null;
    }
};

export const getCookie = (cookieString: string, cookieName: string) => {
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
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'solidlims-secret';

export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
}

export function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

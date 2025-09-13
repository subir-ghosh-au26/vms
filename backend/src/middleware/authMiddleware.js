const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to protect routes by verifying JWT
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');

            // Get user from the token (without the password)
            const result = await db.query('SELECT id, username, role FROM users WHERE id = $1', [decoded.id]);
            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Not authorized, user not found' });
            }
            req.user = result.rows[0];
            next();
        } catch (error) {
            res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ error: 'Not authorized, no token' });
    }
};

// Middleware to authorize only admin roles
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Not authorized as an admin' });
    }
};
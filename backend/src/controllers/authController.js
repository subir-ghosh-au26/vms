const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => { // Helper to create users
    const { username, password, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    try {
        const result = await db.query('INSERT INTO users(username, password_hash, role) VALUES($1, $2, $3) RETURNING id, username, role', [username, password_hash, role]);
        res.status(201).json(result.rows[0]);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_default_secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
};
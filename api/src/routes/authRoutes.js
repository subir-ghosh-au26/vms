const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });

router.post('/register', registerUser);
router.post('/login', limiter, loginUser);

module.exports = router;
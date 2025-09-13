const express = require('express');
const router = express.Router();
const { verifyQrCode } = require('../controllers/scanController');

// This single route handles all the magic.
router.post('/verify', verifyQrCode);

module.exports = router;
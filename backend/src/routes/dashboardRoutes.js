const express = require('express');
const router = express.Router();
const { getDashboardStats, getActivityLogs } = require('../controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/logs', getActivityLogs);

module.exports = router;
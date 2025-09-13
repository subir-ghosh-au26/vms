const express = require('express');
const router = express.Router();
const { getDashboardStats, getActivityLogs } = require('../controllers/dashboardController');
const { protect, isAdmin } = require('../middleware/authMiddleware');


router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/logs', getActivityLogs);

module.exports = router;
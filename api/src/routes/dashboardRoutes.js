const express = require('express');
const router = express.Router();
const { getDashboardStats, getActivityLogs, getDepartmentEntriesToday } = require('../controllers/dashboardController');
const { protect, isAdmin } = require('../middleware/authMiddleware');


router.use(protect, isAdmin);

router.get('/stats', getDashboardStats);
router.get('/logs', getActivityLogs);
router.get('/department-entries', getDepartmentEntriesToday);

module.exports = router;
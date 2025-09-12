const db = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
    try {
        // Query to count vehicles currently inside (entry_time exists, exit_time is NULL)
        const vehiclesInsideQuery = "SELECT COUNT(*) FROM activity_log WHERE exit_time IS NULL";

        // Query to count total entries today
        const todaysEntriesQuery = "SELECT COUNT(*) FROM activity_log WHERE entry_time >= current_date";

        // Query to count total exits today
        const todaysExitsQuery = "SELECT COUNT(*) FROM activity_log WHERE exit_time >= current_date";

        // Execute all queries in parallel for efficiency
        const [
            vehiclesInsideResult,
            todaysEntriesResult,
            todaysExitsResult
        ] = await Promise.all([
            db.query(vehiclesInsideQuery),
            db.query(todaysEntriesQuery),
            db.query(todaysExitsQuery),
        ]);

        res.status(200).json({
            vehiclesInside: parseInt(vehiclesInsideResult.rows[0].count, 10),
            todaysEntries: parseInt(todaysEntriesResult.rows[0].count, 10),
            todaysExits: parseInt(todaysExitsResult.rows[0].count, 10),
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all activity logs with vehicle details
// @route   GET /api/logs
exports.getActivityLogs = async (req, res) => {
    const { search, startDate, endDate } = req.query;

    let query = `
    SELECT 
      al.id, al.entry_time, al.exit_time, al.entry_gate, al.exit_gate,
      v.vehicle_number, v.model, e.name AS owner_name
    FROM activity_log al
    JOIN vehicles v ON al.vehicle_id = v.id
    LEFT JOIN employees e ON v.owner_id = e.id
  `;

    const whereClauses = [];
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
        whereClauses.push(`v.vehicle_number ILIKE $${paramIndex++}`);
        queryParams.push(`%${search}%`);
    }
    if (startDate) {
        whereClauses.push(`al.entry_time >= $${paramIndex++}`);
        queryParams.push(startDate);
    }
    if (endDate) {
        // Add 1 day to the end date to include the entire day
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        whereClauses.push(`al.entry_time < $${paramIndex++}`);
        queryParams.push(nextDay.toISOString().split('T')[0]);
    }

    if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ' ORDER BY al.entry_time DESC';

    try {
        const result = await db.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
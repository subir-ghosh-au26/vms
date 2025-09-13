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
    const { search, startDate, endDate, page = 1, limit = 15 } = req.query;
    const offset = (page - 1) * limit;

    let baseQuery = `
    FROM activity_log al
    JOIN vehicles v ON al.vehicle_id = v.id
    LEFT JOIN employees e ON v.owner_id = e.id
    LEFT JOIN departments d ON v.department_id = d.id -- Join for the vehicle's assigned department
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
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        whereClauses.push(`al.entry_time < $${paramIndex++}`);
        queryParams.push(nextDay.toISOString().split('T')[0]);
    }

    if (whereClauses.length > 0) {
        baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const dataQuery = `
    SELECT 
      al.id, al.entry_time, al.exit_time, al.entry_gate, al.exit_gate,
      v.vehicle_number, v.model,
      COALESCE(e.name, d.name) AS assigned_to -- Use employee name, if NULL, use department name
    ${baseQuery} 
    ORDER BY al.entry_time DESC 
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;
    const countQuery = `SELECT COUNT(*) ${baseQuery}`;

    try {
        const dataResult = await db.query(dataQuery, [...queryParams, limit, offset]);
        const countResult = await db.query(countQuery, queryParams);

        res.status(200).json({
            data: dataResult.rows,
            total: parseInt(countResult.rows[0].count, 10),
            page: parseInt(page, 10),
            totalPages: Math.ceil(countResult.rows[0].count / limit),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get vehicle entry counts by department for today
// @route   GET /api/dashboard/department-entries
exports.getDepartmentEntriesToday = async (req, res) => {
    try {
        const query = `
      SELECT
        -- Use the vehicle's assigned department if it's a DEPT_CAR, otherwise use the employee's department
        COALESCE(d_vehicle.name, d_employee.name) AS department_name,
        COUNT(*) AS entry_count
      FROM activity_log al
      JOIN vehicles v ON al.vehicle_id = v.id
      LEFT JOIN departments d_vehicle ON v.department_id = d_vehicle.id AND v.type = 'DEPT_CAR'
      LEFT JOIN employees e ON v.owner_id = e.id
      LEFT JOIN departments d_employee ON e.department_id = d_employee.id
      -- Filter for entries that occurred today
      WHERE al.entry_time >= current_date
        AND COALESCE(d_vehicle.name, d_employee.name) IS NOT NULL
      GROUP BY department_name
      ORDER BY entry_count DESC;
    `;
        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
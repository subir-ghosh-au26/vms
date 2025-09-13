const db = require('../config/db');

// @desc    Create a new vehicle
// @route   POST /api/vehicles
exports.createVehicle = async (req, res) => {
    const { vehicle_number, model, type, owner_id, department_id, status } = req.body;
    if (!vehicle_number || !model || !type) {
        return res.status(400).json({ error: 'Vehicle number, model, and type are required' });
    }
    try {
        const result = await db.query(
            'INSERT INTO vehicles(vehicle_number, model, type, owner_id, department_id, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [vehicle_number, model, type, owner_id || null, department_id || null, status || 'ACTIVE']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: `Vehicle with number ${vehicle_number} already exists.` });
        }
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all vehicles with details
// @route   GET /api/vehicles
exports.getAllVehicles = async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let baseQuery = `
    FROM vehicles v
    LEFT JOIN employees e ON v.owner_id = e.id
    LEFT JOIN departments d ON v.department_id = d.id
  `;
    const whereClauses = [];
    const queryParams = [];
    let paramIndex = 1;

    if (search) {
        whereClauses.push(`(v.vehicle_number ILIKE $${paramIndex} OR v.model ILIKE $${paramIndex})`);
        queryParams.push(`%${search}%`);
        paramIndex++;
    }

    if (whereClauses.length > 0) {
        baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const dataQuery = `SELECT v.id, v.vehicle_number, v.model, v.type, v.status, v.qr_code_id, v.owner_id, e.name AS owner_name, v.department_id, d.name AS department_name ${baseQuery} ORDER BY v.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
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

// @desc    Get a single vehicle by ID
// @route   GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`
            SELECT 
                v.id, v.vehicle_number, v.model, v.type, v.status, v.qr_code_id,
                v.owner_id, e.name AS owner_name,
                v.department_id, d.name AS department_name
            FROM vehicles v
            LEFT JOIN employees e ON v.owner_id = e.id
            LEFT JOIN departments d ON v.department_id = d.id
            WHERE v.id = $1
        `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { vehicle_number, model, type, owner_id, department_id, status } = req.body;
    if (!vehicle_number || !model || !type) {
        return res.status(400).json({ error: 'Vehicle number, model, and type are required' });
    }
    try {
        const result = await db.query(
            'UPDATE vehicles SET vehicle_number = $1, model = $2, type = $3, owner_id = $4, department_id = $5, status = $6 WHERE id = $7 RETURNING *',
            [vehicle_number, model, type, owner_id || null, department_id || null, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: `Vehicle with number ${vehicle_number} already exists.` });
        }
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
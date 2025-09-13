const db = require('../config/db');


// @desc    Create a new department
// @route   POST /api/departments
exports.createDepartment = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Department name is required' });
    }
    try {
        const result = await db.query(
            'INSERT INTO departments(name) VALUES($1) RETURNING *',
            [name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all departments
// @route   GET /api/departments
exports.getAllDepartments = async (req, res) => {
    try {
        // This now fetches directly from the database every time.
        const result = await db.query('SELECT * FROM departments ORDER BY name ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get a single department by ID
// @route   GET /api/departments/:id
exports.getDepartmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
exports.updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Department name is required' });
    }
    try {
        const result = await db.query(
            'UPDATE departments SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Department not found' });
        }
        res.status(204).send(); // 204 No Content is standard for a successful delete
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const db = require('../config/db');

// @desc    Create a new employee
// @route   POST /api/employees
exports.createEmployee = async (req, res) => {
    const { name, employee_id_str, department_id } = req.body;
    if (!name || !employee_id_str || !department_id) {
        return res.status(400).json({ error: 'Name, Employee ID, and Department ID are required' });
    }
    try {
        const result = await db.query(
            'INSERT INTO employees(name, employee_id_str, department_id) VALUES($1, $2, $3) RETURNING *',
            [name, employee_id_str, department_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get all employees with department info
// @route   GET /api/employees
exports.getAllEmployees = async (req, res) => {
    const { search } = req.query;

    let query = `
    SELECT e.id, e.name, e.employee_id_str, e.department_id, d.name AS department_name
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
  `;
    const queryParams = [];

    if (search) {
        query += ' WHERE e.name ILIKE $1 OR e.employee_id_str ILIKE $1';
        queryParams.push(`%${search}%`);
    }

    query += ' ORDER BY e.name ASC';

    try {
        const result = await db.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(`
      SELECT e.id, e.name, e.employee_id_str, e.department_id, d.name AS department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = $1
    `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// @desc    Update an employee
// @route   PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, employee_id_str, department_id } = req.body;
    if (!name || !employee_id_str || !department_id) {
        return res.status(400).json({ error: 'Name, Employee ID, and Department ID are required' });
    }
    try {
        const result = await db.query(
            'UPDATE employees SET name = $1, employee_id_str = $2, department_id = $3 WHERE id = $4 RETURNING *',
            [name, employee_id_str, department_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: `Employee with ID ${employee_id_str} already exists.` });
        }
        res.status(500).json({ error: err.message });
    }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(204).send(); // Success, no content to return
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const db = require('../config/db');

// A simple regex to check if a string is in UUID format
const isUuid = (str) => {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(str);
};

exports.verifyQrCode = async (req, res) => {
    const { qr_code_id, gate_number } = req.body;

    if (!qr_code_id) {
        return res.status(400).json({ status: 'ERROR', message: 'QR Code ID is required.' });
    }

    if (!isUuid(qr_code_id)) {
        return res.status(400).json({ status: 'REJECTED', message: 'Invalid QR Code format.' });
    }

    try {
        // Step 1: Find the vehicle and its details using the QR Code ID.
        const vehicleQuery = `
  SELECT 
    v.id, v.vehicle_number, v.model, v.type,
    e.name as owner_name,
    d_employee.name as employee_department,
    d_vehicle.name as vehicle_department   
  FROM vehicles v
  LEFT JOIN employees e ON v.owner_id = e.id
  LEFT JOIN departments d_employee ON e.department_id = d_employee.id
  LEFT JOIN departments d_vehicle ON v.department_id = d_vehicle.id
  WHERE v.qr_code_id = $1 AND v.status = 'ACTIVE'
`;
        const vehicleResult = await db.query(vehicleQuery, [qr_code_id]);

        if (vehicleResult.rows.length === 0) {
            return res.status(404).json({ status: 'REJECTED', message: 'Vehicle not registered or is inactive.' });
        }

        const vehicle = vehicleResult.rows[0];

        // Step 2: Check if this vehicle has an open entry (i.e., it's currently inside).
        const logQuery = 'SELECT id FROM activity_log WHERE vehicle_id = $1 AND exit_time IS NULL';
        const logResult = await db.query(logQuery, [vehicle.id]);

        if (logResult.rows.length > 0) {
            // --- LOGIC FOR EXIT ---
            // The vehicle is inside, so this scan is an exit.
            const logEntryId = logResult.rows[0].id;
            await db.query(
                'UPDATE activity_log SET exit_time = NOW(), exit_gate = $1 WHERE id = $2',
                [gate_number, logEntryId]
            );
            res.status(200).json({ status: 'APPROVED_EXIT', message: 'Exit recorded successfully.' });

        } else {
            // --- LOGIC FOR ENTRY ---
            // The vehicle is outside, so this scan is an entry.
            await db.query(
                'INSERT INTO activity_log(vehicle_id, entry_gate) VALUES($1, $2)',
                [vehicle.id, gate_number]
            );
            res.status(200).json({ status: 'APPROVED_ENTRY', vehicle });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'ERROR', message: 'An internal server error occurred.' });
    }
};
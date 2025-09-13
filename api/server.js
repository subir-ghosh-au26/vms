const express = require('express');
const cors = require('cors');
require('dotenv').config();


// Import routes
const departmentRoutes = require('./src/routes/departmentRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const scanRoutes = require('./src/routes/scanRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const authRoutes = require('./src/routes/authRoutes');

// Initialize the Express app
const app = express();

// Set the port from environment variables, with a default
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());


// A simple root route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Vehicle Management System' });
});


// Use routes
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
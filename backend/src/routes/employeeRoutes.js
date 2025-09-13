const express = require('express');
const router = express.Router();
const { createEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
    .get(getAllEmployees)
    .post(createEmployee);

router.route('/:id')
    .get(getEmployeeById)
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;
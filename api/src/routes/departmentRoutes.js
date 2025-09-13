const express = require('express');
const router = express.Router();
const {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
} = require('../controllers/departmentController');

router.route('/').post(createDepartment).get(getAllDepartments);
router.route('/:id').get(getDepartmentById).put(updateDepartment).delete(deleteDepartment);

module.exports = router;
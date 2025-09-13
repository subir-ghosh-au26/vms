const express = require('express');
const router = express.Router();
const {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
} = require('../controllers/vehicleController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.use(protect, isAdmin);

router.route('/')
    .post(createVehicle)
    .get(getAllVehicles);

router.route('/:id')
    .get(getVehicleById)
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;
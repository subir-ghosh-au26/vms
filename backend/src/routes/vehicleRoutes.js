const express = require('express');
const router = express.Router();
const {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
} = require('../controllers/vehicleController');

router.route('/')
    .post(createVehicle)
    .get(getAllVehicles);

router.route('/:id')
    .get(getVehicleById)
    .put(updateVehicle)
    .delete(deleteVehicle);

module.exports = router;
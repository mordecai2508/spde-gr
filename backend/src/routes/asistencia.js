const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');

router.get('/', asistenciaController.getAll);
router.get('/:id', asistenciaController.getById);
router.post('/', asistenciaController.create);
router.put('/:id', asistenciaController.update);
router.delete('/:id', asistenciaController.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createCalificacion, getCalificaciones, getCalificacionById, updateCalificacion, deleteCalificacion } = require('../controllers/calificacionController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/', createCalificacion);
router.get('/', getCalificaciones);
router.get('/:id', getCalificacionById);
router.put('/:id', updateCalificacion);
router.delete('/:id', deleteCalificacion);

module.exports = router;

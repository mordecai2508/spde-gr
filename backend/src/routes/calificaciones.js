const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createCalificacion, getCalificaciones, getCalificacionById, updateCalificacion, deleteCalificacion } = require('../controllers/calificacionController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/calificacion', createCalificacion);
router.get('/calificacion', getCalificaciones);
router.get('/calificacion/:id', getCalificacionById);
router.put('/calificacion/:id', updateCalificacion);
router.delete('/calificacion/:id', deleteCalificacion);

module.exports = router;

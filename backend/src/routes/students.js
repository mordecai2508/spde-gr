const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createEstudiante, getEstudiantes, getEstudianteById, updateEstudiante, deleteEstudiante } = require('../controllers/studentController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/estudiante', createEstudiante);
router.get('/estudiante', getEstudiantes);
router.get('/estudiante/:id', getEstudianteById);
router.put('/estudiante/:id', updateEstudiante);
router.delete('/estudiante/:id', deleteEstudiante);

module.exports = router;
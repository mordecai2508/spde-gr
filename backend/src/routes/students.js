const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createEstudiante, getEstudiantes, getEstudianteById, updateEstudiante, deleteEstudiante, uploadEstudiantes } = require('../controllers/studentController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/', createEstudiante);
router.post('/upload', uploadEstudiantes);
router.get('/', getEstudiantes);
router.get('/:id', getEstudianteById);
router.put('/:id', updateEstudiante);
router.delete('/:id', deleteEstudiante);

module.exports = router;
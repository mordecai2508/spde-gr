const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createEstudianteCurso, getEstudianteCursos, getEstudianteCursoById, updateEstudianteCurso, deleteEstudianteCurso } = require('../controllers/estudianteCursoController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR']));

router.post('/estudiantecurso', createEstudianteCurso);
router.get('/estudiantecurso', getEstudianteCursos);
router.get('/estudiantecurso/:id', getEstudianteCursoById);
router.put('/estudiantecurso/:id', updateEstudianteCurso);
router.delete('/estudiantecurso/:id', deleteEstudianteCurso);

module.exports = router;

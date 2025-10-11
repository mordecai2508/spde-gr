const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createEstudianteCurso, getEstudianteCursos, getEstudianteCursoById, updateEstudianteCurso, deleteEstudianteCurso } = require('../controllers/estudianteCursoController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR']));

router.post('/', createEstudianteCurso);
router.get('/', getEstudianteCursos);
router.get('/:id', getEstudianteCursoById);
router.put('/:id', updateEstudianteCurso);
router.delete('/:id', deleteEstudianteCurso);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createDocenteCurso, getDocenteCursos, getDocenteCursoById, updateDocenteCurso, deleteDocenteCurso } = require('../controllers/docenteCursoController.js');

// Protected routes

router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.get('/', getDocenteCursos);
router.get('/:id', getDocenteCursoById);
router.post('/', createDocenteCurso);
router.put('/:id', updateDocenteCurso);
router.delete('/:id', deleteDocenteCurso);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createDocenteCurso, getDocenteCursos, getDocenteCursoById, updateDocenteCurso, deleteDocenteCurso } = require('../controllers/docenteCursoController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR']));

router.post('/docentecurso', createDocenteCurso);
router.get('/docentecurso', getDocenteCursos);
router.get('/docentecurso/:id', getDocenteCursoById);
router.put('/docentecurso/:id', updateDocenteCurso);
router.delete('/docentecurso/:id', deleteDocenteCurso);

module.exports = router;

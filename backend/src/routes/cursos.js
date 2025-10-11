const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { getCursos, getCursoById, createCurso, updateCurso, deleteCurso } = require('../controllers/cursoController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR']));

router.get('/', getCursos);
router.get('/:id', getCursoById);
router.post('/', createCurso);
router.put('/:id', updateCurso);
router.delete('/:id', deleteCurso);

module.exports = router;

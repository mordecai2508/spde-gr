const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { getCursos, getCursoById, createCurso, updateCurso, deleteCurso } = require('../controllers/cursoController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR']));

router.get('/curso', getCursos);
router.get('/curso/:id', getCursoById);
router.post('/curso', createCurso);
router.put('/curso/:id', updateCurso);
router.delete('/curso/:id', deleteCurso);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createAsistencia, getAsistencias, getAsistenciaById, updateAsistencia, deleteAsistencia } = require('../controllers/asistenciaController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/', createAsistencia);
router.get('/', getAsistencias);
router.get('/:id', getAsistenciaById);
router.put('/:id', updateAsistencia);
router.delete('/:id', deleteAsistencia);

module.exports = router;

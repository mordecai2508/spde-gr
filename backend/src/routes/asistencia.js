const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createAsistencia, getAsistencias, getAsistenciaById, updateAsistencia, deleteAsistencia } = require('../controllers/asistenciaController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/asistencia', createAsistencia);
router.get('/asistencia', getAsistencias);
router.get('/asistencia/:id', getAsistenciaById);
router.put('/asistencia/:id', updateAsistencia);
router.delete('/asistencia/:id', deleteAsistencia);

module.exports = router;

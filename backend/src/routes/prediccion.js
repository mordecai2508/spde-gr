const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createPrediccion, getPredicciones, getPrediccionById, updatePrediccion, deletePrediccion } = require('../controllers/prediccionController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/prediccion', createPrediccion);
router.get('/prediccion', getPredicciones);
router.get('/prediccion/:id', getPrediccionById);
router.put('/prediccion/:id', updatePrediccion);
router.delete('/prediccion/:id', deletePrediccion);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authorizeRole } = require('../middleware/roles.js');
const auth = require('../middleware/auth');
const { createPrediccion, getPredicciones, getPrediccionById, updatePrediccion, deletePrediccion } = require('../controllers/prediccionController.js');

// Protected routes
router.use(auth);
router.use(authorizeRole(['COORDINADOR', 'DOCENTE']));

router.post('/', createPrediccion);
router.get('/', getPredicciones);
router.get('/:id', getPrediccionById);
router.put('/:id', updatePrediccion);
router.delete('/:id', deletePrediccion);

module.exports = router;

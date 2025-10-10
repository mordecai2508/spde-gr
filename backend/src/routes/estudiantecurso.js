const express = require('express');
const router = express.Router();
const estudianteCursoController = require('../controllers/estudianteCursoController');

router.get('/', estudianteCursoController.getAll);
router.get('/:id', estudianteCursoController.getById);
router.post('/', estudianteCursoController.create);
router.put('/:id', estudianteCursoController.update);
router.delete('/:id', estudianteCursoController.delete);

module.exports = router;

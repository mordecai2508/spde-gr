const express = require('express');
const router = express.Router();
const docenteCursoController = require('../controllers/docenteCursoController');

router.get('/', docenteCursoController.getAll);
router.get('/:id', docenteCursoController.getById);
router.post('/', docenteCursoController.create);
router.put('/:id', docenteCursoController.update);
router.delete('/:id', docenteCursoController.delete);

module.exports = router;

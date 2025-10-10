const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

router.get('/', cursoController.getAll);
router.get('/:id', cursoController.getById);
router.post('/', cursoController.create);
router.put('/:id', cursoController.update);
router.delete('/:id', cursoController.delete);

module.exports = router;

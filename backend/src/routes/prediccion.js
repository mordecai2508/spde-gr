const express = require('express');
const router = express.Router();
const prediccionController = require('../controllers/prediccionController');

router.get('/', prediccionController.getAll);
router.get('/:id', prediccionController.getById);
router.post('/', prediccionController.create);
router.put('/:id', prediccionController.update);
router.delete('/:id', prediccionController.delete);

module.exports = router;

const prediccionService = require('../services/prediccionService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createPrediccion = [
  body('id_estudiante').isInt(),
  body('probabilidad_desercion').isFloat({ min: 0, max: 1 }),
  body('fecha_prediccion').isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const prediccion = await prediccionService.create(req.body);
      res.status(201).json(prediccion);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getPredicciones = async (req, res) => {
  try {
    const predicciones = await prediccionService.findAll();
    res.json(predicciones);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getPrediccionById = async (req, res) => {
  try {
    const prediccion = await prediccionService.findById(req.params.id);
    if (prediccion) {
      res.json(prediccion);
    } else {
      res.status(404).json({ error: 'Predicción no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updatePrediccion = [
  body('id_estudiante').optional().isInt(),
  body('probabilidad_desercion').optional().isFloat({ min: 0, max: 1 }),
  body('fecha_prediccion').optional().isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await prediccionService.update(req.params.id, req.body);
      if (updated) {
        const updatedPrediccion = await prediccionService.findById(req.params.id);
        res.json(updatedPrediccion);
      } else {
        res.status(404).json({ error: 'Predicción no encontrada' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deletePrediccion = async (req, res) => {
  try {
    const deleted = await prediccionService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    }
    else {
      res.status(404).json({ error: 'Predicción no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPrediccion,
  getPredicciones,
  getPrediccionById,
  updatePrediccion,
  deletePrediccion,
};

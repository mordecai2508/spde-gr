const calificacionService = require('../services/calificacionService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createCalificacion = [
  body('id_estudiante_curso').isInt(),
  body('calificacion').isFloat({ min: 0, max: 5 }),
  body('fecha_calificacion').isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const calificacion = await calificacionService.create(req.body);
      res.status(201).json(calificacion);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getCalificaciones = async (req, res) => {
  try {
    const calificaciones = await calificacionService.findAll();
    res.json(calificaciones);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCalificacionById = async (req, res) => {
  try {
    const calificacion = await calificacionService.findById(req.params.id);
    if (calificacion) {
      res.json(calificacion);
    } else {
      res.status(404).json({ error: 'Calificación no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCalificacion = [
  body('id_estudiante_curso').optional().isInt(),
  body('calificacion').optional().isFloat({ min: 0, max: 5 }),
  body('fecha_calificacion').optional().isISO8601().toDate(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await calificacionService.update(req.params.id, req.body);
      if (updated) {
        const updatedCalificacion = await calificacionService.findById(req.params.id);
        res.json(updatedCalificacion);
      } else {
        res.status(404).json({ error: 'Calificación no encontrada' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteCalificacion = async (req, res) => {
  try {
    const deleted = await calificacionService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Calificación no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCalificacion,
  getCalificaciones,
  getCalificacionById,
  updateCalificacion,
  deleteCalificacion,
};

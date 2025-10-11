const asistenciaService = require('../services/asistenciaService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createAsistencia = [
  body('id_estudiante_curso').isInt(),
  body('fecha').isISO8601().toDate(),
  body('asistio').isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const asistencia = await asistenciaService.create(req.body);
      res.status(201).json(asistencia);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getAsistencias = async (req, res) => {
  try {
    const asistencias = await asistenciaService.findAll();
    res.json(asistencias);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAsistenciaById = async (req, res) => {
  try {
    const asistencia = await asistenciaService.findById(req.params.id);
    if (asistencia) {
      res.json(asistencia);
    } else {
      res.status(404).json({ error: 'Asistencia no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateAsistencia = [
  body('id_estudiante_curso').optional().isInt(),
  body('fecha').optional().isISO8601().toDate(),
  body('asistio').optional().isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await asistenciaService.update(req.params.id, req.body);
      if (updated) {
        const updatedAsistencia = await asistenciaService.findById(req.params.id);
        res.json(updatedAsistencia);
      } else {
        res.status(404).json({ error: 'Asistencia no encontrada' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteAsistencia = async (req, res) => {
  try {
    const deleted = await asistenciaService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Asistencia no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAsistencia,
  getAsistencias,
  getAsistenciaById,
  updateAsistencia,
  deleteAsistencia,
};

const docenteCursoService = require('../services/docenteCursoService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createDocenteCurso = [
  body('id_docente').isInt(),
  body('id_curso').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const docenteCurso = await docenteCursoService.create(req.body);
      res.status(201).json(docenteCurso);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getDocenteCursos = async (req, res) => {
  try {
    const docenteCursos = await docenteCursoService.findAll();
    res.json(docenteCursos);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getDocenteCursoById = async (req, res) => {
  try {
    const docenteCurso = await docenteCursoService.findById(req.params.id);
    if (docenteCurso) {
      res.json(docenteCurso);
    } else {
      res.status(404).json({ error: 'Asignación no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateDocenteCurso = [
  body('id_docente').optional().isInt(),
  body('id_curso').optional().isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await docenteCursoService.update(req.params.id, req.body);
      if (updated) {
        const updatedDocenteCurso = await docenteCursoService.findById(req.params.id);
        res.json(updatedDocenteCurso);
      } else {
        res.status(404).json({ error: 'Asignación no encontrada' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteDocenteCurso = async (req, res) => {
  try {
    const deleted = await docenteCursoService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Asignación no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDocenteCurso,
  getDocenteCursos,
  getDocenteCursoById,
  updateDocenteCurso,
  deleteDocenteCurso,
};

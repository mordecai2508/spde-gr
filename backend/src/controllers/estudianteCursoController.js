const estudianteCursoService = require('../services/estudianteCursoService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createEstudianteCurso = [
  body('id_estudiante').isInt(),
  body('id_curso').isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const estudianteCurso = await estudianteCursoService.create(req.body);
      res.status(201).json(estudianteCurso);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getEstudianteCursos = async (req, res) => {
  try {
    const estudianteCursos = await estudianteCursoService.findAll();
    res.json(estudianteCursos);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getEstudianteCursoById = async (req, res) => {
  try {
    const estudianteCurso = await estudianteCursoService.findById(req.params.id);
    if (estudianteCurso) {
      res.json(estudianteCurso);
    } else {
      res.status(404).json({ error: 'Asignación no encontrada' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateEstudianteCurso = [
  body('id_estudiante').optional().isInt(),
  body('id_curso').optional().isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await estudianteCursoService.update(req.params.id, req.body);
      if (updated) {
        const updatedEstudianteCurso = await estudianteCursoService.findById(req.params.id);
        res.json(updatedEstudianteCurso);
      } else {
        res.status(404).json({ error: 'Asignación no encontrada' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteEstudianteCurso = async (req, res) => {
  try {
    const deleted = await estudianteCursoService.delete(req.params.id);
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
  createEstudianteCurso,
  getEstudianteCursos,
  getEstudianteCursoById,
  updateEstudianteCurso,
  deleteEstudianteCurso,
};

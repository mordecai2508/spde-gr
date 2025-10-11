const cursoService = require('../services/cursoService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createCurso = [
  body('nombre_curso').isLength({ min: 1 }).trim().escape(),
  body('descripcion').isLength({ min: 1 }).trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const curso = await cursoService.create(req.body);
      res.status(201).json(curso);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getCursos = async (req, res) => {
  try {
    const cursos = await cursoService.findAll();
    res.json(cursos);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getCursoById = async (req, res) => {
  try {
    const curso = await cursoService.findById(req.params.id);
    if (curso) {
      res.json(curso);
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateCurso = [
  body('nombre_curso').optional().isLength({ min: 1 }).trim().escape(),
  body('descripcion').optional().isLength({ min: 1 }).trim().escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [updated] = await cursoService.update(req.params.id, req.body);
      if (updated) {
        const updatedCurso = await cursoService.findById(req.params.id);
        res.json(updatedCurso);
      } else {
        res.status(404).json({ error: 'Curso no encontrado' });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
];

const deleteCurso = async (req, res) => {
  try {
    const deleted = await cursoService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Curso no encontrado' });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCurso,
  getCursos,
  getCursoById,
  updateCurso,
  deleteCurso,
};

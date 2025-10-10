const studentService = require('../services/studentService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const createEstudiante = [
  // Validación para campos de la tabla estudiantes
  body('nombre').isLength({ min: 1 }).trim().escape(),
  body('documento').isLength({ min: 1 }).trim().escape(),
  body('edad').isInt({ min: 15, max: 100 }),
  body('genero').isIn(['M', 'F', 'OTRO']),
  body('programa').isLength({ min: 1 }).trim().escape(),
  body('estrato').isInt({ min: 1, max: 6 }),
  body('trabaja').isBoolean(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const estudiante = await studentService.create(req.body);
      res.status(201).json(estudiante);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },
];

const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await studentService.findAll();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export CRUD handlers...

const getEstudianteById = async (req, res) => {
  try {
    const estudiante = await studentService.findById(req.params.id);
    if (estudiante) {
      res.json(estudiante);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEstudiante = async (req, res) => {
  try {
    const [updated] = await studentService.update(req.params.id, req.body);
    if (updated) {
      const updatedEstudiante = await studentService.findById(req.params.id);
      res.json(updatedEstudiante);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEstudiante = async (req, res) => {
  try {
    const deleted = await studentService.delete(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createEstudiante, getEstudiantes, getEstudianteById, updateEstudiante, deleteEstudiante };
const studentService = require('../services/studentService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger'); // Este es un ejemplo de cómo podrías usar un logger
const multer = require('multer');
const fs = require('fs');
const csv = require('fast-csv');
const upload = multer({ dest: 'uploads/' });

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


const getEstudianteById = async (req, res) => {
  try {
    const estudiante = await studentService.findById(req.params.id);
    if (estudiante) {
      res.json(estudiante);
    } else {
      res.status(404).json({ error: 'Estudiante no encontrado 1' });
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
      res.status(404).json({ error: 'Estudiante no encontrado 2' });
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
      res.status(404).json({ error: 'Estudiante no encontrado 3' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadEstudiantes = [
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const results = [];
    const errors = [];
    let processedRows = 0;

    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on('error', error => {
        logger.error(error);
        res.status(500).json({ error: 'Error parsing CSV file' });
      })
      .on('data', row => {
        // Basic validation, you can expand this based on your model
        if (row.nombre && row.documento) {
          results.push(row);
        } else {
          errors.push({ row, error: 'Missing required fields' });
        }
      })
      .on('end', async rowCount => {
        logger.info(`Parsed ${rowCount} rows`);
        for (const studentData of results) {
          try {
            await studentService.create(studentData);
            processedRows++;
          } catch (error) {
            errors.push({ row: studentData, error: error.message });
          }
        }
        fs.unlinkSync(req.file.path); // remove uploaded file
        res.status(200).json({
          message: 'CSV processed',
          created: processedRows,
          errors: errors,
        });
      });
  },
];

module.exports = { createEstudiante, getEstudiantes, getEstudianteById, updateEstudiante, deleteEstudiante, uploadEstudiantes };
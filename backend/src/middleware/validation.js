
const { body, param } = require('express-validator');

// Validaciones para Asistencia
const validateAsistencia = [
	body('id_estudiante').isInt().withMessage('id_estudiante debe ser entero'),
	body('id_curso').isInt().withMessage('id_curso debe ser entero'),
	body('fecha').isISO8601().withMessage('fecha debe ser válida'),
	body('estado').isIn(['presente', 'ausente', 'tarde']).withMessage('estado inválido'),
];

// Validaciones para Calificacion
const validateCalificacion = [
	body('id_estudiante').isInt().withMessage('id_estudiante debe ser entero'),
	body('id_curso').isInt().withMessage('id_curso debe ser entero'),
	body('nota').isFloat({ min: 0, max: 20 }).withMessage('nota debe estar entre 0 y 20'),
	body('fecha').isISO8601().withMessage('fecha debe ser válida'),
];

// Validaciones para Curso
const validateCurso = [
	body('nombre_curso').isString().notEmpty(),
	body('codigo').isString().notEmpty(),
];

// Validaciones para DocenteCurso
const validateDocenteCurso = [
	body('id_docente').isInt().withMessage('id_docente debe ser entero'),
	body('id_curso').isInt().withMessage('id_curso debe ser entero'),
];

// Validaciones para EstudianteCurso
const validateEstudianteCurso = [
	body('id_estudiante').isInt().withMessage('id_estudiante debe ser entero'),
	body('id_curso').isInt().withMessage('id_curso debe ser entero'),
];

// Validaciones para Prediccion
const validatePrediccion = [
	body('id_estudiante').isInt().withMessage('id_estudiante debe ser entero'),
	body('riesgo').isFloat({ min: 0, max: 1 }).withMessage('riesgo debe estar entre 0 y 1'),
	body('fecha').isISO8601().withMessage('fecha debe ser válida'),
];

module.exports = {
	validateAsistencia,
	validateCalificacion,
	validateCurso,
	validateDocenteCurso,
	validateEstudianteCurso,
	validatePrediccion,
};

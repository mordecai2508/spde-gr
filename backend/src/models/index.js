
const sequelize = require('../config/database');
const Estudiante = require('../../../../spde-api/models/Estudiante')(sequelize);
const Usuario = require('./Usuario');
const Asistencia = require('./Asistencia');
const Calificacion = require('./Calificacion');
const Curso = require('./Curso');
const DocenteCurso = require('./DocenteCurso');
const EstudianteCurso = require('./EstudianteCurso');
const Prediccion = require('./Prediccion');


// Relaciones según claves foráneas del SQL
// Asistencia: pertenece a Estudiante y Curso
Asistencia.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });
Asistencia.belongsTo(Curso, { foreignKey: 'id_curso' });
Estudiante.hasMany(Asistencia, { foreignKey: 'id_estudiante' });
Curso.hasMany(Asistencia, { foreignKey: 'id_curso' });

// Calificacion: pertenece a Estudiante y Curso
Calificacion.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });
Calificacion.belongsTo(Curso, { foreignKey: 'id_curso' });
Estudiante.hasMany(Calificacion, { foreignKey: 'id_estudiante' });
Curso.hasMany(Calificacion, { foreignKey: 'id_curso' });

// DocenteCurso: pertenece a Usuario y Curso
DocenteCurso.belongsTo(Usuario, { foreignKey: 'id_docente' });
DocenteCurso.belongsTo(Curso, { foreignKey: 'id_curso' });
Usuario.hasMany(DocenteCurso, { foreignKey: 'id_docente' });
Curso.hasMany(DocenteCurso, { foreignKey: 'id_curso' });

// EstudianteCurso: pertenece a Estudiante y Curso
EstudianteCurso.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });
EstudianteCurso.belongsTo(Curso, { foreignKey: 'id_curso' });
Estudiante.hasMany(EstudianteCurso, { foreignKey: 'id_estudiante' });
Curso.hasMany(EstudianteCurso, { foreignKey: 'id_curso' });

// Prediccion: pertenece a Estudiante
Prediccion.belongsTo(Estudiante, { foreignKey: 'id_estudiante' });
Estudiante.hasMany(Prediccion, { foreignKey: 'id_estudiante' });



sequelize.sync().then(() => console.log('DB synced'));

module.exports = {
	sequelize,
	Estudiante,
	Usuario,
	Asistencia,
	Calificacion,
	Curso,
	DocenteCurso,
	EstudianteCurso,
	Prediccion
};
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstudianteCurso = sequelize.define('EstudianteCurso', {
  id_estudiante_curso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
  id_curso: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'estudiante_curso',
  timestamps: false
});

module.exports = EstudianteCurso;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
  id_curso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre_curso: { type: DataTypes.STRING(255), allowNull: false },
  codigo: { type: DataTypes.STRING(20), allowNull: false },
}, {
  tableName: 'cursos',
  timestamps: false
});

module.exports = Curso;

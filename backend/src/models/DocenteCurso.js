const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DocenteCurso = sequelize.define('DocenteCurso', {
  id_docente_curso: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_docente: { type: DataTypes.INTEGER, allowNull: false },
  id_curso: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'docente_curso',
  timestamps: false
});

module.exports = DocenteCurso;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Asistencia = sequelize.define('Asistencia', {
  id_asistencia: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
  id_curso: { type: DataTypes.INTEGER, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  estado: { type: DataTypes.ENUM('presente', 'ausente', 'tarde'), allowNull: false },
  registrado_por: { type: DataTypes.INTEGER },
}, {
  tableName: 'asistencia',
  timestamps: false
});

module.exports = Asistencia;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Calificacion = sequelize.define('Calificacion', {
  id_calificacion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
  id_curso: { type: DataTypes.INTEGER, allowNull: false },
  nota: { type: DataTypes.FLOAT, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  registrado_por: { type: DataTypes.INTEGER },
}, {
  tableName: 'calificaciones',
  timestamps: false
});

module.exports = Calificacion;

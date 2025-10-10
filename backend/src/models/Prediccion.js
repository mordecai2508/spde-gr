const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prediccion = sequelize.define('Prediccion', {
  id_prediccion: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_estudiante: { type: DataTypes.INTEGER, allowNull: false },
  riesgo: { type: DataTypes.FLOAT, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  generado_por: { type: DataTypes.INTEGER },
}, {
  tableName: 'predicciones',
  timestamps: false
});

module.exports = Prediccion;

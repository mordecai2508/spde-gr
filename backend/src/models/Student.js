const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Estudiante = require('../../../../spde-api/models/Estudiante');

/**
 * Modelo Student para Sequelize.
 * No debe contener lógica de rutas ni middlewares.
 
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.CHAR(36),
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  student_code: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  first_name: { type: DataTypes.STRING(255), allowNull: false },
  last_name: { type: DataTypes.STRING(255), allowNull: false },
  // ... other fields as per schema
  status: { type: DataTypes.ENUM('activo', 'inactivo', 'graduado'), defaultValue: 'activo' },
}, {
  tableName: 'students',
  timestamps: true,
  updatedAt: 'updated_at',
});
*/

// models/Estudiante.js

module.exports = (sequelize) => {
  const Estudiante = sequelize.define('Estudiante', {
    id_estudiante: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    documento: {
      type: DataTypes.STRING(20),
      unique: true,
      validate: { notEmpty: true }
    },
    edad: {
      type: DataTypes.INTEGER,
      validate: { min: 15, max: 100 }
    },
    genero: {
      type: DataTypes.ENUM('M', 'F', 'Otro'),
      allowNull: true
    },
    programa: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estrato: {
      type: DataTypes.INTEGER,
      validate: { min: 1, max: 6 }
    },
    trabaja: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    creado_en: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'estudiantes',
    timestamps: false
  });

  return Estudiante;
};
module.exports = Estudiante;
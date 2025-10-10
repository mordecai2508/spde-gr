const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Modelo Student para Sequelize.
 * No debe contener lógica de rutas ni middlewares.
 */
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

module.exports = Student;
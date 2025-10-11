const { DataTypes } = require('sequelize');

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
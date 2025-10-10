const { Estudiante } = require('../models');
const logger = require('../utils/logger');

class EstudianteService {
  async create(data) {
    try {
      const estudiante = await Estudiante.create(data);
      logger.info(`Estudiante creado: ${estudiante.id_estudiante}`);
      return estudiante;
    } catch (error) {
      logger.error(`Error al crear estudiante: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await Estudiante.findAll();
  }

  async findById(id_estudiante) {
    return await Estudiante.findByPk(id_estudiante);
  }

  async update(id_estudiante, data) {
    return await Estudiante.update(data, { where: { id_estudiante } });
  }

  async delete(id_estudiante) {
    return await Estudiante.destroy({ where: { id_estudiante } });
  }
}

module.exports = new EstudianteService();
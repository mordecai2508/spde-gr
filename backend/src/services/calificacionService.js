const { Calificacion } = require('../models');
const logger = require('../utils/logger');

class CalificacionService {
  async create(data) {
    try {
      const calificacion = await Calificacion.create(data);
      logger.info(`Calificacion creada: ${calificacion.id_calificacion}`);
      return calificacion;
    } catch (error) {
      logger.error(`Error al crear calificacion: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await Calificacion.findAll();
  }

  async findById(id) {
    return await Calificacion.findByPk(id);
  }

  async update(id, data) {
    return await Calificacion.update(data, { where: { id_calificacion: id } });
  }

  async delete(id) {
    return await Calificacion.destroy({ where: { id_calificacion: id } });
  }
}

module.exports = new CalificacionService();
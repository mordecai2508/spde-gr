const { Asistencia } = require('../models');
const logger = require('../utils/logger');

class AsistenciaService {
  async create(data) {
    try {
      const asistencia = await Asistencia.create(data);
      logger.info(`Asistencia creada: ${asistencia.id_asistencia}`);
      return asistencia;
    } catch (error) {
      logger.error(`Error al crear asistencia: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await Asistencia.findAll();
  }

  async findById(id) {
    return await Asistencia.findByPk(id);
  }

  async update(id, data) {
    return await Asistencia.update(data, { where: { id_asistencia: id } });
  }

  async delete(id) {
    return await Asistencia.destroy({ where: { id_asistencia: id } });
  }
}

module.exports = new AsistenciaService();
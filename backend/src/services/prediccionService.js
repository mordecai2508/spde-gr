const { Prediccion } = require('../models');
const logger = require('../utils/logger');

class PrediccionService {
  async create(data) {
    try {
      const prediccion = await Prediccion.create(data);
      logger.info(`Prediccion creada: ${prediccion.id_prediccion}`);
      return prediccion;
    } catch (error) {
      logger.error(`Error al crear prediccion: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await Prediccion.findAll();
  }

  async findById(id) {
    return await Prediccion.findByPk(id);
  }

  async update(id, data) {
    return await Prediccion.update(data, { where: { id_prediccion: id } });
  }

  async delete(id) {
    return await Prediccion.destroy({ where: { id_prediccion: id } });
  }
}

module.exports = new PrediccionService();
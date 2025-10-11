const { DocenteCurso } = require('../models');
const logger = require('../utils/logger');

class DocenteCursoService {
  async create(data) {
    try {
      const docenteCurso = await DocenteCurso.create(data);
      logger.info(`DocenteCurso creado: ${docenteCurso.id_docente_curso}`);
      return docenteCurso;
    } catch (error) {
      logger.error(`Error al crear DocenteCurso: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await DocenteCurso.findAll();
  }

  async findById(id) {
    return await DocenteCurso.findByPk(id);
  }

  async update(id, data) {
    return await DocenteCurso.update(data, { where: { id_docente_curso: id } });
  }

  async delete(id) {
    return await DocenteCurso.destroy({ where: { id_docente_curso: id } });
  }
}

module.exports = new DocenteCursoService();
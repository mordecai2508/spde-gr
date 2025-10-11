const { Curso } = require('../models');
const logger = require('../utils/logger');

class CursoService {
  async create(data) {
    try {
      const curso = await Curso.create(data);
      logger.info(`Curso creado: ${curso.id_curso}`);
      return curso;
    } catch (error) {
      logger.error(`Error al crear curso: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await Curso.findAll();
  }

  async findById(id_curso) {
    return await Curso.findByPk(id_curso);
  }

  async update(id_curso, data) {
    return await Curso.update(data, { where: { id_curso } });
  }

  async delete(id_curso) {
    return await Curso.destroy({ where: { id_curso } });
  }
}

module.exports = new CursoService();
const { EstudianteCurso } = require('../models');
const logger = require('../utils/logger');

class EstudianteCursoService {
  async create(data) {
    try {
      const estudianteCurso = await EstudianteCurso.create(data);
      logger.info(`EstudianteCurso creado: ${estudianteCurso.id_estudiante_curso}`);
      return estudianteCurso;
    } catch (error) {
      logger.error(`Error al crear EstudianteCurso: ${error.message}`);
      throw error;
    }
  }

  async findAll() {
    return await EstudianteCurso.findAll();
  }

  async findById(id) {
    return await EstudianteCurso.findByPk(id);
  }

  async update(id, data) {
    return await EstudianteCurso.update(data, { where: { id_estudiante_curso: id } });
  }

  async delete(id) {
    return await EstudianteCurso.destroy({ where: { id_estudiante_curso: id } });
  }
}

module.exports = new EstudianteCursoService();
const DocenteCurso = require('../models/DocenteCurso');

module.exports = {
  getAll: () => DocenteCurso.findAll(),
  getById: (id) => DocenteCurso.findByPk(id),
  create: (data) => DocenteCurso.create(data),
  update: (id, data) => DocenteCurso.update(data, { where: { id_docente_curso: id } }),
  delete: (id) => DocenteCurso.destroy({ where: { id_docente_curso: id } })
};

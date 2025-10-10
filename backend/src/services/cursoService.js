const Curso = require('../models/Curso');

module.exports = {
  getAll: () => Curso.findAll(),
  getById: (id) => Curso.findByPk(id),
  create: (data) => Curso.create(data),
  update: (id, data) => Curso.update(data, { where: { id_curso: id } }),
  delete: (id) => Curso.destroy({ where: { id_curso: id } })
};

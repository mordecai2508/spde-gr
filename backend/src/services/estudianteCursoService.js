const EstudianteCurso = require('../models/EstudianteCurso');

module.exports = {
  getAll: () => EstudianteCurso.findAll(),
  getById: (id) => EstudianteCurso.findByPk(id),
  create: (data) => EstudianteCurso.create(data),
  update: (id, data) => EstudianteCurso.update(data, { where: { id_estudiante_curso: id } }),
  delete: (id) => EstudianteCurso.destroy({ where: { id_estudiante_curso: id } })
};

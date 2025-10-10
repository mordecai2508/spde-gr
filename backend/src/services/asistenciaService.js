const Asistencia = require('../models/Asistencia');

module.exports = {
  getAll: () => Asistencia.findAll(),
  getById: (id) => Asistencia.findByPk(id),
  create: (data) => Asistencia.create(data),
  update: (id, data) => Asistencia.update(data, { where: { id_asistencia: id } }),
  delete: (id) => Asistencia.destroy({ where: { id_asistencia: id } })
};

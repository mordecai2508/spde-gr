const Prediccion = require('../models/Prediccion');

module.exports = {
  getAll: () => Prediccion.findAll(),
  getById: (id) => Prediccion.findByPk(id),
  create: (data) => Prediccion.create(data),
  update: (id, data) => Prediccion.update(data, { where: { id_prediccion: id } }),
  delete: (id) => Prediccion.destroy({ where: { id_prediccion: id } })
};

const Prediccion = require('../models/Prediccion');

module.exports = {
  async getAll(req, res) {
    try {
      const predicciones = await Prediccion.findAll();
      res.json(predicciones);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const prediccion = await Prediccion.findByPk(req.params.id);
      if (!prediccion) return res.status(404).json({ error: 'No encontrado' });
      res.json(prediccion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nueva = await Prediccion.create(req.body);
      res.status(201).json(nueva);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const prediccion = await Prediccion.findByPk(req.params.id);
      if (!prediccion) return res.status(404).json({ error: 'No encontrado' });
      await prediccion.update(req.body);
      res.json(prediccion);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const prediccion = await Prediccion.findByPk(req.params.id);
      if (!prediccion) return res.status(404).json({ error: 'No encontrado' });
      await prediccion.destroy();
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

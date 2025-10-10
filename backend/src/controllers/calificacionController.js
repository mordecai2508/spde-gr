const Calificacion = require('../models/Calificacion');

module.exports = {
  async getAll(req, res) {
    try {
      const calificaciones = await Calificacion.findAll();
      res.json(calificaciones);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const calificacion = await Calificacion.findByPk(req.params.id);
      if (!calificacion) return res.status(404).json({ error: 'No encontrado' });
      res.json(calificacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nueva = await Calificacion.create(req.body);
      res.status(201).json(nueva);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const calificacion = await Calificacion.findByPk(req.params.id);
      if (!calificacion) return res.status(404).json({ error: 'No encontrado' });
      await calificacion.update(req.body);
      res.json(calificacion);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const calificacion = await Calificacion.findByPk(req.params.id);
      if (!calificacion) return res.status(404).json({ error: 'No encontrado' });
      await calificacion.destroy();
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

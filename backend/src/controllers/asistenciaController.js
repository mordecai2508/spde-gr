const Asistencia = require('../models/Asistencia');

module.exports = {
  async getAll(req, res) {
    try {
      const asistencias = await Asistencia.findAll();
      res.json(asistencias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) return res.status(404).json({ error: 'No encontrado' });
      res.json(asistencia);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nueva = await Asistencia.create(req.body);
      res.status(201).json(nueva);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) return res.status(404).json({ error: 'No encontrado' });
      await asistencia.update(req.body);
      res.json(asistencia);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const asistencia = await Asistencia.findByPk(req.params.id);
      if (!asistencia) return res.status(404).json({ error: 'No encontrado' });
      await asistencia.destroy();
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

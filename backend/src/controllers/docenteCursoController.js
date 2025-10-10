const DocenteCurso = require('../models/DocenteCurso');

module.exports = {
  async getAll(req, res) {
    try {
      const docentesCursos = await DocenteCurso.findAll();
      res.json(docentesCursos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const docenteCurso = await DocenteCurso.findByPk(req.params.id);
      if (!docenteCurso) return res.status(404).json({ error: 'No encontrado' });
      res.json(docenteCurso);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await DocenteCurso.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const docenteCurso = await DocenteCurso.findByPk(req.params.id);
      if (!docenteCurso) return res.status(404).json({ error: 'No encontrado' });
      await docenteCurso.update(req.body);
      res.json(docenteCurso);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const docenteCurso = await DocenteCurso.findByPk(req.params.id);
      if (!docenteCurso) return res.status(404).json({ error: 'No encontrado' });
      await docenteCurso.destroy();
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

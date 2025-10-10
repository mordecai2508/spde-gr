const Curso = require('../models/Curso');

module.exports = {
  async getAll(req, res) {
    try {
      const cursos = await Curso.findAll();
      res.json(cursos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const curso = await Curso.findByPk(req.params.id);
      if (!curso) return res.status(404).json({ error: 'No encontrado' });
      res.json(curso);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await Curso.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const curso = await Curso.findByPk(req.params.id);
      if (!curso) return res.status(404).json({ error: 'No encontrado' });
      await curso.update(req.body);
      res.json(curso);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const curso = await Curso.findByPk(req.params.id);
      if (!curso) return res.status(404).json({ error: 'No encontrado' });
      await curso.destroy();
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

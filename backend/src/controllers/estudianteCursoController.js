const EstudianteCurso = require('../models/EstudianteCurso');

module.exports = {
  async getAll(req, res) {
    try {
      const estudiantesCursos = await EstudianteCurso.findAll();
      res.json(estudiantesCursos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getById(req, res) {
    try {
      const estudianteCurso = await EstudianteCurso.findByPk(req.params.id);
      if (!estudianteCurso) return res.status(404).json({ error: 'No encontrado1' });
      res.json(estudianteCurso);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const nuevo = await EstudianteCurso.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const estudianteCurso = await EstudianteCurso.findByPk(req.params.id);
      if (!estudianteCurso) return res.status(404).json({ error: 'No encontrado2' });
      await estudianteCurso.update(req.body);
      res.json(estudianteCurso);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const estudianteCurso = await EstudianteCurso.findByPk(req.params.id);
      if (!estudianteCurso) return res.status(404).json({ error: 'No encontrado3' });
      await estudianteCurso.destroy();
      res.json({ message: 'Eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

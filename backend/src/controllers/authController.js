const authService = require('../services/authService');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const register = [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('nombre').isLength({ min: 1 }),
  body('rol').isIn(['DOCENTE', 'COORDINADOR']),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await authService.createUser(req.body);
      res.status(201).json({ message: 'Usuario registrado correctamente', userId: user.id_usuario });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  },
];

const login = [
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const result = await authService.authenticate(email, password);
      res.status(200).json({
        message: 'Login exitoso',
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      logger.error(error);
      const status = error.message === 'Credenciales inválidas' ? 401 : 500;
      res.status(status).json({ error: 'Error en login', details: error.message });
    }
  },
];

module.exports = {
  register,
  login,
};

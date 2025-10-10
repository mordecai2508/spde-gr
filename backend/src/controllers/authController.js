const bcrypt = require('bcrypt');
// src/presentation/controllers/AuthController.js
//const { AuthService } = require('../services/authService');

/**
 * Controlador para manejar la autenticación de usuarios en SPDE.
 * Interactúa con AuthService en la capa de negocio.
 */

const { AuthService } = require('../services/authService');
const authService = new AuthService();

/**
 * Autentica un usuario y retorna JWT y datos básicos.
 */
exports.register = async function(req, res) {
  try {
    const { email, password, ...rest } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Guardar usuario en la base de datos con la contraseña hasheada
    // Por ejemplo:
    // await authService.createUser({ email, password: hashedPassword, ...rest });
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
};

exports.login = async function(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos', code: 400 });
    }
    const result = await authService.authenticate(email, password);
    res.status(200).json({
      message: 'Login exitoso',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    const status = error.message === 'Credenciales inválidas' ? 401 : 500;
    res.status(status).json({ error: 'Error en login', details: error.message });
  }
};

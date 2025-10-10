// src/business/services/AuthService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

/**
 * Servicio de autenticación.
 * Busca usuario por email, verifica contraseña y genera JWT.
 */
class AuthService {
  async authenticate(email, password) {
    // Buscar usuario por email
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id_usuario, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol
      }
    };
  }
}

module.exports = { AuthService };
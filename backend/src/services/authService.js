const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const logger = require('../utils/logger');

class AuthService {
  async authenticate(email, password) {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

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

  async createUser(data) {
    try {
      const { password, ...rest } = data;
      const password_hash = await bcrypt.hash(password, 10);
      const user = await Usuario.create({ ...rest, password_hash });
      logger.info(`Usuario creado: ${user.id_usuario}`);
      return user;
    } catch (error) {
      logger.error(`Error al crear usuario: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new AuthService();
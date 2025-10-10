require('dotenv').config();
const app = require('./src/app');
const logger = require('./src/utils/logger');
const sequelize = require('./src/config/database');

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    logger.info('Conexión a la base de datos exitosa');
    app.listen(PORT, () => logger.info(`Server on port ${PORT}`));
  })
  .catch((err) => {
    logger.error('Error al conectar a la base de datos:', err);
  });
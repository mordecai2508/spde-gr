const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/auth');

const app = express();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Middleware
app.use(limiter);
app.use(cors()); // Permite cualquier origen
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api', authMiddleware, [
  require('./routes/students')
]);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use(errorHandler);

module.exports = app;
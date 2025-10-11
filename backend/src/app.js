const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar todas tus rutas
const authRoutes = require('./routes/auth.js');
const studentRoutes = require('./routes/students.js');
const calificacionRoutes = require('./routes/calificaciones.js');
const prediccionRoutes = require('./routes/prediccion.js');
const asistenciaRoutes = require('./routes/asistencia.js');
const cursoRoutes = require('./routes/cursos.js');
const docenteCursoRoutes = require('./routes/docentecurso.js');
const estudianteCursoRoutes = require('./routes/estudiantecurso.js');

const app = express();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Montaje correcto de las rutas ---
// Rutas públicas (como login/register)
app.use('/api/auth', authRoutes);

// Rutas protegidas
// El middleware de autenticación ya está dentro de cada archivo de ruta,
// así que solo necesitamos montarlas en su prefijo correcto.
app.use('/api/estudiantes', studentRoutes);
app.use('/api/calificaciones', calificacionRoutes);
app.use('/api/predicciones', prediccionRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/docente-cursos', docenteCursoRoutes);
app.use('/api/estudiante-cursos', estudianteCursoRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use(errorHandler);

module.exports = app;

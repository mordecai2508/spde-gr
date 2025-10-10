-- Script de Inserción de Datos para SPDE

-- Borrar datos existentes para evitar duplicados
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM `asistencia`;
DELETE FROM `calificaciones`;
DELETE FROM `estudiante_curso`;
DELETE FROM `docente_curso`;
DELETE FROM `usuarios`;
DELETE FROM `cursos`;
DELETE FROM `estudiantes`;
SET FOREIGN_KEY_CHECKS = 1;

-- USUARIOS
-- Passwords:
-- coord@spde.com -> coordpass
-- docente@spde.com -> docentepass
INSERT INTO `usuarios` (`id_usuario`, `nombre`, `email`, `password_hash`, `rol`) VALUES
(1, 'Coordinador Admin', 'coord@spde.com', '$2a$12$z.ArN/l3qZ3C6s1j2h3g4eSk5j.F6G7H8I9J0K1L2M3N4O5P6Q7R8', 'COORDINADOR'),
(2, 'Docente Profe', 'docente@spde.com', '$2a$12$A1B2c3d4e5f6g7h8i9j0k.L9M8N7O6P5Q4R3S2T1U0V/W', 'DOCENTE');

-- CURSOS
INSERT INTO `cursos` (`id_curso`, `nombre_curso`, `codigo`) VALUES
(1, 'Nuevas Tecnologías', 'NT401'),
(2, 'Bases de Datos Avanzadas', 'BDA502'),
(3, 'Inteligencia Artificial', 'IA603');

-- ESTUDIANTES
INSERT INTO `estudiantes` (`id_estudiante`, `nombre`, `documento`, `edad`, `genero`, `programa`, `estrato`, `trabaja`) VALUES
(1, 'Ana García', '1001', 21, 'F', 'Ingeniería de Sistemas', 3, 0),
(2, 'Luis Moreno', '1002', 23, 'M', 'Ingeniería de Software', 2, 1),
(3, 'Sofía Castro', '1003', 20, 'F', 'Ingeniería de Sistemas', 3, 0),
(4, 'Carlos Ruiz', '1004', 22, 'M', 'Ingeniería de Software', 4, 1),
(5, 'Laura Jiménez', '1005', 21, 'F', 'Ingeniería de Sistemas', 2, 0);

-- DOCENTE ASIGNADO A CURSOS
INSERT INTO `docente_curso` (`id_usuario`, `id_curso`) VALUES
(2, 1), -- Docente Profe enseña Nuevas Tecnologías
(2, 2); -- Docente Profe enseña Bases de Datos Avanzadas

-- ESTUDIANTES MATRICULADOS EN CURSOS
INSERT INTO `estudiante_curso` (`id_estudiante`, `id_curso`) VALUES
(1, 1), (1, 3), -- Ana en Nuevas Tecnologías e IA
(2, 1), -- Luis en Nuevas Tecnologías
(3, 2), -- Sofía en Bases de Datos Avanzadas
(4, 2), (4, 3), -- Carlos en Bases de Datos e IA
(5, 1), (5, 2), (5, 3); -- Laura en todos los cursos

-- CALIFICACIONES DE EJEMPLO
INSERT INTO `calificaciones` (`id_estudiante`, `id_curso`, `nota`, `registrado_por`) VALUES
(1, 1, 4.5, 2), -- Ana, Nuevas Tecnologías
(2, 1, 3.2, 2), -- Luis, Nuevas Tecnologías
(3, 2, 4.8, 2), -- Sofía, Bases de Datos
(4, 2, 2.5, 2), -- Carlos, Bases de Datos
(5, 3, 5.0, 2); -- Laura, IA

-- ASISTENCIA DE EJEMPLO
INSERT INTO `asistencia` (`id_estudiante`, `id_curso`, `fecha`, `estado`, `registrado_por`) VALUES
(1, 1, CURDATE() - INTERVAL 2 DAY, 'presente', 2),
(2, 1, CURDATE() - INTERVAL 2 DAY, 'ausente', 2), -- Luis ausente
(1, 1, CURDATE() - INTERVAL 1 DAY, 'presente', 2),
(2, 1, CURDATE() - INTERVAL 1 DAY, 'presente', 2),
(3, 2, CURDATE() - INTERVAL 1 DAY, 'presente', 2),
(4, 2, CURDATE() - INTERVAL 1 DAY, 'tarde', 2);

SELECT 'La base de datos ha sido poblada con datos de ejemplo.' AS 'Estado';

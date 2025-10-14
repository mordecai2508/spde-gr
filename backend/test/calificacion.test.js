const request = require('supertest');
const app = require('../src/app');
const calificacionService = require('../src/services/calificacionService');

jest.mock('../src/services/calificacionService');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { rol: 'DOCENTE' };
    next();
}));
jest.mock('../src/middleware/roles', () => ({
    authorizeRole: jest.fn(() => (req, res, next) => next()),
}));

describe('Calificaciones Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new calificacion', async () => {
        const calificacionData = {
            id_estudiante_curso: 1,
            calificacion: 4.5,
            fecha_calificacion: new Date().toISOString(),
        };
        const createdCalificacion = { id_calificacion: 1, ...calificacionData };
        calificacionService.create.mockResolvedValue(createdCalificacion);

        const res = await request(app)
            .post('/api/calificaciones')
            .send(calificacionData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(createdCalificacion);
    });

    it('should get all calificaciones', async () => {
        const calificaciones = [{ id_calificacion: 1, calificacion: 4.5 }];
        calificacionService.findAll.mockResolvedValue(calificaciones);

        const res = await request(app).get('/api/calificaciones');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(calificaciones);
    });

    it('should get a calificacion by id', async () => {
        const calificacion = { id_calificacion: 1, calificacion: 4.5 };
        calificacionService.findById.mockResolvedValue(calificacion);

        const res = await request(app).get('/api/calificaciones/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(calificacion);
    });

    it('should return 404 when calificacion not found by id', async () => {
        calificacionService.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/calificaciones/999');

        expect(res.statusCode).toEqual(404);
    });

    it('should update a calificacion', async () => {
        const updatedCalificacionData = { calificacion: 5.0 };
        const updatedCalificacion = { id_calificacion: 1, calificacion: 5.0 };
        calificacionService.update.mockResolvedValue([1]);
        calificacionService.findById.mockResolvedValue(updatedCalificacion);

        const res = await request(app)
            .put('/api/calificaciones/1')
            .send(updatedCalificacionData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedCalificacion);
    });

    it('should return 404 when updating a calificacion that does not exist', async () => {
        calificacionService.update.mockResolvedValue([0]);

        const res = await request(app)
            .put('/api/calificaciones/999')
            .send({ calificacion: 5.0 });

        expect(res.statusCode).toEqual(404);
    });

    it('should delete a calificacion', async () => {
        calificacionService.delete.mockResolvedValue(1);

        const res = await request(app).delete('/api/calificaciones/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when deleting a calificacion that does not exist', async () => {
        calificacionService.delete.mockResolvedValue(0);

        const res = await request(app).delete('/api/calificaciones/999');

        expect(res.statusCode).toEqual(404);
    });
});
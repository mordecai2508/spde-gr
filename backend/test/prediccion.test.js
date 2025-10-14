const request = require('supertest');
const app = require('../src/app');
const prediccionService = require('../src/services/prediccionService');

jest.mock('../src/services/prediccionService');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { rol: 'DOCENTE' };
    next();
}));
jest.mock('../src/middleware/roles', () => ({
    authorizeRole: jest.fn(() => (req, res, next) => next()),
}));

describe('Prediccion Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new prediccion', async () => {
        const prediccionData = {
            id_estudiante: 1,
            probabilidad_desercion: 0.75,
            fecha_prediccion: new Date().toISOString(),
        };
        const createdPrediccion = { id_prediccion: 1, ...prediccionData };
        prediccionService.create.mockResolvedValue(createdPrediccion);

        const res = await request(app)
            .post('/api/predicciones')
            .send(prediccionData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(createdPrediccion);
    });

    it('should get all predicciones', async () => {
        const predicciones = [{ id_prediccion: 1, probabilidad_desercion: 0.75 }];
        prediccionService.findAll.mockResolvedValue(predicciones);

        const res = await request(app).get('/api/predicciones');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(predicciones);
    });

    it('should get a prediccion by id', async () => {
        const prediccion = { id_prediccion: 1, probabilidad_desercion: 0.75 };
        prediccionService.findById.mockResolvedValue(prediccion);

        const res = await request(app).get('/api/predicciones/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(prediccion);
    });

    it('should return 404 when prediccion not found by id', async () => {
        prediccionService.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/predicciones/999');

        expect(res.statusCode).toEqual(404);
    });

    it('should update a prediccion', async () => {
        const updatedPrediccionData = { probabilidad_desercion: 0.85 };
        const updatedPrediccion = { id_prediccion: 1, probabilidad_desercion: 0.85 };
        prediccionService.update.mockResolvedValue([1]);
        prediccionService.findById.mockResolvedValue(updatedPrediccion);

        const res = await request(app)
            .put('/api/predicciones/1')
            .send(updatedPrediccionData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedPrediccion);
    });

    it('should return 404 when updating a prediccion that does not exist', async () => {
        prediccionService.update.mockResolvedValue([0]);

        const res = await request(app)
            .put('/api/predicciones/999')
            .send({ probabilidad_desercion: 0.85 });

        expect(res.statusCode).toEqual(404);
    });

    it('should delete a prediccion', async () => {
        prediccionService.delete.mockResolvedValue(1);

        const res = await request(app).delete('/api/predicciones/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when deleting a prediccion that does not exist', async () => {
        prediccionService.delete.mockResolvedValue(0);

        const res = await request(app).delete('/api/predicciones/999');

        expect(res.statusCode).toEqual(404);
    });
});
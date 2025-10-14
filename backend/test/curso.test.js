const request = require('supertest');
const app = require('../src/app');
const cursoService = require('../src/services/cursoService');

jest.mock('../src/services/cursoService');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { rol: 'COORDINADOR' };
    next();
}));
jest.mock('../src/middleware/roles', () => ({
    authorizeRole: jest.fn(() => (req, res, next) => next()),
}));

describe('Cursos Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new curso', async () => {
        const cursoData = {
            nombre_curso: 'Test Course',
            descripcion: 'This is a test course.',
        };
        const createdCurso = { id_curso: 1, ...cursoData };
        cursoService.create.mockResolvedValue(createdCurso);

        const res = await request(app)
            .post('/api/cursos')
            .send(cursoData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(createdCurso);
    });

    it('should get all cursos', async () => {
        const cursos = [{ id_curso: 1, nombre_curso: 'Test Course' }];
        cursoService.findAll.mockResolvedValue(cursos);

        const res = await request(app).get('/api/cursos');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(cursos);
    });

    it('should get a curso by id', async () => {
        const curso = { id_curso: 1, nombre_curso: 'Test Course' };
        cursoService.findById.mockResolvedValue(curso);

        const res = await request(app).get('/api/cursos/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(curso);
    });

    it('should return 404 when curso not found by id', async () => {
        cursoService.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/cursos/999');

        expect(res.statusCode).toEqual(404);
    });

    it('should update a curso', async () => {
        const updatedCursoData = { nombre_curso: 'Updated Test Course' };
        const updatedCurso = { id_curso: 1, nombre_curso: 'Updated Test Course' };
        cursoService.update.mockResolvedValue([1]);
        cursoService.findById.mockResolvedValue(updatedCurso);

        const res = await request(app)
            .put('/api/cursos/1')
            .send(updatedCursoData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedCurso);
    });

    it('should return 404 when updating a curso that does not exist', async () => {
        cursoService.update.mockResolvedValue([0]);

        const res = await request(app)
            .put('/api/cursos/999')
            .send({ nombre_curso: 'test' });

        expect(res.statusCode).toEqual(404);
    });

    it('should delete a curso', async () => {
        cursoService.delete.mockResolvedValue(1);

        const res = await request(app).delete('/api/cursos/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when deleting a curso that does not exist', async () => {
        cursoService.delete.mockResolvedValue(0);

        const res = await request(app).delete('/api/cursos/999');

        expect(res.statusCode).toEqual(404);
    });
});
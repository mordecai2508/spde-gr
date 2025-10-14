const request = require('supertest');
const app = require('../src/app');
const estudianteCursoService = require('../src/services/estudianteCursoService');

jest.mock('../src/services/estudianteCursoService');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { rol: 'COORDINADOR' };
    next();
}));
jest.mock('../src/middleware/roles', () => ({
    authorizeRole: jest.fn(() => (req, res, next) => next()),
}));

describe('EstudianteCurso Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new estudiante-curso assignment', async () => {
        const estudianteCursoData = {
            id_estudiante: 1,
            id_curso: 1,
        };
        const createdEstudianteCurso = { id_estudiante_curso: 1, ...estudianteCursoData };
        estudianteCursoService.create.mockResolvedValue(createdEstudianteCurso);

        const res = await request(app)
            .post('/api/estudiante-cursos')
            .send(estudianteCursoData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(createdEstudianteCurso);
    });

    it('should get all estudiante-curso assignments', async () => {
        const estudianteCursos = [{ id_estudiante_curso: 1, id_estudiante: 1, id_curso: 1 }];
        estudianteCursoService.findAll.mockResolvedValue(estudianteCursos);

        const res = await request(app).get('/api/estudiante-cursos');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(estudianteCursos);
    });

    it('should get a estudiante-curso assignment by id', async () => {
        const estudianteCurso = { id_estudiante_curso: 1, id_estudiante: 1, id_curso: 1 };
        estudianteCursoService.findById.mockResolvedValue(estudianteCurso);

        const res = await request(app).get('/api/estudiante-cursos/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(estudianteCurso);
    });

    it('should return 404 when assignment not found by id', async () => {
        estudianteCursoService.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/estudiante-cursos/999');

        expect(res.statusCode).toEqual(404);
    });

    it('should update a estudiante-curso assignment', async () => {
        const updatedEstudianteCursoData = { id_estudiante: 2 };
        const updatedEstudianteCurso = { id_estudiante_curso: 1, id_estudiante: 2, id_curso: 1 };
        estudianteCursoService.update.mockResolvedValue([1]);
        estudianteCursoService.findById.mockResolvedValue(updatedEstudianteCurso);

        const res = await request(app)
            .put('/api/estudiante-cursos/1')
            .send(updatedEstudianteCursoData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedEstudianteCurso);
    });

    it('should return 404 when updating an assignment that does not exist', async () => {
        estudianteCursoService.update.mockResolvedValue([0]);

        const res = await request(app)
            .put('/api/estudiante-cursos/999')
            .send({ id_estudiante: 1 });

        expect(res.statusCode).toEqual(404);
    });

    it('should delete a estudiante-curso assignment', async () => {
        estudianteCursoService.delete.mockResolvedValue(1);

        const res = await request(app).delete('/api/estudiante-cursos/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when deleting an assignment that does not exist', async () => {
        estudianteCursoService.delete.mockResolvedValue(0);

        const res = await request(app).delete('/api/estudiante-cursos/999');

        expect(res.statusCode).toEqual(404);
    });
});
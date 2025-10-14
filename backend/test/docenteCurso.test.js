const request = require('supertest');
const app = require('../src/app');
const docenteCursoService = require('../src/services/docenteCursoService');

jest.mock('../src/services/docenteCursoService');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { rol: 'COORDINADOR' };
    next();
}));
jest.mock('../src/middleware/roles', () => ({
    authorizeRole: jest.fn(() => (req, res, next) => next()),
}));

describe('DocenteCurso Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a new docente-curso assignment', async () => {
        const docenteCursoData = {
            id_docente: 1,
            id_curso: 1,
        };
        const createdDocenteCurso = { id_docente_curso: 1, ...docenteCursoData };
        docenteCursoService.create.mockResolvedValue(createdDocenteCurso);

        const res = await request(app)
            .post('/api/docente-cursos')
            .send(docenteCursoData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(createdDocenteCurso);
    });

    it('should get all docente-curso assignments', async () => {
        const docenteCursos = [{ id_docente_curso: 1, id_docente: 1, id_curso: 1 }];
        docenteCursoService.findAll.mockResolvedValue(docenteCursos);

        const res = await request(app).get('/api/docente-cursos');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(docenteCursos);
    });

    it('should get a docente-curso assignment by id', async () => {
        const docenteCurso = { id_docente_curso: 1, id_docente: 1, id_curso: 1 };
        docenteCursoService.findById.mockResolvedValue(docenteCurso);

        const res = await request(app).get('/api/docente-cursos/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(docenteCurso);
    });

    it('should return 404 when assignment not found by id', async () => {
        docenteCursoService.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/docente-cursos/999');

        expect(res.statusCode).toEqual(404);
    });

    it('should update a docente-curso assignment', async () => {
        const updatedDocenteCursoData = { id_docente: 2 };
        const updatedDocenteCurso = { id_docente_curso: 1, id_docente: 2, id_curso: 1 };
        docenteCursoService.update.mockResolvedValue([1]);
        docenteCursoService.findById.mockResolvedValue(updatedDocenteCurso);

        const res = await request(app)
            .put('/api/docente-cursos/1')
            .send(updatedDocenteCursoData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedDocenteCurso);
    });

    it('should return 404 when updating an assignment that does not exist', async () => {
        docenteCursoService.update.mockResolvedValue([0]);

        const res = await request(app)
            .put('/api/docente-cursos/999')
            .send({ id_docente: 1 });

        expect(res.statusCode).toEqual(404);
    });

    it('should delete a docente-curso assignment', async () => {
        docenteCursoService.delete.mockResolvedValue(1);

        const res = await request(app).delete('/api/docente-cursos/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when deleting an assignment that does not exist', async () => {
        docenteCursoService.delete.mockResolvedValue(0);

        const res = await request(app).delete('/api/docente-cursos/999');

        expect(res.statusCode).toEqual(404);
    });
});
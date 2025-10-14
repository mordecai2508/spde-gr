const request = require('supertest');
const app = require('../src/app');
const studentService = require('../src/services/studentService');
const auth = require('../src/middleware/auth');
const { authorizeRole } = require('../src/middleware/roles');

jest.mock('../src/services/studentService');
jest.mock('../src/middleware/auth', () => jest.fn((req, res, next) => {
    req.user = { rol: 'COORDINADOR' };
    next();
}));
jest.mock('../src/middleware/roles', () => ({
    authorizeRole: jest.fn(() => (req, res, next) => next()),
}));


describe('Student CRUD', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a student', async () => {
        const studentData = {
            nombre: 'John',
            documento: '12345',
            edad: 20,
            genero: 'M',
            programa: 'Ingenieria de Sistemas',
            estrato: 3,
            trabaja: false
        };
        const createdStudent = { id_estudiante: 1, ...studentData };

        studentService.create.mockResolvedValue(createdStudent);

        const res = await request(app)
            .post('/api/estudiantes')
            .send(studentData);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual(createdStudent);
        expect(studentService.create).toHaveBeenCalledWith(studentData);
    });

    it('should get all students', async () => {
        const students = [
            { id_estudiante: 1, nombre: 'John Doe' },
            { id_estudiante: 2, nombre: 'Jane Doe' }
        ];
        studentService.findAll.mockResolvedValue(students);

        const res = await request(app).get('/api/estudiantes');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(students);
    });

    it('should get a student by id', async () => {
        const student = { id_estudiante: 1, nombre: 'John Doe' };
        studentService.findById.mockResolvedValue(student);

        const res = await request(app).get('/api/estudiantes/1');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(student);
    });

    it('should return 404 when student not found by id', async () => {
        studentService.findById.mockResolvedValue(null);

        const res = await request(app).get('/api/estudiantes/999');

        expect(res.statusCode).toEqual(404);
    });

    it('should update a student', async () => {
        const studentData = { nombre: 'John Doe Updated' };
        const updatedStudent = { id_estudiante: 1, nombre: 'John Doe Updated' };

        studentService.update.mockResolvedValue([1]); // Sequelize returns [1] on successful update
        studentService.findById.mockResolvedValue(updatedStudent);

        const res = await request(app)
            .put('/api/estudiantes/1')
            .send(studentData);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(updatedStudent);
    });

    it('should return 404 when updating a student that does not exist', async () => {
        studentService.update.mockResolvedValue([0]); // Sequelize returns [0] on unsuccessful update

        const res = await request(app)
            .put('/api/estudiantes/999')
            .send({ nombre: 'test' });

        expect(res.statusCode).toEqual(404);
    });

    it('should delete a student', async () => {
        studentService.delete.mockResolvedValue(1); // Sequelize returns 1 on successful delete

        const res = await request(app).delete('/api/estudiantes/1');

        expect(res.statusCode).toEqual(204);
    });

    it('should return 404 when deleting a student that does not exist', async () => {
        studentService.delete.mockResolvedValue(0); // Sequelize returns 0 on unsuccessful delete

        const res = await request(app).delete('/api/estudiantes/999');

        expect(res.statusCode).toEqual(404);
    });
});

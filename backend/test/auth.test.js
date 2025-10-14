const request = require('supertest');
const app = require('../src/app');
const authService = require('../src/services/authService');

jest.mock('../src/services/authService');

describe('Auth Endpoints', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const userData = {
                nombre: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                rol: 'DOCENTE',
            };
            const createdUser = { id_usuario: 1, ...userData };
            authService.createUser.mockResolvedValue(createdUser);

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Usuario registrado correctamente');
            expect(authService.createUser).toHaveBeenCalledWith(userData);
        });

        it('should not register a user with an existing email', async () => {
            const userData = {
                nombre: 'Test User 2',
                email: 'test@example.com',
                password: 'password123',
                rol: 'DOCENTE',
            };
            authService.createUser.mockRejectedValue(new Error('Email already exists'));

            const res = await request(app)
                .post('/api/auth/register')
                .send(userData);

            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error', 'Error al registrar usuario');
        });

        it('should return 400 for invalid registration data', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nombre: 'Test User',
                    email: 'not-an-email',
                    password: '123',
                    rol: 'INVALID_ROLE',
                });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login a registered user', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };
            const authResult = { token: 'some-jwt-token', user: { id: 1, email: 'test@example.com' } };
            authService.authenticate.mockResolvedValue(authResult);

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token', authResult.token);
            expect(authService.authenticate).toHaveBeenCalledWith(loginData.email, loginData.password);
        });

        it('should not login with incorrect credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };
            authService.authenticate.mockRejectedValue(new Error('Credenciales inválidas'));

            const res = await request(app)
                .post('/api/auth/login')
                .send(loginData);

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('error', 'Error en login');
        });

        it('should return 400 for invalid login data', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'not-an-email',
                });
            expect(res.statusCode).toEqual(400);
        });
    });
});
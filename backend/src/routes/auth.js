const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // Implement login with verifyPassword, generateToken

router.post('/login', login);

module.exports = router;
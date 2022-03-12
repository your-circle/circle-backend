const express = require('express');
const { registerUser } = require('../controllers/authController');

const router = express.Router();

// auth routes
router.post('/register', registerUser)

module.exports = router;
const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/login', authController.login);
router.post('/validate', authMiddleware, authController.validateToken);

module.exports = router;
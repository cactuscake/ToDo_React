const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Создание пользователя (доступно только для администраторов)
router.post('/users', authMiddleware, userController.createUserHandler);

// Получение списка подчиненных (для руководителей)
router.get('/subordinates', authMiddleware, userController.getSubordinatesHandler);

module.exports = router;
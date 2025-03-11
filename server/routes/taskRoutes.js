const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');
const { checkTaskPermissions, checkResponsibleIsSubordinate } = require('../middleware/taskPermissions');

const router = express.Router();

router.post('/tasks', authMiddleware, checkResponsibleIsSubordinate, taskController.createTaskHandler);
router.get('/tasks', authMiddleware, taskController.getTasksHandler);
router.put('/tasks/:id', authMiddleware, checkTaskPermissions, taskController.updateTaskHandler);

module.exports = router;
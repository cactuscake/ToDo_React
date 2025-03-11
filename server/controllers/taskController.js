const { createTask, getTasksByUser, updateTask } = require('../models/taskModel');

const createTaskHandler = async (req, res) => {
  const taskData = req.body;
  taskData.creatorId = req.userId;
  const task = await createTask(taskData);
  res.status(201).json(task);
};

const getTasksHandler = async (req, res) => {
  const tasks = await getTasksByUser(req.userId);
  res.json(tasks);
};

const updateTaskHandler = async (req, res) => {
  const taskId = req.params.id;
  const taskData = req.body;
  const task = await updateTask(taskId, taskData);
  res.json(task);
};

module.exports = { createTaskHandler, getTasksHandler, updateTaskHandler };
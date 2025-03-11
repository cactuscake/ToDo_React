const { createUser, getSubordinates } = require('../models/userModel');

// Создание нового пользователя
const createUserHandler = async (req, res) => {
  const { firstName, lastName, middleName, login, password, managerId } = req.body;

  try {
    const user = await createUser({ firstName, lastName, middleName, login, password, managerId });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Получение списка подчиненных
const getSubordinatesHandler = async (req, res) => {
  const { userId } = req;

  try {
    const subordinates = await getSubordinates(userId);
    res.json(subordinates);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createUserHandler, getSubordinatesHandler };
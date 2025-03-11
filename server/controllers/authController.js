const jwt = require('jsonwebtoken');
const { findUserByLogin } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
  const { login, password } = req.body;
  const user = await findUserByLogin(login);

  if (!user) {
    return res.status(400).json({ error: 'Пользователь с таким логином не существует' });
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ error: 'Неверный пароль' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

const validateToken = async (req, res) => {
  // Пользователь уже авторизован (проверено в authMiddleware)
  const user = req.user; // Данные пользователя из токена
  res.json({ user });
};

module.exports = { login, validateToken };
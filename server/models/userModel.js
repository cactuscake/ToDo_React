const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (userData) => {
  const { firstName, lastName, middleName, login, password, managerId } = userData;
  const passwordHash = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (first_name, last_name, middle_name, login, password_hash, manager_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [firstName, lastName, middleName, login, passwordHash, managerId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByLogin = async (login) => {
  const query = 'SELECT * FROM users WHERE login = $1';
  const result = await pool.query(query, [login]);
  return result.rows[0];
};

const getSubordinates = async (managerId) => {
  const query = 'SELECT * FROM users WHERE manager_id = $1';
  const result = await pool.query(query, [managerId]);
  console.log(managerId)
  console.log(result.rows)
  return result.rows;
};

module.exports = { createUser, findUserByLogin, getSubordinates };
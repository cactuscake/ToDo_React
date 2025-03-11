const pool = require('../config/db');

const createTask = async (taskData) => {
  //console.log(taskData)
  const { title, description, dueDate, priority, status, creatorId, responsible } = taskData;
  //console.log(responsible)
  const query = `
    INSERT INTO tasks (title, description, due_date, priority, status, creator_id, responsible_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [title, description, dueDate, priority, status, creatorId, responsible];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getTasksByUser = async (userId) => {
  const query = `
    SELECT * FROM tasks
    WHERE creator_id = $1 OR responsible_id = $1
    ORDER BY updated_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

const updateTask = async (taskId, taskData) => {
  const { title, description, dueDate, priority, status } = taskData;
  const query = `
    UPDATE tasks
    SET title = $1, description = $2, due_date = $3, priority = $4, status = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *;
  `;
  const values = [title, description, dueDate, priority, status, taskId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { createTask, getTasksByUser, updateTask };
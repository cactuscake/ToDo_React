const pool = require('../config/db');

/**
 * Middleware для проверки прав на изменение задачи.
 * Если задача создана руководителем пользователя, то пользователь может изменить только статус.
 */
const checkTaskPermissions = async (req, res, next) => {
  const taskId = req.params.id || req.body.id; // ID задачи из параметров или тела запроса
  const userId = req.userId; // ID текущего пользователя

  try {
    // Получаем задачу из базы данных
    const taskQuery = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    const task = taskQuery.rows[0];

    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    // Получаем руководителя текущего пользователя
    const userQuery = await pool.query('SELECT manager_id FROM users WHERE id = $1', [userId]);
    const user = userQuery.rows[0];

    // Если задача создана руководителем пользователя
    if (task.creator_id === user.manager_id) {
      // Разрешаем изменять только статус
      if (req.method === 'PUT' && Object.keys(req.body).every(key => key === 'status')) {
        return next();
      } else {
        return res.status(403).json({ error: 'Вы можете изменить только статус задачи' });
      }
    }

    next();
  } catch (error) {
    console.error('Ошибка при проверке прав:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

/**
 * Middleware для проверки, что ответственный является подчиненным текущего пользователя.
 */
const checkResponsibleIsSubordinate = async (req, res, next) => {
  const { responsibleId } = req.body; // ID ответственного из тела запроса
  const userId = req.userId; // ID текущего пользователя

  try {
    // Если ответственный не указан, пропускаем проверку
    if (!responsibleId) {
      return next();
    }

    // Получаем подчиненных текущего пользователя
    const subordinatesQuery = await pool.query('SELECT id FROM users WHERE manager_id = $1', [userId]);
    const subordinates = subordinatesQuery.rows.map(row => row.id);

    // Проверяем, что ответственный является подчиненным
    if (!subordinates.includes(responsibleId)) {
      return res.status(403).json({ error: 'Ответственный должен быть вашим подчиненным' });
    }

    next();
  } catch (error) {
    console.error('Ошибка при проверке ответственного:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = { checkTaskPermissions, checkResponsibleIsSubordinate };
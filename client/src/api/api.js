const API_BASE_URL = 'http://localhost:5000';

export const login = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  };
  
  export const getTasks = async () => {
    const token = localStorage.getItem('token');
  
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.status === 401) {
      // Ошибка авторизации
      localStorage.removeItem('token');
      window.location.href = '/login'; // Перенаправляем на страницу авторизации
      return;
    }
  
    if (!response.ok) {
      throw new Error('Ошибка при загрузке задач');
    }
  
    const data = await response.json();
    return data;
  };
  
  export const createTask = async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(taskData),
    });
    return response.json();
  };
  
  export const updateTask = async (taskId, taskData) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(taskData),
    });
    return response.json();
  };

  export const getSubordinates = async () => {
    const token = localStorage.getItem('token');
  
    const response = await fetch(`${API_BASE_URL}/api/users/subordinates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Ошибка при загрузке подчиненных');
    }
  
    const data = await response.json();
    return data;
  };
  
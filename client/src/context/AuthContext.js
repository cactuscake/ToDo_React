import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Состояние для хранения данных пользователя

  // Проверка токена при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Проверяем токен на сервере (например, через API)
      validateToken(token)
        .then((userData) => {
          setIsAuthenticated(true);
          setUser(userData); // Сохраняем данные пользователя
        })
        .catch(() => {
          // Если токен недействителен, очищаем localStorage
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);
  // Функция для проверки токена на сервере
  const validateToken = async (token) => {
    const response = await fetch('http://localhost:5000/api/auth/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Токен недействителен');
    }

    const data = await response.json();
    return data.user;
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    setUser(userData); // Сохраняем данные пользователя
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null); // Сбрасываем данные пользователя
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
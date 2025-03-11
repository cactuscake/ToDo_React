import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import { AuthContext } from "../context/AuthContext";

const AuthForm = () => {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      if (response.token) {
        authLogin(response.token);
        navigate("/tasks");
      } else {
        setError(response.error || "Ошибка авторизации");
      }
    } catch (err) {
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <div>
      <h2>Авторизация</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={credentials.login}
          onChange={(e) =>
            setCredentials({ ...credentials, login: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Пароль"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default AuthForm;

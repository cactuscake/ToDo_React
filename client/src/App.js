import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import TaskList from './components/TaskList';
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/tasks" /> : <AuthForm />} />
        <Route path="/tasks" element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/tasks' : '/login'} />} />
      </Routes>
    </Router>
  );
};

export default App;
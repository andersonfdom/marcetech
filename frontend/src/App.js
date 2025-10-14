import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Login from './components/Login/Login.js';
import './styles/Global.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação ao carregar o app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    // Salvar token no localStorage (exemplo)
    localStorage.setItem('token', 'user-token-here');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Remover token do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/*" 
          element={
            isAuthenticated ? 
            <Layout onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
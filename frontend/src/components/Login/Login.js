import React, { useState } from 'react';
import Alert from '../Common/Alert.js';
import '../../styles/Login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [alerta, setAlerta] = useState({ mostrar: false, mensagem: '' });

  const realizarLogin = async () => {
    setAlerta({ mostrar: false, mensagem: '' });

    try {
      // Simulação de login - substitua pela sua API real
      const response = await fetch('/Home/LoginValido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: email,
          senha: senha
        })
      });
      
      onLogin();
      /*
      if (response.ok) {
        const resultado = await response.text();
        if (resultado === 'Successo') {
          onLogin();
        } else {
          setAlerta({ mostrar: true, mensagem: resultado });
        }
      } else {
        setAlerta({ mostrar: true, mensagem: 'Erro ao realizar login' });
      }
      */
    } catch (error) {
      setAlerta({ mostrar: true, mensagem: 'Erro de conexão' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    realizarLogin();
  };

  return (
    <div className="login-container">
      <img src="/img/logo.jpg" alt="MarceTech logo" className="logo" />
      <h2>Acesso Restrito</h2>
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-icon-group">
          <img src="/img/email.svg" className="input-icon" alt="Email" />
          <input
            type="email"
            id="email"
            className="form-login"
            placeholder="Entre com seu Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-icon-group">
          <img src="/img/lock.svg" className="input-icon" alt="Senha" />
          <input
            type={mostrarSenha ? "text" : "password"}
            id="senha"
            className="form-login"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button
            type="button"
            className="toggle-icon"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            {mostrarSenha ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        
        <a href="#" className="recuperar">Recuperar senha</a>
        
        <button type="submit" className="login-btn">
          Login
        </button>
        
        {alerta.mostrar && (
          <Alert 
            mensagem={alerta.mensagem}
            tipo="erro"
            onFechar={() => setAlerta({ mostrar: false, mensagem: '' })}
          />
        )}
      </form>
    </div>
  );
};

export default Login;
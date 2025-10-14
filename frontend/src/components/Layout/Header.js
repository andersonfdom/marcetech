import React from 'react';

const Header = () => {
  const userName = "Anderson Fernando Domingos";
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const horaAtual = new Date().toLocaleTimeString('pt-BR');
  const ultimoAcesso = `Último acesso: ${dataAtual} ${horaAtual}`;

  return (
    <header style={{ backgroundColor: 'white', color: 'black' }}>
      <div className="user-info">
        <div style={{ paddingLeft: 'calc(10% + 20px)' }}>
          Bem-vindo, {userName}. 
          <p>{ultimoAcesso}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
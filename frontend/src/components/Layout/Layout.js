import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import Header from './Header.js';
import ModalExclusao from './ModalExclusao.js';
import Dashboard from '../Dashboard/Dashboard.js';
import Clientes from '../Clientes/Clientes.js';
import CadastroCliente from '../Clientes/CadastroCliente.js';
import Materials from '../Materials/Materials.js'; // Importação adicionada
import Orcamentos from '../Orcamentos/Orcamentos.js';
import '../../styles/Layout.css';

const Layout = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <div className="app-container">
      <button className="menu-toggle" onClick={toggleSidebar}>≡</button>
      
      {sidebarActive && (
        <div className="overlay" onClick={toggleSidebar}></div>
      )}
      
      <Sidebar active={sidebarActive} />
      
      <div className="main">
        <Header />
        
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/cadastro" element={<CadastroCliente />} />
            <Route path="/clientes/cadastro/:id" element={<CadastroCliente />} />
            <Route path="/materials" element={<Materials />} /> {/* Rota atualizada */}
            <Route path="/orcamento" element={<Orcamentos />} />
            <Route path="/contrato" element={<div>Contratos - Em Desenvolvimento</div>} />
            
            {/* Rotas de Gestão */}
            <Route path="/gestao/comercial" element={<div>Gestão Comercial - Em Desenvolvimento</div>} />
            <Route path="/gestao/producao" element={<div>Gestão de Produção - Em Desenvolvimento</div>} />
            <Route path="/gestao/cronograma" element={<div>Gestão de Cronograma - Em Desenvolvimento</div>} />
            
            {/* Rotas de Parâmetros */}
            <Route path="/parametros/configuracoes" element={<div>Configurações - Em Desenvolvimento</div>} />
            <Route path="/parametros/consultores" element={<div>Consultores - Em Desenvolvimento</div>} />
            <Route path="/parametros/ojas" element={<div>Ojas - Em Desenvolvimento</div>} />
            <Route path="/parametros/usuarios" element={<div>Usuários - Em Desenvolvimento</div>} />
          </Routes>
        </main>
      </div>

      <ModalExclusao 
        aberto={modalAberto} 
        onFechar={fecharModal} 
        onConfirmar={() => {
          console.log('Item excluído');
          fecharModal();
        }} 
      />
    </div>
  );
};

export default Layout;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ active }) => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { 
      label: 'Cadastros', 
      icon: '📋',
      submenu: [
        { path: '/clientes', label: 'Clientes' },
        { path: '/materials', label: 'Materiais' }
      ]
    },
    { path: '/orcamento', label: 'Orçamentos', icon: '💰' },
    { path: '/contrato', label: 'Contratos', icon: '📄' },
    { 
      label: 'Gestão', 
      icon: '📊',
      submenu: [
        { path: '/gestao/comercial', label: 'Gestão Comercial' },
        { path: '/gestao/producao', label: 'Gestão de Produção' },
        { path: '/gestao/cronograma', label: 'Gestão de Cronograma' }
      ]
    },
    { 
      label: 'Parâmetros', 
      icon: '⚙️',
      submenu: [
        { path: '/parametros/configuracoes', label: 'Configurações' },
        { path: '/parametros/consultores', label: 'Consultores' },
        { path: '/parametros/lojas', label: 'Lojas' },
        { path: '/parametros/usuarios', label: 'Usuários' }
      ]
    },
    { 
      label: 'Sair', 
      icon: '🚪', 
      action: () => {
        // Limpar dados de autenticação se necessário
        localStorage.removeItem('token'); // Exemplo
        localStorage.removeItem('user'); // Exemplo
        navigate('/login');
      }
    }
  ];

  return (
    <aside className={`sidebar ${active ? 'active' : ''}`}>
      <div className="logo">
        <img src="/img/logo.jpg" alt="MarceTech" />
      </div>
      
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

const MenuItem = ({ item }) => {
  const [submenuAberto, setSubmenuAberto] = React.useState(false);
  const navigate = useNavigate();

  if (item.submenu) {
    return (
      <li className="has-submenu">
        <a href="#" onClick={(e) => {
          e.preventDefault();
          setSubmenuAberto(!submenuAberto);
        }}>
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </a>
        <ul className="submenu" style={{ display: submenuAberto ? 'block' : 'none' }}>
          {item.submenu.map((subItem, subIndex) => (
            <li key={subIndex}>
              <Link to={subItem.path}>
                <span className="submenu-icon">•</span>
                <span className="submenu-label">{subItem.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  if (item.action) {
    return (
      <li>
        <a href="#" onClick={(e) => {
          e.preventDefault();
          item.action();
        }}>
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link to={item.path}>
        <span className="menu-icon">{item.icon}</span>
        <span className="menu-label">{item.label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
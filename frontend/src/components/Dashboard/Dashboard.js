import React from 'react';
import { Link } from 'react-router-dom';
import DashboardCard from './DashboardCard.js';
import '../../styles/Dashboard.css';

const Dashboard = () => {
  const cardsData = [
    {
      titulo: 'Orçamentos',
      dados: [
        { label: 'Total em aberto', valor: '5' },
        { label: 'Último criado', valor: '29/08/2025' }
      ],
      link: { to: '/orcamento', texto: 'Ver todos' }
    },
    {
      titulo: 'Clientes',
      dados: [
        { label: 'Cadastrados', valor: '18' },
        { label: 'Novos este mês', valor: '2' }
      ],
      link: { to: '/clientes', texto: 'Gerenciar' }
    },
    {
      titulo: 'Materiais',
      dados: [
        { label: 'Cadastrados', valor: '42' },
        { label: 'Última atualização', valor: '25/08/2025' }
      ],
      link: { to: '/materials', texto: 'Gerenciar' }
    }
  ];

  const noticias = [
    'Alteração de preços em ferragens a partir de <strong>01/09/2025</strong>',
    'Promoções de revendas disponíveis',
    'Nova versão do sistema liberada'
  ];

  return (
    <div>
      <h1>Dashboard - MarceTech</h1>
      
      <div className="dashboard">
        {cardsData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
        
        <div className="card noticias">
          <h3>Portal de Notícias</h3>
          <ul>
            {noticias.map((noticia, index) => (
              <li key={index} dangerouslySetInnerHTML={{ __html: noticia }} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
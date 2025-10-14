import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ titulo, dados, link }) => {
  return (
    <div className="card">
      <h3>{titulo}</h3>
      {dados.map((item, index) => (
        <p key={index}>
          {item.label}: <strong>{item.valor}</strong>
        </p>
      ))}
      <Link to={link.to}>{link.texto}</Link>
    </div>
  );
};

export default DashboardCard;
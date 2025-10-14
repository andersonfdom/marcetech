import React from 'react';

const Alert = ({ mensagem, tipo = 'erro', onFechar }) => {
  return (
    <div className={`alert alert-${tipo}`}>
      <span>{mensagem}</span>
      <span className="closebtn" onClick={onFechar}>&times;</span>
    </div>
  );
};

export default Alert;
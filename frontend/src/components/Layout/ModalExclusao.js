// ModalExclusao.js
import React from 'react';

const ModalExclusao = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  titulo = "Confirmar Exclusão",
  mensagem = "Tem certeza que deseja excluir este item?",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-exclusao-overlay">
      <div className="modal-exclusao-content">
        <div className="modal-exclusao-header">
          <h4 className="modal-exclusao-title">{titulo}</h4>
        </div>
        
        <div className="modal-exclusao-body">
          <p>{mensagem}</p>
        </div>
        
        <div className="modal-exclusao-footer">
          <button 
            type="button" 
            className="btn btn-cancelar"
            onClick={onClose}
          >
            {textoCancelar}
          </button>
          <button 
            type="button" 
            className="btn btn-confirmar"
            onClick={onConfirm}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalExclusao;
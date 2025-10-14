import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Orcamentos.css';

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Carregar orçamentos da API
  useEffect(() => {
    const carregarOrcamentos = async () => {
      try {
        setCarregando(true);
        
        // Substitua pela sua API real de orçamentos
        const response = await fetch('https://api.marcetech.andersondomingos.com/Orcamentos/Listar', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ' + token
          }
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dados = await response.json();
        setOrcamentos(dados);
        
      } catch (error) {
        console.error('Erro ao carregar orçamentos:', error);
        // setErro('Falha ao carregar orçamentos');
      } finally {
        setCarregando(false);
      }
    };

    carregarOrcamentos();
  }, []);

  // Filtrar orçamentos baseado na busca
  const orcamentosFiltrados = orcamentos.filter(orcamento =>
    Object.values(orcamento).some(valor =>
      valor.toString().toLowerCase().includes(busca.toLowerCase())
    )
  );

  const handleExcluir = async (id) => {
    try {
      const confirmacao = window.confirm('Tem certeza que deseja excluir este orçamento?');
      
      if (!confirmacao) {
        return;
      }

      const response = await fetch(`https://api.marcetech.andersondomingos.com/Orcamentos?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Atualizar lista localmente após exclusão bem-sucedida
      setOrcamentos(orcamentos.filter(orcamento => orcamento.id !== id));
      
      alert('Orçamento excluído com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      alert('Erro ao excluir orçamento');
    }
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Função para obter classe CSS baseada no status
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'orcamento':
        return 'status-orcamento';
      case 'fechado':
        return 'status-fechado';
      case 'perdido':
        return 'status-perdido';
      case 'agendado':
        return 'status-agendado';
      default:
        return 'status-padrao';
    }
  };

  if (carregando) {
    return (
      <div className="orcamentos-container">
        <h1>Orçamentos</h1>
        <div className="carregando">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="orcamentos-container">
      <h1>Orçamentos</h1>

      <div className="orcamentos-header">
        <input
          type="search"
          id="inputOrcamentos"
          placeholder="Buscar Orçamentos"
          className="myinput"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <table id="myTable">
        <thead>
          <tr className="header">
            <th style={{ width: '5%' }}>
              <Link to="/orcamentos/novo" className="btn-incluir" title="Novo Orçamento">
                +
              </Link>
            </th>
            <th style={{ width: '25%' }}>Nome</th>
            <th style={{ width: '15%' }}>Telefone</th>
            <th style={{ width: '15%' }}>Responsável</th>
            <th style={{ width: '15%' }}>Data de Criação</th>
            <th style={{ width: '15%' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orcamentosFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6" className="sem-registros">
                {busca ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento cadastrado'}
              </td>
            </tr>
          ) : (
            orcamentosFiltrados.map((orcamento) => (
              <tr key={orcamento.id}>
                <td>
                  <Link
                    to={`/orcamentos/editar/${orcamento.id}`}
                    className="btn-edit"
                    title="Editar"
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" 
                      alt="Editar" 
                      width="20" 
                    />
                  </Link>

                  <button
                    className="btn-delete"
                    title="Excluir"
                    onClick={() => handleExcluir(orcamento.id)}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" 
                      alt="Excluir" 
                      width="20" 
                    />
                  </button>
                </td>
                <td>{orcamento.nomeCliente || orcamento.nome}</td>
                <td>{orcamento.telefone}</td>
                <td>{orcamento.responsavel}</td>
                <td>{formatarData(orcamento.dataCriacao)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(orcamento.status)}`}>
                    {orcamento.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orcamentos;
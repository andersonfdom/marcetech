import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Simulação de dados - substitua pela sua API real
  useEffect(() => {
    const carregarClientes = async () => {
  try {
    setCarregando(true);
    
    const response = await fetch('https://api.marcetech.andersondomingos.com/Clientes/Listar', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Adicione outros headers se necessário, como Authorization
        // 'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const dados = await response.json();
    setClientes(dados);
    
  } catch (error) {
    console.error('Erro ao carregar clientes:', error);
    // Você pode adicionar um estado de erro para mostrar ao usuário
    // setErro('Falha ao carregar clientes');
  } finally {
    setCarregando(false);
  }
};

    carregarClientes();
  }, []);

  // Filtrar clientes baseado na busca
  const clientesFiltrados = clientes.filter(cliente =>
    Object.values(cliente).some(valor =>
      valor.toString().toLowerCase().includes(busca.toLowerCase())
    )
  );

  const handleExcluir = async (id) => {

  try {   

    const response = await fetch(`https://api.marcetech.andersondomingos.com/Clientes?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Adicione outros headers se necessário, como Authorization
        // 'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Atualizar lista localmente após exclusão bem-sucedida
    setClientes(clientes.filter(cliente => cliente.id !== id));
    
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    alert('Erro ao excluir cliente');
  }
};

  if (carregando) {
    return (
      <div className="clientes-container">
        <h1>Clientes</h1>
        <div className="carregando">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="clientes-container">
      <h1>Clientes</h1>

      <div className="clientes-header">
        <input
          type="search"
          id="inputClientes"
          placeholder="Buscar Clientes"
          className="myinput"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <table id="myTable">
        <thead>
          <tr className="header">
            <th style={{ width: '5%' }}>
        
        <Link to="/clientes/cadastro" className="btn-incluir" title="Novo Registro">
          +
        </Link></th>
            <th style={{ width: '25%' }}>Nome</th>
            <th style={{ width: '15%' }}>Telefone</th>
            <th style={{ width: '25%' }}>Email</th>
            <th style={{ width: '10%' }}>Cidade</th>
            <th style={{ width: '20%' }}>UF</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.length === 0 ? (
            <tr>
              <td colSpan="6" className="sem-registros">
                {busca ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </td>
            </tr>
          ) : (
            clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>
                  <Link
                    to={`/clientes/cadastro/${cliente.id}`}
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
                    onClick={() => handleExcluir(cliente.id)}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" 
                      alt="Excluir" 
                      width="20" 
                    />
                  </button>
                </td>
                <td>{cliente.nome}</td>
                <td>{cliente.telefone}</td>
                <td>{cliente.email}</td>
                <td>{cliente.cidade}</td>
                <td>{cliente.estado}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
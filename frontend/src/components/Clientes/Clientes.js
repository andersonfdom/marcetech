import React, { useState, useEffect } from 'react';
import './Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);

  // Simulação de dados - substitua pela sua API real
  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setCarregando(true);
      
      const response = await fetch('https://api.marcetech.andersondomingos.com/Clientes/Listar', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const dados = await response.json();
      setClientes(dados);
      
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setCarregando(false);
    }
  };

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

  const handleNovoCliente = () => {
    setClienteEditando(null);
    setMostrarModal(true);
  };

  const handleEditarCliente = (cliente) => {
    setClienteEditando(cliente);
    setMostrarModal(true);
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setClienteEditando(null);
  };

  const handleClienteSalvo = () => {
    carregarClientes(); // Recarrega a lista após salvar
    setMostrarModal(false);
    setClienteEditando(null);
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
              <button 
                className="btn-incluir" 
                title="Novo Registro"
                onClick={handleNovoCliente}
              >
                +
              </button>
            </th>
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
                  <button
                    className="btn-edit"
                    title="Editar"
                    onClick={() => handleEditarCliente(cliente)}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" 
                      alt="Editar" 
                      width="20" 
                    />
                  </button>

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

      {/* Modal de Cadastro */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CadastroClienteModal
              cliente={clienteEditando}
              onClose={handleFecharModal}
              onSalvo={handleClienteSalvo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Modal de Cadastro
const CadastroClienteModal = ({ cliente, onClose, onSalvo }) => {
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [dadosCliente, setDadosCliente] = useState({
    id: 0,
    tipoPessoa: 'false',
    nome: '',
    cpfcnpj: '',
    rg: '',
    telefone: '',
    email: '',
    cep: '',
    logradouro: '',
    numeroLogradouro: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });

  // Carregar dados do cliente se for edição
  useEffect(() => {
    if (cliente) {
      carregarCliente(cliente.id);
    } else {
      // Reset para novo cliente
      setDadosCliente({
        id: 0,
        tipoPessoa: 'false',
        nome: '',
        cpfcnpj: '',
        rg: '',
        telefone: '',
        email: '',
        cep: '',
        logradouro: '',
        numeroLogradouro: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      });
    }
  }, [cliente]);

  const carregarCliente = async (clienteId) => {
    try {
      setCarregando(true);
      setErro('');
      
      const response = await fetch(`https://api.marcetech.andersondomingos.com/Clientes/CarregarDados?id=${clienteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const clienteData = await response.json();
      const tipoPessoaFormatado = clienteData.tipoPessoa === true ? 'true' : 
                               clienteData.tipoPessoa === false ? 'false' : 
                               clienteData.tipoPessoa;
      
      // Formatar os dados ao carregar
      const clienteFormatado = {
        ...clienteData,
        tipoPessoa: tipoPessoaFormatado,
        cpfcnpj: aplicarMascara(clienteData.cpfcnpj || '', clienteData.tipoPessoa === 'false' ? 'cpf' : 'cnpj'),
        telefone: aplicarMascara(clienteData.telefone || '', 'telefone'),
        cep: aplicarMascara(clienteData.cep || '', 'cep')
      };
      
      setDadosCliente(clienteFormatado);
      
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      setErro('Erro ao carregar dados do cliente');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoPessoaChange = (e) => {
    const tipoPessoa = e.target.value;
    setDadosCliente(prev => ({
      ...prev,
      tipoPessoa,
      cpfcnpj: '',
      rg: tipoPessoa === 'true' ? '' : prev.rg // Limpa RG se for PJ
    }));
  };

  // Funções de formatação
  const aplicarMascara = (valor, tipo) => {
    if (!valor) return '';
    
    valor = valor.replace(/\D/g, "");

    if (tipo === "cpf") {
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
      valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (tipo === "cnpj") {
      valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
      valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
      valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    } else if (tipo === "cep") {
      valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
    } else if (tipo === "telefone") {
      if (valor.length === 11) {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{5})(\d{4})$/, "$1-$2");
      } else {
        valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
        valor = valor.replace(/(\d{4})(\d{4})$/, "$1-$2");
      }
    }

    return valor;
  };

  const handleCpfCnpjChange = (e) => {
    const valor = e.target.value;
    const tipo = dadosCliente.tipoPessoa === 'false' ? 'cpf' : 'cnpj';
    const valorFormatado = aplicarMascara(valor, tipo);
    setDadosCliente(prev => ({
      ...prev,
      cpfcnpj: valorFormatado
    }));
  };

  const handleTelefoneChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'telefone');
    setDadosCliente(prev => ({
      ...prev,
      telefone: valorFormatado
    }));
  };

  const handleCepChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'cep');
    setDadosCliente(prev => ({
      ...prev,
      cep: valorFormatado
    }));
  };

  // Buscar CEP
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    
    if (cepLimpo.length === 8) {
      try {
        setCarregando(true);
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setDadosCliente(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: nomeEstadoPorSigla(data.uf) || ''
          }));
        } else {
          setErro('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        setErro('Erro ao buscar CEP');
      } finally {
        setCarregando(false);
      }
    }
  };

  const nomeEstadoPorSigla = (sigla) => {
    const estados = {
      "AC": "Acre", "AL": "Alagoas", "AP": "Amapá", "AM": "Amazonas",
      "BA": "Bahia", "CE": "Ceará", "DF": "Distrito Federal", "ES": "Espírito Santo",
      "GO": "Goiás", "MA": "Maranhão", "MT": "Mato Grosso", "MS": "Mato Grosso do Sul",
      "MG": "Minas Gerais", "PA": "Pará", "PB": "Paraíba", "PR": "Paraná",
      "PE": "Pernambuco", "PI": "Piauí", "RJ": "Rio de Janeiro", "RN": "Rio Grande do Norte",
      "RS": "Rio Grande do Sul", "RO": "Rondônia", "RR": "Roraima", "SC": "Santa Catarina",
      "SP": "São Paulo", "SE": "Sergipe", "TO": "Tocantins"
    };
    return estados[sigla?.toUpperCase()] || '';
  };

  // Validações
  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
  };

  const validarCNPJ = (cnpj) => {
    cnpj = cnpj.replace(/\D/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
  };

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarFormulario = () => {
    setErro('');
    const cpfCnpjLimpo = dadosCliente.cpfcnpj.replace(/\D/g, '');

    // Validação de Nome/Razão Social
    if (!dadosCliente.nome.trim()) {
      setErro('Nome/Razão Social é obrigatório');
      return false;
    }

    // Validação de CPF/CNPJ
    if (dadosCliente.tipoPessoa === 'false') {
      if (cpfCnpjLimpo.length !== 11 || !validarCPF(dadosCliente.cpfcnpj)) {
        setErro('CPF inválido');
        return false;
      }
    } else {
      if (cpfCnpjLimpo.length !== 14 || !validarCNPJ(dadosCliente.cpfcnpj)) {
        setErro('CNPJ inválido');
        return false;
      }
    }

    // Validação de Email
    if (!dadosCliente.email.trim() || !validarEmail(dadosCliente.email)) {
      setErro('Email inválido');
      return false;
    }

    // Validação de Telefone
    const telefoneLimpo = dadosCliente.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setErro('Telefone inválido');
      return false;
    }

    // Validação de CEP
    const cepLimpo = dadosCliente.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setErro('CEP inválido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    try {
      setCarregando(true);
      setErro('');

      // Preparar dados para envio (remover formatação)
      const dadosEnvio = {
        ...dadosCliente,
        cpfcnpj: dadosCliente.cpfcnpj.replace(/\D/g, ''),
        telefone: dadosCliente.telefone.replace(/\D/g, ''),
        cep: dadosCliente.cep.replace(/\D/g, ''),
        tipoPessoa: dadosCliente.tipoPessoa === 'true'
      };

      const url = 'https://api.marcetech.andersondomingos.com/Clientes/GravarDados';
      const method = 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEnvio)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      await response.json();
      onSalvo();
      
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setErro('Erro ao salvar cliente');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando && cliente) {
    return (
      <div className="modal-header">
        <h2>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <div className="carregando">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="modal-cadastro">
      <div className="modal-header">
        <h2>{cliente ? 'Editar Cliente' : 'Novo Cliente'}</h2>
        <button className="btn-fechar" onClick={onClose}>×</button>
      </div>

      {erro && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {erro}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setErro('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      <form id="formCliente" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Dados do Cliente</legend>
          
          <input type="hidden" id="Id" name="Id" value={dadosCliente.id} />

          <div className="row">
            <div className="col">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="pf"
                  name="TipoPessoa"
                  value="false"
                  checked={dadosCliente.tipoPessoa === 'false'}
                  onChange={handleTipoPessoaChange}
                  disabled={carregando}
                />
                <label className="form-check-label" htmlFor="pf">
                  Pessoa Física
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="pj"
                  name="TipoPessoa"
                  value="true"
                  checked={dadosCliente.tipoPessoa === 'true'}
                  onChange={handleTipoPessoaChange}
                  disabled={carregando}
                />
                <label className="form-check-label" htmlFor="pj">
                  Pessoa Jurídica
                </label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label id="lblNome" htmlFor="Nome" className="form-label">
                {dadosCliente.tipoPessoa === 'false' ? 'Nome Completo' : 'Razão Social'}
              </label>
              <input
                type="text"
                className="form-control"
                id="Nome"
                name="nome"
                value={dadosCliente.nome}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label id="lblCpfCnpj" htmlFor="Cpfcnpj" className="form-label">
                {dadosCliente.tipoPessoa === 'false' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                className="form-control"
                id="Cpfcnpj"
                name="cpfcnpj"
                value={dadosCliente.cpfcnpj}
                onChange={handleCpfCnpjChange}
                maxLength={dadosCliente.tipoPessoa === 'false' ? 14 : 18}
                disabled={carregando}
                required
              />
            </div>
            <div className="col">
              <label 
                id="lblRg" 
                htmlFor="Rg" 
                className="form-label"
                style={{ display: dadosCliente.tipoPessoa === 'false' ? 'block' : 'none' }}
              >
                RG
              </label>
              <input
                type="text"
                className="form-control"
                id="Rg"
                name="rg"
                value={dadosCliente.rg}
                onChange={handleChange}
                style={{ display: dadosCliente.tipoPessoa === 'false' ? 'block' : 'none' }}
                disabled={carregando}
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="Telefone" className="form-label">Telefone</label>
              <input
                type="text"
                className="form-control"
                id="Telefone"
                name="telefone"
                value={dadosCliente.telefone}
                onChange={handleTelefoneChange}
                maxLength={15}
                disabled={carregando}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="Email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="Email"
                name="email"
                value={dadosCliente.email}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="Cep" className="form-label">CEP</label>
              <input
                type="text"
                className="form-control"
                id="Cep"
                name="cep"
                value={dadosCliente.cep}
                onChange={handleCepChange}
                onBlur={() => buscarCep(dadosCliente.cep)}
                maxLength={9}
                disabled={carregando}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="Logradouro" className="form-label">Logradouro</label>
              <input
                type="text"
                className="form-control"
                id="Logradouro"
                name="logradouro"
                value={dadosCliente.logradouro}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="NumeroLogradouro" className="form-label">Número</label>
              <input
                type="text"
                className="form-control"
                id="NumeroLogradouro"
                name="numeroLogradouro"
                value={dadosCliente.numeroLogradouro}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="Complemento" className="form-label">Complemento</label>
              <input
                className="form-control"
                type="text"
                id="Complemento"
                name="complemento"
                value={dadosCliente.complemento}
                onChange={handleChange}
                disabled={carregando}
              />
            </div>
            <div className="col">
              <label htmlFor="Bairro" className="form-label">Bairro</label>
              <input
                className="form-control"
                type="text"
                id="Bairro"
                name="bairro"
                value={dadosCliente.bairro}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label htmlFor="Cidade" className="form-label">Cidade</label>
              <input
                className="form-control"
                type="text"
                id="Cidade"
                name="cidade"
                value={dadosCliente.cidade}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="Estado" className="form-label">Estado</label>
              <input
                className="form-control"
                type="text"
                id="Estado"
                name="estado"
                value={dadosCliente.estado}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <button 
                type="submit" 
                id="btnSalvar" 
                className="btn btn-success me-2"
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Gravar'}
              </button>
              <button 
                type="button" 
                id="btnCancelar" 
                className="btn btn-danger"
                onClick={onClose}
                disabled={carregando}
              >
                Cancelar
              </button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Clientes;
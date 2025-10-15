import React, { useState, useEffect } from 'react';
import './Orcamentos.css';

const Orcamentos = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [orcamentoEditando, setOrcamentoEditando] = useState(null);

  // Carregar orçamentos da API
  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const carregarOrcamentos = async () => {
    try {
      setCarregando(true);
      
      const response = await fetch('https://api.marcetech.andersondomingos.com/Orcamentos/Listar', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const dados = await response.json();
      setOrcamentos(dados);
      
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setCarregando(false);
    }
  };

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

      setOrcamentos(orcamentos.filter(orcamento => orcamento.id !== id));
      alert('Orçamento excluído com sucesso!');
      
    } catch (error) {
      console.error('Erro ao excluir orçamento:', error);
      alert('Erro ao excluir orçamento');
    }
  };

  // Funções para controle do modal
  const handleNovoOrcamento = () => {
    setOrcamentoEditando(null);
    setMostrarModal(true);
  };

  const handleEditarOrcamento = (orcamento) => {
    setOrcamentoEditando(orcamento);
    setMostrarModal(true);
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
    setOrcamentoEditando(null);
  };

  const handleOrcamentoSalvo = () => {
    carregarOrcamentos();
    setMostrarModal(false);
    setOrcamentoEditando(null);
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
      <br />

      <table id="myTable">
        <thead>
          <tr className="header">
            <th style={{ width: '5%' }}>
              <button 
                className="btn-incluir" 
                title="Novo Orçamento"
                onClick={handleNovoOrcamento}
              >
                Adicionar Cliente
              </button>
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
                  <button
                    className="btn-edit"
                    title="Editar"
                    onClick={() => handleEditarOrcamento(orcamento)}
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

      {/* Modal de Cadastro */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CadastroOrcamentoModal
              orcamento={orcamentoEditando}
              onClose={handleFecharModal}
              onSalvo={handleOrcamentoSalvo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Componente Modal de Cadastro
const CadastroOrcamentoModal = ({ orcamento, onClose, onSalvo }) => {
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [dadosOrcamento, setDadosOrcamento] = useState({
    id: 0,
    idCliente: 0,
    idLoja: 0,
    idVendedor: 0,
    nome: '',
    tipoPessoa: 'false',
    cpfcnpj: '',
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

  // Carregar dados do orçamento se for edição
  useEffect(() => {
    if (orcamento) {
      carregarOrcamento(orcamento.id);
    } else {
      // Reset para novo orçamento
      setDadosOrcamento({
        id: 0,
        nomeCliente: '',
        telefone: '',
        endereco: '',
        cpf: '',
        responsavel: '',
        status: 'orcamento'
      });
    }
  }, [orcamento]);

  const carregarOrcamento = async (orcamentoId) => {
    try {
      setCarregando(true);
      setErro('');
      
      const response = await fetch(`https://api.marcetech.andersondomingos.com/Orcamentos/CarregarDados?id=${orcamentoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const orcamentoData = await response.json();
      setDadosOrcamento(orcamentoData);
      
    } catch (error) {
      console.error('Erro ao carregar orçamento:', error);
      setErro('Erro ao carregar dados do orçamento');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosOrcamento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoPessoaChange = (e) => {
    const tipoPessoa = e.target.value;
    setDadosOrcamento(prev => ({
      ...prev,
      tipoPessoa,
      cpfcnpj: ''
    }));
  };

  const handleCpfCnpjChange = (e) => {
    const valor = e.target.value;
    const tipo = dadosCliente.tipoPessoa === 'false' ? 'cpf' : 'cnpj';
    const valorFormatado = aplicarMascara(valor, tipo);
    setDadosOrcamento(prev => ({
      ...prev,
      cpfcnpj: valorFormatado
    }));
  };

  const handleCepChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'cep');
    setDadosOrcamento(prev => ({
      ...prev,
      cep: valorFormatado
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

  const handleCpfChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'cpf');
    setDadosOrcamento(prev => ({
      ...prev,
      cpf: valorFormatado
    }));
  };

  const handleTelefoneChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'telefone');
    setDadosOrcamento(prev => ({
      ...prev,
      telefone: valorFormatado
    }));
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

  const validarFormulario = () => {
    setErro('');

    // Validação de Nome do Cliente
    if (!dadosOrcamento.nomeCliente.trim()) {
      setErro('Nome do cliente é obrigatório');
      return false;
    }

    // Validação de CPF
    if (dadosOrcamento.cpf && !validarCPF(dadosOrcamento.cpf)) {
      setErro('CPF inválido');
      return false;
    }

    // Validação de Telefone
    const telefoneLimpo = dadosOrcamento.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setErro('Telefone inválido');
      return false;
    }

    // Validação de Responsável
    if (!dadosOrcamento.responsavel.trim()) {
      setErro('Responsável é obrigatório');
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

      // Preparar dados para envio
      const dadosEnvio = {
        ...dadosOrcamento,
        cpf: dadosOrcamento.cpf.replace(/\D/g, ''),
        telefone: dadosOrcamento.telefone.replace(/\D/g, '')
      };

      const url = 'https://api.marcetech.andersondomingos.com/Clientes/CriarOrcamentoCliente';
      const method = 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosEnvio)
      });

      // Tratamento de resposta
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        
        try {
          const errorData = JSON.parse(responseText);
          
          if (errorData.title) {
            errorMessage = errorData.title;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors) {
            const errors = Object.values(errorData.errors).flat();
            errorMessage = errors.join(', ');
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (responseText) {
            errorMessage = responseText;
          }
        } catch {
          if (responseText) {
            errorMessage = responseText;
          }
        }
        
        throw new Error(errorMessage);
      }

      onSalvo();
      
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      setErro('Erro ao salvar orçamento: ' + error.message);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando && orcamento) {
    return (
      <div className="modal-header">
        <h2>{orcamento ? 'Editar Orçamento' : 'Adicionar Cliente'}</h2>
        <div className="carregando">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="modal-cadastro">
      <div className="modal-header">
        <h2>{orcamento ? 'Editar Orçamento' : 'Adicionar Cliente'}</h2>
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

      <form id="formOrcamento" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Dados do Cliente</legend>
          
          <input type="hidden" id="Id" name="Id" value={dadosOrcamento.id} />

          <div className="row">
            <div className="col">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="pf"
                  name="TipoPessoa"
                  value="false"
                  checked={dadosOrcamento.tipoPessoa === 'false'}
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
                  checked={dadosOrcamento.tipoPessoa === 'true'}
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
                {dadosOrcamento.tipoPessoa === 'false' ? 'Nome Completo' : 'Razão Social'}
              </label>
              <input
                type="text"
                className="form-control"
                id="Nome"
                name="nome"
                value={dadosOrcamento.nome}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
            
            <div className="col">
              <label id="lblCpfCnpj" htmlFor="Cpfcnpj" className="form-label">
                {dadosOrcamento.tipoPessoa === 'false' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                className="form-control"
                id="Cpfcnpj"
                name="cpfcnpj"
                value={dadosOrcamento.cpfcnpj}
                onChange={handleCpfCnpjChange}
                maxLength={dadosOrcamento.tipoPessoa === 'false' ? 14 : 18}
                disabled={carregando}
                required
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
                value={dadosOrcamento.telefone}
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
                value={dadosOrcamento.email}
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
                value={dadosOrcamento.cep}
                onChange={handleCepChange}
                onBlur={() => buscarCep(dadosOrcamento.cep)}
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
                value={dadosOrcamento.logradouro}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            
            <div className="col">
              <label htmlFor="NumeroLogradouro" className="form-label">Número</label>
              <input
                type="text"
                className="form-control"
                id="NumeroLogradouro"
                name="numeroLogradouro"
                value={dadosOrcamento.numeroLogradouro}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
            <div className="col">
              <label htmlFor="Complemento" className="form-label">Complemento</label>
              <input
                className="form-control"
                type="text"
                id="Complemento"
                name="complemento"
                value={dadosOrcamento.complemento}
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
                value={dadosOrcamento.bairro}
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
                value={dadosOrcamento.cidade}
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
                value={dadosOrcamento.estado}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col">
              <button 
                type="submit" 
                id="btnSalvar" 
                className="btn btn-success me-2"
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Salvar'}
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

export default Orcamentos;
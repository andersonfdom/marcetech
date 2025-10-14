import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CadastroClientes.css';

const CadastroCliente = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [cliente, setCliente] = useState({
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
    if (id && id !== 'novo') {
      carregarCliente(id);
    }
  }, [id]);

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
      
      setCliente(clienteFormatado);
      
    } catch (error) {
      console.error('Erro ao carregar cliente:', error);
      setErro('Erro ao carregar dados do cliente');
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTipoPessoaChange = (e) => {
    const tipoPessoa = e.target.value;
    setCliente(prev => ({
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
    const tipo = cliente.tipoPessoa === 'false' ? 'cpf' : 'cnpj';
    const valorFormatado = aplicarMascara(valor, tipo);
    setCliente(prev => ({
      ...prev,
      cpfcnpj: valorFormatado
    }));
  };

  const handleTelefoneChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'telefone');
    setCliente(prev => ({
      ...prev,
      telefone: valorFormatado
    }));
  };

  const handleCepChange = (e) => {
    const valor = e.target.value;
    const valorFormatado = aplicarMascara(valor, 'cep');
    setCliente(prev => ({
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
          setCliente(prev => ({
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
    const cpfCnpjLimpo = cliente.cpfcnpj.replace(/\D/g, '');

    // Validação de Nome/Razão Social
    if (!cliente.nome.trim()) {
      setErro('Nome/Razão Social é obrigatório');
      return false;
    }

    // Validação de CPF/CNPJ
    if (cliente.tipoPessoa === 'false') {
      if (cpfCnpjLimpo.length !== 11 || !validarCPF(cliente.cpfcnpj)) {
        setErro('CPF inválido');
        return false;
      }
    } else {
      if (cpfCnpjLimpo.length !== 14 || !validarCNPJ(cliente.cpfcnpj)) {
        setErro('CNPJ inválido');
        return false;
      }
    }

    // Validação de Email
    if (!cliente.email.trim() || !validarEmail(cliente.email)) {
      setErro('Email inválido');
      return false;
    }

    // Validação de Telefone
    const telefoneLimpo = cliente.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
      setErro('Telefone inválido');
      return false;
    }

    // Validação de CEP
    const cepLimpo = cliente.cep.replace(/\D/g, '');
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
        ...cliente,
        cpfcnpj: cliente.cpfcnpj.replace(/\D/g, ''),
        telefone: cliente.telefone.replace(/\D/g, ''),
        cep: cliente.cep.replace(/\D/g, ''),
        tipoPessoa: cliente.tipoPessoa === 'true'
      };

      const url = 'https://api.marcetech.andersondomingos.com/Clientes/GravarDados'

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

      const resultado = await response.json();
      
      navigate('/clientes');

    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setErro('Erro ao salvar cliente');
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => {
    navigate('/clientes');
  };

  if (carregando && id && id !== 'novo') {
    return (
      <div className="cadastro-container">
        <h1>{id === 'novo' ? 'Novo Cliente' : 'Editar Cliente'}</h1>
        <div className="carregando">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="cadastro-container">
      <h1>{id === 'novo' || !id ? 'Novo Cliente' : 'Editar Cliente'}</h1>

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
          
          <input type="hidden" id="Id" name="Id" value={cliente.id} />

          <div className="row">
            <div className="col">
              <div className="form-check">
                <input
                  type="radio"
                  className="form-check-input"
                  id="pf"
                  name="TipoPessoa"
                  value="false"
                  checked={cliente.tipoPessoa === 'false'}
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
                  checked={cliente.tipoPessoa === 'true'}
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
                {cliente.tipoPessoa === 'false' ? 'Nome Completo' : 'Razão Social'}
              </label>
              <input
                type="text"
                className="form-control"
                id="Nome"
                name="nome"
                value={cliente.nome}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label id="lblCpfCnpj" htmlFor="Cpfcnpj" className="form-label">
                {cliente.tipoPessoa === 'false' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                className="form-control"
                id="Cpfcnpj"
                name="cpfcnpj"
                value={cliente.cpfcnpj}
                onChange={handleCpfCnpjChange}
                maxLength={cliente.tipoPessoa === 'false' ? 14 : 18}
                disabled={carregando}
                required
              />
            </div>
            <div className="col">
              <label 
                id="lblRg" 
                htmlFor="Rg" 
                className="form-label"
                style={{ display: cliente.tipoPessoa === 'false' ? 'block' : 'none' }}
              >
                RG
              </label>
              <input
                type="text"
                className="form-control"
                id="Rg"
                name="rg"
                value={cliente.rg}
                onChange={handleChange}
                style={{ display: cliente.tipoPessoa === 'false' ? 'block' : 'none' }}
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
                value={cliente.telefone}
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
                value={cliente.email}
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
                value={cliente.cep}
                onChange={handleCepChange}
                onBlur={() => buscarCep(cliente.cep)}
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
                value={cliente.logradouro}
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
                value={cliente.numeroLogradouro}
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
                value={cliente.complemento}
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
                value={cliente.bairro}
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
                value={cliente.cidade}
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
                value={cliente.estado}
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
                onClick={handleCancelar}
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

export default CadastroCliente;
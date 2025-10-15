import React, { useState, useEffect } from 'react';
import './Materials.css';

const Materials = () => {
  const [modalAberto, setModalAberto] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [buscaAmbientes, setBuscaAmbientes] = useState('');
  const [buscaCategorias, setBuscaCategorias] = useState('');
  const [ambientes, setAmbientes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [itensCategoria, setItensCategoria] = useState([]);
  const [novoAmbiente, setNovoAmbiente] = useState({ Nome: '' });
  const [novaCategoria, setNovaCategoria] = useState({ Nome: '' });
  const [novoItemCategoria, setNovoItemCategoria] = useState({ 
    Descricao: '', 
    Observacao: '', 
    Valor: '0,00' 
  });

  // Estados de carregamento
  const [carregandoAmbientes, setCarregandoAmbientes] = useState(false);
  const [carregandoCategorias, setCarregandoCategorias] = useState(false);
  const [carregandoItens, setCarregandoItens] = useState(false);
  const [salvandoAmbiente, setSalvandoAmbiente] = useState(false);
  const [salvandoCategoria, setSalvandoCategoria] = useState(false);
  const [salvandoItem, setSalvandoItem] = useState(false);
  const [excluindoAmbiente, setExcluindoAmbiente] = useState(null);
  const [excluindoCategoria, setExcluindoCategoria] = useState(null);
  const [excluindoItem, setExcluindoItem] = useState(null);

  // Estados de erro de validação
  const [erroValidacao, setErroValidacao] = useState({
    ambiente: '',
    categoria: '',
    itemDescricao: '',
    itemValor: ''
  });

  // Função para limpar erros
  const limparErro = (campo) => {
    setErroValidacao(prev => ({ ...prev, [campo]: '' }));
  };

  // Função para máscara de moeda
  const aplicarMascaraMoeda = (valor) => {
    let valorLimpo = valor.replace(/\D/g, "");
    
    if (!valorLimpo) {
      return "";
    }

    valorLimpo = valorLimpo.substring(0, 18);
    valorLimpo = valorLimpo.padStart(3, "0");

    const centavos = valorLimpo.slice(-2);
    let inteiros = valorLimpo.slice(0, -2);

    if (inteiros.length > 16) {
      inteiros = inteiros.substring(inteiros.length - 16);
    }

    inteiros = inteiros.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    
    return `${inteiros},${centavos}`;
  };

  const handleValorChange = (valor) => {
    const valorFormatado = aplicarMascaraMoeda(valor);
    setNovoItemCategoria(prev => ({
      ...prev,
      Valor: valorFormatado
    }));
  };

  // Funções para Ambientes
  const listarAmbientes = async () => {
    try {
      setCarregandoAmbientes(true);
      
      const response = await fetch('https://api.marcetech.andersondomingos.com/Ambientes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Resposta da API não é um array válido');
      }

      const ambientesFormatados = data.map(ambiente => ({
        Id: ambiente.id,
        Nome: ambiente.nome
      }));

      setAmbientes(ambientesFormatados);
      
    } catch (error) {
      console.error('Erro ao carregar ambientes:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('404')) {
        setAmbientes([]);
        console.log('Nenhum ambiente encontrado');
      } else {
        alert('Erro ao carregar ambientes: ' + error.message);
        
        const ambientesMock = [
          { Id: 1, Nome: 'Sala de Estar' },
          { Id: 2, Nome: 'Quarto' },
          { Id: 3, Nome: 'Cozinha' }
        ];
        setAmbientes(ambientesMock);
      }
    } finally {
      setCarregandoAmbientes(false);
    }
  };

  const salvarAmbiente = async () => {
    limparErro('ambiente');

    if (!novoAmbiente.Nome.trim()) {
      setErroValidacao(prev => ({ ...prev, ambiente: 'Por favor, informe o nome do ambiente' }));
      return;
    }

    try {
      setSalvandoAmbiente(true);

      const ambienteParaEnviar = {
        nome: novoAmbiente.Nome.trim()
      };

      const response = await fetch('https://api.marcetech.andersondomingos.com/Ambientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ambienteParaEnviar)
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      const ambienteSalvo = await response.json();
      
      if (!ambienteSalvo.id || !ambienteSalvo.nome) {
        throw new Error('Resposta da API inválida');
      }

      const ambienteFormatado = {
        Id: ambienteSalvo.id,
        Nome: ambienteSalvo.nome
      };

      setAmbientes(prev => [...prev, ambienteFormatado]);
      setNovoAmbiente({ Nome: '' });
      setModalAberto('ambientes');

    } catch (error) {
      console.error('Erro ao salvar ambiente:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('409')) {
        alert('Já existe um ambiente com este nome. Por favor, escolha outro nome.');
      } else {
        alert('Erro ao salvar ambiente: ' + error.message);
      }
    } finally {
      setSalvandoAmbiente(false);
    }
  };

  const excluirAmbiente = async (id) => {
    const ambiente = ambientes.find(a => a.Id === id);
    const nomeAmbiente = ambiente ? ambiente.Nome : 'este ambiente';
    
    try {
        setExcluindoAmbiente(id);

        const response = await fetch(`https://api.marcetech.andersondomingos.com/Ambientes?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          setAmbientes(prev => prev.filter(ambiente => ambiente.Id !== id));
        } else if (response.status === 404) {
          setAmbientes(prev => prev.filter(ambiente => ambiente.Id !== id));
          console.log('Ambiente não encontrado, removido da lista local');
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
      } catch (error) {
        console.error('Erro ao excluir ambiente:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          alert('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (error.message.includes('409')) {
          alert('Não é possível excluir este ambiente pois ele está em uso.');
        } else {
          alert('Erro ao excluir ambiente: ' + error.message);
        }
      } finally {
        setExcluindoAmbiente(null);
      }
  };

  // Funções para Categorias
  const listarCategorias = async () => {
    try {
      setCarregandoCategorias(true);
      
      const response = await fetch('https://api.marcetech.andersondomingos.com/Categorias', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Resposta da API não é um array válido');
      }

      const categoriasFormatadas = data.map(categoria => ({
        Id: categoria.id,
        Nome: categoria.nome
      }));

      setCategorias(categoriasFormatadas);
      
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('404')) {
        setCategorias([]);
        console.log('Nenhuma categoria encontrada');
      } else {
        alert('Erro ao carregar categorias: ' + error.message);
        
        const categoriasMock = [
          { Id: 1, Nome: 'Pisos' },
          { Id: 2, Nome: 'Revestimentos' },
          { Id: 3, Nome: 'Iluminação' }
        ];
        setCategorias(categoriasMock);
      }
    } finally {
      setCarregandoCategorias(false);
    }
  };

  const salvarCategoria = async () => {
    limparErro('categoria');

    if (!novaCategoria.Nome.trim()) {
      setErroValidacao(prev => ({ ...prev, categoria: 'Por favor, informe o nome da categoria' }));
      return;
    }

    try {
      setSalvandoCategoria(true);

      const categoriaParaEnviar = {
        nome: novaCategoria.Nome.trim()
      };

      const response = await fetch('https://api.marcetech.andersondomingos.com/Categorias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoriaParaEnviar)
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      const categoriaSalva = await response.json();
      
      if (!categoriaSalva.id || !categoriaSalva.nome) {
        throw new Error('Resposta da API inválida');
      }

      const categoriaFormatada = {
        Id: categoriaSalva.id,
        Nome: categoriaSalva.nome
      };

      setCategorias(prev => [...prev, categoriaFormatada]);
      setNovaCategoria({ Nome: '' });
      setModalAberto('categorias');
      
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('409')) {
        alert('Já existe uma categoria com este nome.');
      } else {
        alert('Erro ao salvar categoria: ' + error.message);
      }
    } finally {
      setSalvandoCategoria(false);
    }
  };

  const excluirCategoria = async (id) => {
    const categoria = categorias.find(c => c.Id === id);
    const nomeCategoria = categoria ? categoria.Nome : 'esta categoria';
    
    try {
        setExcluindoCategoria(id);

        const response = await fetch(`https://api.marcetech.andersondomingos.com/Categorias?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          setCategorias(prev => prev.filter(categoria => categoria.Id !== id));
        } else if (response.status === 404) {
          setCategorias(prev => prev.filter(categoria => categoria.Id !== id));
          alert('Categoria não encontrada. Removida da lista local.');
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          alert('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (error.message.includes('409')) {
          alert('Não é possível excluir esta categoria pois ela está em uso.');
        } else {
          alert('Erro ao excluir categoria: ' + error.message);
        }
      } finally {
        setExcluindoCategoria(null);
      }
  };

  // Funções para Itens da Categoria
  const listarItensCategoria = async (idCategoria) => {
    try {
      setCarregandoItens(true);

      const response = await fetch(`https://api.marcetech.andersondomingos.com/ItensCategoria?idCategoria=${idCategoria}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Resposta da API não é um array válido');
      }

      const itensFormatados = data.map(item => ({
        Id: item.id,
        Descricao: item.descricao,
        Observacao: item.observacao,
        Valor: item.valor
      }));

      setItensCategoria(itensFormatados);
    } catch (error) {
      console.error('Erro ao carregar itens da categoria:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else if (error.message.includes('404')) {
        setItensCategoria([]);
      } else {
        alert('Erro ao carregar itens da categoria: ' + error.message);
        
        const itensMock = [
          { Id: 1, Descricao: 'Porcelanato', Observacao: '60x60cm', Valor: 45.90 },
          { Id: 2, Descricao: 'Mármore', Observacao: 'Branco', Valor: 120.50 }
        ];
        setItensCategoria(itensMock);
      }
    } finally {
      setCarregandoItens(false);
    }
  };

  const salvarItemCategoria = async (idCategoria) => {
    limparErro('itemDescricao');
    limparErro('itemValor');

    if (!novoItemCategoria.Descricao.trim()) {
      setErroValidacao(prev => ({ ...prev, itemDescricao: 'Por favor, informe a descrição do item' }));
      return;
    }

    if (!novoItemCategoria.Valor || novoItemCategoria.Valor === '0,00') {
      setErroValidacao(prev => ({ ...prev, itemValor: 'Por favor, informe um valor válido' }));
      return;
    }


    try {
      setSalvandoItem(true);

      const valorParaBackend = novoItemCategoria.Valor.replace(/\./g, '').replace(',', '.');
      const valorNumerico = parseFloat(valorParaBackend);

      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        setErroValidacao(prev => ({ ...prev, itemValor: 'Informe um valor válido maior que zero' }));
        return;
      }

      const itemParaEnviar = {
        idCategoria: idCategoria,
        descricao: novoItemCategoria.Descricao.trim(),
        observacao: novoItemCategoria.Observacao.trim(),
        valor: valorNumerico
      };

      const response = await fetch('https://api.marcetech.andersondomingos.com/ItensCategoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemParaEnviar)
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText;
        }
        throw new Error(errorMessage);
      }

      const itemSalvo = await response.json();
      
      const itemFormatado = {
        Id: itemSalvo.id,
        Descricao: itemSalvo.descricao,
        Observacao: itemSalvo.observacao || '',
        Valor: itemSalvo.valor
      };

      setItensCategoria(prev => [...prev, itemFormatado]);
      setNovoItemCategoria({ Descricao: '', Observacao: '', Valor: '0,00' });
      setModalAberto('itens-categoria');
      
    } catch (error) {
      console.error('Erro ao salvar item da categoria:', error);
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        alert('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        alert('Erro ao salvar item da categoria: ' + error.message);
      }
    } finally {
      setSalvandoItem(false);
    }
  };

  const excluirItemCategoria = async (id, idCategoria) => {
    const item = itensCategoria.find(i => i.Id === id);
    const descricaoItem = item ? item.Descricao : 'este item';
    
    try {
        setExcluindoItem(id);

        const response = await fetch(`https://api.marcetech.andersondomingos.com/ItensCategoria?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          setItensCategoria(prev => prev.filter(item => item.Id !== id));
        } else if (response.status === 404) {
          setItensCategoria(prev => prev.filter(item => item.Id !== id));
          console.log('Item não encontrado, removido da lista local');
        } else {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
      } catch (error) {
        console.error('Erro ao excluir item da categoria:', error);
        
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          alert('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (error.message.includes('409')) {
          alert('Não é possível excluir este item pois ele está em uso.');
        } else {
          alert('Erro ao excluir item: ' + error.message);
        }
      } finally {
        setExcluindoItem(null);
      }
  };

  // Filtros
  const ambientesFiltrados = ambientes.filter(ambiente =>
    ambiente.Nome.toLowerCase().includes(buscaAmbientes.toLowerCase())
  );

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.Nome.toLowerCase().includes(buscaCategorias.toLowerCase())
  );

  // Efeitos
  useEffect(() => {
    if (modalAberto === 'ambientes') {
      listarAmbientes();
    } else if (modalAberto === 'categorias') {
      listarCategorias();
    }
  }, [modalAberto]);

  useEffect(() => {
    if (categoriaSelecionada) {
      listarItensCategoria(categoriaSelecionada.Id);
    }
  }, [categoriaSelecionada]);

  return (
    <div className="materials-container">
      <h1>Cadastro de Materiais</h1>

      <div className="row">
        <div className="col">
          Este espaço é reservado ao Cadastro de informações aplicadas ao orçamento.
        </div>
      </div>

      <div className="row">
        <div className="col">
          O que você deseja ver?
        </div>
      </div>
      <br />
      <div className="row">
        <div className="col">
          <button 
            type="button" 
            className="btn botaoAcesso"
            onClick={() => setModalAberto('ambientes')}
          >
            Cadastro de Ambientes
          </button>
        </div>
        <div className="col">
          <button 
            type="button" 
            className="btn botaoAcesso"
            onClick={() => setModalAberto('categorias')}
          >
            Cadastro de Categorias
          </button>
        </div>
      </div>

      {/* Modal de Ambientes */}
      {modalAberto === 'ambientes' && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h4 className="modal-title">Cadastro de Ambiente</h4>
              <a href='#' onClick={() => setModalAberto(null)}>X</a>
            </div>

            <div className="modal-body">
              {carregandoAmbientes ? (
                <div className="carregando">Carregando ambientes...</div>
              ) : (
                <div className="row">
                  <div className="col">
                    <input
                      type="search"
                      className="myinput"
                      placeholder="Buscar Ambiente"
                      value={buscaAmbientes}
                      onChange={(e) => setBuscaAmbientes(e.target.value)}
                    />
                    <br />  
                    <table className="materials-table">
                      <thead>
                        <tr className="header">
                          <th style={{ width: '50%' }}>Nome</th>
                          <th style={{ width: '50%' }}>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ambientesFiltrados.length === 0 ? (
                          <tr>
                            <td colSpan="2" className="sem-registros">
                              {buscaAmbientes ? 'Nenhum ambiente encontrado' : 'Nenhum ambiente cadastrado'}
                            </td>
                          </tr>
                        ) : (
                          ambientesFiltrados.map((ambiente) => (
                            <tr key={ambiente.Id}>
                              <td>{ambiente.Nome}</td>
                              <td>
                                <button 
                                  type="button" 
                                  className="login-btn btn-excluir"
                                  onClick={() => excluirAmbiente(ambiente.Id)}
                                  disabled={excluindoAmbiente === ambiente.Id}
                                >
                                  {excluindoAmbiente === ambiente.Id ? 'Excluindo...' : 'Excluir'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="login-btn"
                onClick={() => {
                  setNovoAmbiente({ Nome: '' });
                  setModalAberto('novo-ambiente');
                }}
                disabled={carregandoAmbientes}
              >
                Adicionar Ambiente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Ambiente */}
      {modalAberto === 'novo-ambiente' && (
        <div className="modal-overlay">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h4 className="modal-title">Adicionar Ambiente</h4>
               <a href='#'  onClick={() => {
                  limparErro('ambiente');
                  setModalAberto('ambientes');
                }}>X</a>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <label htmlFor="NomeAmbiente" className="form-label">
                    Nome do Ambiente
                  </label>
                  <input
                    type="text"
                    className={`form-control ${erroValidacao.ambiente ? 'input-error' : ''}`}
                    id="NomeAmbiente"
                    value={novoAmbiente.Nome}
                    onChange={(e) => {
                      setNovoAmbiente({ Nome: e.target.value });
                      limparErro('ambiente');
                    }}
                    required
                  />
                  {erroValidacao.ambiente && (
                    <div className="mensagem-erro">
                      {erroValidacao.ambiente}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="login-btn"
                onClick={salvarAmbiente}
                disabled={salvandoAmbiente}
              >
                {salvandoAmbiente ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Categorias */}
      {modalAberto === 'categorias' && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h4 className="modal-title">Cadastro de Categorias</h4>
               <a href='#'  onClick={() => {
                  setModalAberto(null)
                }}>X</a>
              <button 
                type="button" 
                className="btn-close"
                onClick={() => setModalAberto(null)}
              >×</button>
            </div>

            <div className="modal-body">
              {carregandoCategorias ? (
                <div className="carregando">Carregando categorias...</div>
              ) : (
                <>
                  <input
                    type="search"
                    className="myinput"
                    placeholder="Buscar Categoria"
                    value={buscaCategorias}
                    onChange={(e) => setBuscaCategorias(e.target.value)}
                  />
     <br />  
                  <table className="materials-table">
                    <thead>
                      <tr className="header">
                        <th style={{ width: '50%' }}>Nome</th>
                        <th style={{ width: '50%' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoriasFiltradas.length === 0 ? (
                        <tr>
                          <td colSpan="2" className="sem-registros">
                            {buscaCategorias ? 'Nenhuma categoria encontrada' : 'Nenhuma categoria cadastrada'}
                          </td>
                        </tr>
                      ) : (
                        categoriasFiltradas.map((categoria) => (
                          <tr key={categoria.Id}>
                            <td>{categoria.Nome}</td>
                            <td>
                              <button 
                                type="button" 
                                className="login-btn btn-item"
                                onClick={() => {
                                  setCategoriaSelecionada(categoria);
                                  setModalAberto('itens-categoria');
                                }}
                              >
                                Item
                              </button>
                              <button 
                                type="button" 
                                className="login-btn btn-excluir"
                                onClick={() => excluirCategoria(categoria.Id)}
                                disabled={excluindoCategoria === categoria.Id}
                              >
                                {excluindoCategoria === categoria.Id ? 'Excluindo...' : 'Excluir'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="login-btn"
                onClick={() => {
                  setNovaCategoria({ Nome: '' });
                  setModalAberto('nova-categoria');
                }}
                disabled={carregandoCategorias}
              >
                Adicionar Categorias
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nova Categoria */}
      {modalAberto === 'nova-categoria' && (
        <div className="modal-overlay">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h4 className="modal-title">Adicionar Categorias</h4>
               <a href='#'  onClick={() => {
                  limparErro('categoria');
                  setModalAberto('categorias');
                }}>X</a>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <label htmlFor="NomeCategoria" className="form-label">
                    Nome da Categoria
                  </label>
                  <input
                    type="text"
                    className={`form-control ${erroValidacao.categoria ? 'input-error' : ''}`}
                    id="NomeCategoria"
                    value={novaCategoria.Nome}
                    onChange={(e) => {
                      setNovaCategoria({ Nome: e.target.value });
                      limparErro('categoria');
                    }}
                    required
                  />
                  {erroValidacao.categoria && (
                    <div className="mensagem-erro">
                      {erroValidacao.categoria}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="login-btn"
                onClick={salvarCategoria}
                disabled={salvandoCategoria}
              >
                {salvandoCategoria ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Itens da Categoria */}
      {modalAberto === 'itens-categoria' && categoriaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content modal-lg">
            <div className="modal-header">
              <h4 className="modal-title">{categoriaSelecionada.Nome}</h4>
              <a href='#'  onClick={() => {
                  setModalAberto('categorias');
                }}>X</a>
            </div>

            <div className="modal-body">
              {carregandoItens ? (
                <div className="carregando">Carregando itens...</div>
              ) : (
                <div className="row">
                  <table className="materials-table">
                    <thead>
                      <tr className="header">
                        <th style={{ width: '25%' }}>
                          <button 
                            type="button"
                            className="btn-novo-item"
                            onClick={() => setModalAberto('novo-item-categoria')}
                            title="Novo Item"
                          >
                            +
                          </button>
                        </th>
                        <th style={{ width: '25%' }}>Item</th>
                        <th style={{ width: '25%' }}>Observação</th>
                        <th style={{ width: '25%' }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensCategoria.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="sem-registros">
                            Nenhum item cadastrado
                          </td>
                        </tr>
                      ) : (
                        itensCategoria.map((item) => (
                          <tr key={item.Id}>
                            <td>
                              <button 
                                type="button" 
                                className="login-btn btn-excluir"
                                onClick={() => excluirItemCategoria(item.Id, categoriaSelecionada.Id)}
                                disabled={excluindoItem === item.Id}
                              >
                                {excluindoItem === item.Id ? 'Excluindo...' : 'Excluir'}
                              </button>
                            </td>
                            <td>{item.Descricao}</td>
                            <td>{item.Observacao}</td>
                            <td>
                              {item.Valor.toLocaleString('pt-BR', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Item da Categoria */}
      {modalAberto === 'novo-item-categoria' && categoriaSelecionada && (
        <div className="modal-overlay">
          <div className="modal-content modal-sm">
            <div className="modal-header">
              <h4 className="modal-title">Adicionar item Categoria</h4>
              <a href='#'  onClick={() => {
                  limparErro('itemDescricao');
                  limparErro('itemValor');
                  setModalAberto('itens-categoria');
                }}>X</a>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col">
                  <label className="form-label">
                    Nome item Categoria
                  </label>
                  <input
                    type="text"
                    className={`form-control ${erroValidacao.itemDescricao ? 'input-error' : ''}`}
                    value={novoItemCategoria.Descricao}
                    onChange={(e) => {
                      setNovoItemCategoria(prev => ({
                        ...prev,
                        Descricao: e.target.value
                      }));
                      limparErro('itemDescricao');
                    }}
                    required
                  />
                  {erroValidacao.itemDescricao && (
                    <div className="mensagem-erro">
                      {erroValidacao.itemDescricao}
                    </div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="form-label">
                    Observação
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={novoItemCategoria.Observacao}
                    onChange={(e) => setNovoItemCategoria(prev => ({
                      ...prev,
                      Observacao: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className="form-label">
                    Valor
                  </label>
                  <input
                    type="text"
                    className={`form-control ${erroValidacao.itemValor ? 'input-error' : ''}`}
                    value={novoItemCategoria.Valor}
                    onChange={(e) => {
                      handleValorChange(e.target.value);
                      limparErro('itemValor');
                    }}
                    placeholder="0,00"
                    required
                  />
                  {erroValidacao.itemValor && (
                    <div className="mensagem-erro">
                      {erroValidacao.itemValor}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="login-btn"
                onClick={() => salvarItemCategoria(categoriaSelecionada.Id)}
                disabled={salvandoItem}
              >
                {salvandoItem ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
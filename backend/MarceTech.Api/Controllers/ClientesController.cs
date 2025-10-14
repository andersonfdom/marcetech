using MarceTech.Api.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientesController : ControllerBase
    {
        [HttpGet]
        [Route("Listar")] // Rota específica
        public IActionResult Listar()
        {
            List<ClienteModel> clientes;

            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    clientes = ctx.Clientes
                        .OrderBy(c => c.Nome)
                        .Select(c => new ClienteModel
                        {
                            Id = c.Id,

                            TipoPessoa = c.Tipopessoa,

                            Nome = c.Nome,

                            Rg = c.Rg,

                            Cpfcnpj = c.Cpfcnpj,

                            Telefone = c.Telefone,

                            Email = c.Email,

                            Cep = c.Cep,

                            Logradouro = c.Logradouro,

                            NumeroLogradouro = c.Numerologradouro,

                            Complemento = c.Complemento,

                            Bairro = c.Bairro,

                            Cidade = c.Cidade,

                            Estado = c.Estado
                        })
                        .ToList();
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao listar clientes.");
            }

            return Ok(clientes);
        }

        [HttpGet]
        [Route("CarregarDados")] // Rota com parâmetro
        public IActionResult CarregarDados(int id)
        {
            ClienteModel clienteModel;

            if (id == 0) // Mudei de null para 0, pois int não pode ser null
            {
                clienteModel = new ClienteModel();
            }
            else
            {
                try
                {
                    using (MarceTechContext ctx = new MarceTechContext())
                    {
                        clienteModel = (from c in ctx.Clientes
                                        where c.Id == id
                                        select new ClienteModel
                                        {
                                            Bairro = c.Bairro,
                                            Cep = c.Cep,
                                            Cidade = c.Cidade,
                                            Complemento = c.Complemento,
                                            Cpfcnpj = c.Cpfcnpj,
                                            Email = c.Email,
                                            Estado = c.Estado,
                                            Id = c.Id,
                                            Logradouro = c.Logradouro,
                                            Nome = c.Nome,
                                            NumeroLogradouro = c.Numerologradouro,
                                            Rg = c.Rg,
                                            Telefone = c.Telefone,
                                            TipoPessoa = c.Tipopessoa
                                        }).FirstOrDefault();
                        if (clienteModel == null)
                        {
                            clienteModel = new ClienteModel();
                        }
                    }
                }
                catch (Exception)
                {
                    return BadRequest("Erro ao carregar dados clientes.");
                }
            }

            return Ok(clienteModel);
        }

        [HttpPost]
        [Route("GravarDados")] // Rota específica
        public IActionResult GravarDados([FromBody] ClienteModel clienteModel)
        {
            Utils utils = new Utils();

            // Validação de dados no servidor
            if (string.IsNullOrWhiteSpace(clienteModel.Nome))
            {
                return BadRequest("O nome é obrigatório.");
            }

            // Validações de CPF/CNPJ
            if (clienteModel.TipoPessoa == false) // Pessoa Física
            {
                if (string.IsNullOrWhiteSpace(clienteModel.Cpfcnpj) || utils.ValidarCPF(clienteModel.Cpfcnpj) == false)
                {
                    return BadRequest("CPF inválido.");
                }
            }
            else // Pessoa Jurídica
            {
                if (string.IsNullOrWhiteSpace(clienteModel.Cpfcnpj) || utils.ValidarCNPJ(clienteModel.Cpfcnpj) == false)
                {
                    return BadRequest("CNPJ inválido.");
                }
            }

            try
            {
                bool novoRegistro;
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var cliente = ctx.Clientes.FirstOrDefault(c => c.Id == clienteModel.Id);

                    if (cliente != null)
                    {
                        novoRegistro = false;
                    }
                    else
                    {
                        novoRegistro = true;
                        cliente = new Cliente();
                    }

                    if (novoRegistro == true)
                    {
                        var existeCpfCnpj = ctx.Clientes.FirstOrDefault(c => c.Cpfcnpj == clienteModel.Cpfcnpj) != null;

                        if (existeCpfCnpj == true)
                        {
                            if (clienteModel.TipoPessoa == false)
                            {
                                return BadRequest("CPF já cadastrado!");
                            }
                            else
                            {
                                return BadRequest("CNPJ já cadastrado!");
                            }
                        }

                        var existeEmail = ctx.Clientes.FirstOrDefault(c => c.Email == clienteModel.Email) != null;

                        if (existeEmail == true)
                        {
                            return BadRequest("E-mail já cadastrado!");
                        }
                    }

                    // Mapeamento dos dados
                    cliente.Tipopessoa = clienteModel.TipoPessoa;
                    cliente.Nome = clienteModel.Nome;
                    cliente.Rg = clienteModel.TipoPessoa == true ? "" : clienteModel.Rg;
                    cliente.Cpfcnpj = clienteModel.Cpfcnpj;
                    cliente.Telefone = clienteModel.Telefone;
                    cliente.Email = clienteModel.Email;
                    cliente.Cep = clienteModel.Cep;
                    cliente.Logradouro = clienteModel.Logradouro;
                    cliente.Numerologradouro = clienteModel.NumeroLogradouro;
                    cliente.Complemento = clienteModel.Complemento;
                    cliente.Bairro = clienteModel.Bairro;
                    cliente.Cidade = clienteModel.Cidade;
                    cliente.Estado = clienteModel.Estado;

                    if (novoRegistro)
                    {
                        ctx.Clientes.Add(cliente);
                    }
                    else
                    {
                        ctx.Clientes.Update(cliente);
                    }

                    ctx.SaveChanges();
                    clienteModel.Id = cliente.Id;

                    return Ok(clienteModel);
                }
            }
            catch (Exception e)
            {
                return BadRequest("Erro ao gravar dados cliente.");
            }
        }

        [HttpPost]
        [Route("CriarOrcamentoCliente")]
        public IActionResult CriarOrcamentoCliente([FromBody] OrcamentoClienteModel orcamentoClienteModel)
        {
            Utils utils = new Utils();
            // Validação de dados no servidor
            if (string.IsNullOrWhiteSpace(orcamentoClienteModel.Nome))
            {
                return BadRequest("O nome é obrigatório.");
            }

            // Validações de CPF/CNPJ
            if (orcamentoClienteModel.TipoPessoa == false) // Pessoa Física
            {
                if (string.IsNullOrWhiteSpace(orcamentoClienteModel.Cpfcnpj) || utils.ValidarCPF(orcamentoClienteModel.Cpfcnpj) == false)
                {
                    return BadRequest("CPF inválido.");
                }
            }
            else // Pessoa Jurídica
            {
                if (string.IsNullOrWhiteSpace(orcamentoClienteModel.Cpfcnpj) || utils.ValidarCNPJ(orcamentoClienteModel.Cpfcnpj) == false)
                {
                    return BadRequest("CNPJ inválido.");
                }
            }

            try
            {
                bool novoRegistro;
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var cliente = ctx.Clientes.FirstOrDefault(c => c.Id == orcamentoClienteModel.IdCliente);

                    if (cliente != null)
                    {
                        novoRegistro = false;
                    }
                    else
                    {
                        novoRegistro = true;
                        cliente = new Cliente();
                    }

                    if (novoRegistro == true)
                    {
                        var existeCpfCnpj = ctx.Clientes.FirstOrDefault(c => c.Cpfcnpj == orcamentoClienteModel.Cpfcnpj) != null;

                        if (existeCpfCnpj == true)
                        {
                            if (orcamentoClienteModel.TipoPessoa == false)
                            {
                                return BadRequest("CPF já cadastrado!");
                            }
                            else
                            {
                                return BadRequest("CNPJ já cadastrado!");
                            }
                        }

                        var existeEmail = ctx.Clientes.FirstOrDefault(c => c.Email == orcamentoClienteModel.Email) != null;

                        if (existeEmail == true)
                        {
                            return BadRequest("E-mail já cadastrado!");
                        }
                    }

                    // Mapeamento dos dados
                    cliente.Tipopessoa = orcamentoClienteModel.TipoPessoa;
                    cliente.Nome = orcamentoClienteModel.Nome;
                    cliente.Cpfcnpj = orcamentoClienteModel.Cpfcnpj;
                    cliente.Telefone = orcamentoClienteModel.Telefone;
                    cliente.Email = orcamentoClienteModel.Email;
                    cliente.Cep = orcamentoClienteModel.Cep;
                    cliente.Logradouro = orcamentoClienteModel.Logradouro;
                    cliente.Numerologradouro = orcamentoClienteModel.NumeroLogradouro;
                    cliente.Complemento = orcamentoClienteModel.Complemento;
                    cliente.Bairro = orcamentoClienteModel.Bairro;
                    cliente.Cidade = orcamentoClienteModel.Cidade;
                    cliente.Estado = orcamentoClienteModel.Estado;

                    if (novoRegistro)
                    {
                        ctx.Clientes.Add(cliente);
                    }
                    else
                    {
                        ctx.Clientes.Update(cliente);
                    }

                    ctx.SaveChanges();
                    orcamentoClienteModel.IdCliente = cliente.Id;

                    Orcamento orcamento = new Orcamento
                    {
                        Dataorcamento = DateTime.Now,
                        Idcliente = orcamentoClienteModel.IdCliente,
                        Idloja = orcamentoClienteModel.IdLoja,
                        Idvendedor = orcamentoClienteModel.IdVendedor,
                        Statusorcamento = "Orçamento"
                    };

                    ctx.Orcamentos.Add(orcamento);
                    ctx.SaveChanges();

                    return Ok(orcamento);
                }
            }
            catch (Exception e)
            {
                return BadRequest("Erro ao gravar dados cliente.");
            }
        }

        [HttpDelete]
        public IActionResult Excluir(int id)
        {
            try
            {
                using (var ctx = new MarceTechContext())
                {
                    var cliente = ctx.Clientes.FirstOrDefault(c => c.Id == id);
                    if (cliente != null)
                    {
                        ctx.Clientes.Remove(cliente);
                        ctx.SaveChanges();
                        return Ok("Cliente excluído com sucesso!");
                    }
                    else
                    {
                        return BadRequest("Cliente não encontrado.");
                    }
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Erro ao excluir cliente: " + ex.Message);
            }
        }
    }

    public class ClienteModel
    {
        public int Id { get; set; }

        public bool? TipoPessoa { get; set; }

        public string? Nome { get; set; }

        public string? Rg { get; set; }

        public string? Cpfcnpj { get; set; }

        public string? Telefone { get; set; }

        public string? Email { get; set; }

        public string? Cep { get; set; }

        public string? Logradouro { get; set; }

        public string? NumeroLogradouro { get; set; }

        public string? Complemento { get; set; }

        public string? Bairro { get; set; }

        public string? Cidade { get; set; }

        public string? Estado { get; set; }
    }

    public class OrcamentoClienteModel
    {
        public int IdCliente { get; set; }
        public int IdLoja { get; set; }
        public int IdVendedor { get; set; }
        public string? Nome { get; set; }
        public bool? TipoPessoa { get; set; }
        public string? Cpfcnpj { get; set; }
        public string? Telefone { get; set; }
        public string? Email { get; set; }

        public string? Cep { get; set; }

        public string? Logradouro { get; set; }

        public string? NumeroLogradouro { get; set; }

        public string? Complemento { get; set; }

        public string? Bairro { get; set; }

        public string? Cidade { get; set; }

        public string? Estado { get; set; }
    }
}

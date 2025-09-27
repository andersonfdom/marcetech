using Microsoft.AspNetCore.Mvc;
using MarceTech.Web.Model;

namespace MarceTech.Web.Controllers
{
    public class ClientesController : Controller
    {
        public IActionResult Index()
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
                            Nome = c.Nome,
                            Telefone = c.Telefone
                            // Adicione os campos que quiser exibir
                        })
                        .ToList();
                }
            }
            catch (Exception)
            {
                throw;
            }

            return View(clientes);
        }

        public IActionResult Cadastro(int? id)
        {
            ClienteModel clienteModel;

            if (id == null)
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
                                            NumeroLogradouro = c.NumeroLogradouro,
                                            Rg = c.Rg,
                                            Telefone = c.Telefone,
                                            TipoPessoa = c.TipoPessoa
                                        }).FirstOrDefault();
                        if (clienteModel == null)
                        {
                            clienteModel = new ClienteModel();
                        }
                    }
                }
                catch (Exception)
                {

                    throw;
                }
            }

            return View(clienteModel);
        }

        [HttpPost]
        public string GravarDados([FromForm] ClienteModel clienteModel)
        {
            bool novoRegistro;

            try
            {
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

                    cliente.TipoPessoa = clienteModel.TipoPessoa;
                    cliente.Nome = clienteModel.Nome;
                    cliente.Rg = clienteModel.TipoPessoa == true? "": clienteModel.Rg;
                    cliente.Cpfcnpj = clienteModel.Cpfcnpj;
                    cliente.Telefone = clienteModel.Telefone;
                    cliente.Email = clienteModel.Email;
                    cliente.Cep = clienteModel.Cep;
                    cliente.Logradouro = clienteModel.Logradouro;
                    cliente.NumeroLogradouro = clienteModel.NumeroLogradouro;
                    cliente.Complemento = clienteModel.Complemento;
                    cliente.Bairro = clienteModel.Bairro;
                    cliente.Cidade = clienteModel.Cidade;
                    cliente.Estado = clienteModel.Estado;

                    if (novoRegistro == true)
                    {
                        ctx.Clientes.Add(cliente);
                    }
                    else
                    {
                        ctx.Clientes.Update(cliente);
                    }

                    ctx.SaveChanges();

                    return "Dados Cliente salvo com sucesso!";
                }
            }
            catch (Exception e)
            {
                return "Erro ao gravar dados Cliente: " + e.InnerException.Message.ToString();
            }
        }

        [HttpPost]
        public string ExcluirDados(int id)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var cliente = ctx.Clientes.FirstOrDefault(c => c.Id == id);

                    if (cliente != null)
                    {
                        ctx.Clientes.Remove(cliente);
                        ctx.SaveChanges();

                        return "Cliente excluído com sucesso!";
                    }
                    else
                    {
                        return "Cliente não encontrado!";
                    }
                }
            }
            catch (Exception e)
            {
                return "Erro ao excluir dados Cliente: " + e.InnerException.Message.ToString();
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
}

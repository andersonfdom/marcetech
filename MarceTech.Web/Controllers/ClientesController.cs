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
                            Telefone = c.Telefone,
                            Email = c.Email,
                            Cidade = c.Cidade,
                            Estado = c.Estado
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
        public IActionResult GravarDados([FromForm] ClienteModel clienteModel)
        {
            // Validação de dados no servidor
            if (string.IsNullOrWhiteSpace(clienteModel.Nome))
            {
                // Se o nome estiver vazio, você pode retornar a view com uma mensagem de erro.
                TempData["MensagemErro"] = "O nome é obrigatório.";
                return View("Cadastro", clienteModel);
            }

            // Adicione aqui as validações de CPF/CNPJ, CEP, etc.
            // Exemplo de validação de CPF/CNPJ (assumindo que você tenha um método para isso)
            if (clienteModel.TipoPessoa == false) // Pessoa Física
            {
                if (string.IsNullOrWhiteSpace(clienteModel.Cpfcnpj) || !ValidarCPF(clienteModel.Cpfcnpj))
                {
                    TempData["MensagemErro"] = "CPF inválido.";
                    return View("Cadastro", clienteModel);
                }
            }
            else // Pessoa Jurídica
            {
                if (string.IsNullOrWhiteSpace(clienteModel.Cpfcnpj) || !ValidarCNPJ(clienteModel.Cpfcnpj))
                {
                    TempData["MensagemErro"] = "CNPJ inválido.";
                    return View("Cadastro", clienteModel);
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

                    // Mapeamento dos dados do Model para a Entidade
                    cliente.TipoPessoa = clienteModel.TipoPessoa;
                    cliente.Nome = clienteModel.Nome;
                    cliente.Rg = clienteModel.TipoPessoa == true ? "" : clienteModel.Rg;
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

                    if (novoRegistro)
                    {
                        ctx.Clientes.Add(cliente);
                    }
                    else
                    {
                        ctx.Clientes.Update(cliente);
                    }

                    ctx.SaveChanges();

                    TempData["MensagemSucesso"] = "Dados do Cliente salvos com sucesso!";
                    return RedirectToAction("Index"); // Redireciona para a página de listagem de clientes
                }
            }
            catch (Exception e)
            {
                TempData["MensagemErro"] = $"Erro ao gravar dados do Cliente: {e.Message}";
                return View("Cadastro", clienteModel);
            }
        }

        private bool ValidarCPF(string cpf)
        {
            // Remove caracteres não numéricos.
            cpf = cpf.Trim().Replace(".", "").Replace("-", "");

            if (cpf.Length != 11)
                return false;

            // Se todos os dígitos forem iguais, o CPF é inválido.
            if (new string(cpf[0], 11) == cpf)
                return false;

            int[] multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCpf;
            string digito;
            int soma;
            int resto;

            tempCpf = cpf.Substring(0, 9);
            soma = 0;
            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCpf = tempCpf + digito;

            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];
            resto = soma % 11;
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();

            return cpf.EndsWith(digito);
        }

        private bool ValidarCNPJ(string cnpj)
        {
            // Remove caracteres não numéricos.
            cnpj = cnpj.Trim().Replace(".", "").Replace("-", "").Replace("/", "");

            if (cnpj.Length != 14)
                return false;

            // Se todos os dígitos forem iguais, o CNPJ é inválido.
            if (new string(cnpj[0], 14) == cnpj)
                return false;

            int[] multiplicador1 = new int[12] { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicador2 = new int[13] { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            string tempCnpj;
            string digito;
            int soma;
            int resto;

            tempCnpj = cnpj.Substring(0, 12);
            soma = 0;
            for (int i = 0; i < 12; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador1[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = resto.ToString();
            tempCnpj = tempCnpj + digito;

            soma = 0;
            for (int i = 0; i < 13; i++)
                soma += int.Parse(tempCnpj[i].ToString()) * multiplicador2[i];
            resto = (soma % 11);
            if (resto < 2)
                resto = 0;
            else
                resto = 11 - resto;
            digito = digito + resto.ToString();

            return cnpj.EndsWith(digito);
        }

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
                        TempData["MensagemSucesso"] = "Cliente excluído com sucesso!";
                    }
                    else
                    {
                        TempData["MensagemErro"] = "Cliente não encontrado.";
                    }
                }
            }
            catch (Exception ex)
            {
                TempData["MensagemErro"] = "Erro ao excluir cliente: " + ex.Message;
            }

            // Redireciona de volta para a lista de clientes (Index)
            return RedirectToAction("Index");
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

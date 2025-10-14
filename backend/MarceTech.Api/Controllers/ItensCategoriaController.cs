using MarceTech.Api.Model;
using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ItensCategoriaController : ControllerBase
    {
        [HttpGet]
        public IActionResult ListarItensCategoria(int idCategoria)
        {
            List<ItensCategoriaModel> lista = null;

            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Itenscategoria.Where(c => c.Idcategoria == idCategoria).ToList();

                    if (dados != null)
                    {
                        lista = new List<ItensCategoriaModel>();

                        foreach (var item in dados)
                        {
                            ItensCategoriaModel wDados = new ItensCategoriaModel
                            {
                                Id = item.Id,
                                Descricao = item.Descricao,
                                Observacao = string.IsNullOrEmpty(item.Observacao) ? "" : item.Observacao.ToString(),
                                Valor = (decimal)item.Valor
                            };

                            lista.Add(wDados);
                        }
                    }
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao listar Itens Categoria.");
            }

            return Ok(lista);
        }

        [HttpPost]
        public IActionResult SalvarItemCategoria([FromBody] ItensCategoriaModel itensCategoriaModel)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    Itenscategorium i = new Itenscategorium
                    {
                        Descricao = itensCategoriaModel.Descricao,
                        Idcategoria = itensCategoriaModel.IdCategoria,
                        IdcategoriaNavigation = ctx.Categorias.FirstOrDefault(c => c.Id == itensCategoriaModel.IdCategoria),
                        Observacao = itensCategoriaModel.Observacao,
                        Valor = itensCategoriaModel.Valor
                    };

                    ctx.Itenscategoria.Add(i);
                    ctx.SaveChanges();

                    itensCategoriaModel.Id = i.Id;

                    return Ok(itensCategoriaModel);
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao gravar dados Item Categoria.");
            }
        }

        [HttpDelete]
        public IActionResult ExcluirItemCategoria(int id)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Itenscategoria.FirstOrDefault(c => c.Id == id);

                    if (dados != null)
                    {
                        ctx.Itenscategoria.Remove(dados);
                        ctx.SaveChanges();

                        return Ok(dados);
                    }
                    else
                    {
                        return BadRequest("Item Categoria não excluído.");
                    }
                }
            }
            catch (Exception)
            {

                throw;
            }
        }
    }

    public class ItensCategoriaModel
    {
        public int Id { get; set; }

        public int IdCategoria { get; set; }

        public string? Descricao { get; set; }

        public string? Observacao { get; set; }

        // ADICIONE ESTE ATRIBUTO:
        public decimal Valor { get; set; }
    }
}

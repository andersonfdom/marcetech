using MarceTech.Api.Model;
using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        [HttpGet]
        public IActionResult ListarCategorias()
        {
            List<CategoriaModel> lista = null;

            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Categorias.ToList();

                    if (dados != null)
                    {
                        lista = new List<CategoriaModel>();

                        foreach (var item in dados)
                        {
                            CategoriaModel wDados = new CategoriaModel
                            {
                                Id = item.Id,
                                Nome = item.Nome
                            };

                            lista.Add(wDados);
                        }
                    }
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao listar Categorias.");
            }

            return Ok(lista);
        }

        [HttpPost]
        public IActionResult GravarCategoria([FromBody] CategoriaModel Categoria)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    Categoria c = new Categoria
                    {
                        Id = Categoria.Id,
                        Nome = Categoria.Nome
                    };

                    ctx.Categorias.Add(c);
                    ctx.SaveChanges();

                    Categoria.Id = c.Id;

                    return Ok(Categoria);
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao gravar dados Categoria.");
            }
        }

        [HttpDelete]
        public IActionResult ExcluirCategoria(int id)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Categorias.FirstOrDefault(c => c.Id == id);

                    if (dados != null)
                    {
                        var dadosItensCategoria = ctx.Itenscategoria.Where(c => c.Idcategoria == id).ToList();

                        if (dadosItensCategoria != null)
                        {
                            foreach (var item in dadosItensCategoria)
                            {
                                ctx.Itenscategoria.Remove(item);
                                ctx.SaveChanges();
                            }
                        }

                        ctx.Categorias.Remove(dados);
                        ctx.SaveChanges();

                        return Ok(dados);
                    }
                    else
                    {
                        return BadRequest("Categoria não excluída.");
                    }
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao excluir dados Categoria.");
            }
        }
    }

    public class CategoriaModel
    {
        public int Id { get; set; }

        public string? Nome { get; set; }
    }
}

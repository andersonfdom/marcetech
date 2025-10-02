using MarceTech.Web.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace MarceTech.Web.Controllers
{
    public class CategoriasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        public IActionResult ListarCategorias()
        {
            ArrayList lista = null;

            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Categorias.ToList();

                    if (dados != null)
                    {
                        lista = new ArrayList();

                        foreach (var item in dados)
                        {
                            Dictionary<string, string> wDados = new Dictionary<string, string>
                 {
                     { "Id", item.Id.ToString() },
                     { "Nome", item.Nome.ToString() }
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
        public IActionResult GravarCategoria([FromBody] Categoria Categoria)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    ctx.Categorias.Add(Categoria);
                    ctx.SaveChanges();

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
                        ctx.Categorias.Remove(dados);
                        ctx.SaveChanges();

                        return Ok(dados);
                    }
                    else
                    {
                        return BadRequest("Categoria não excluído.");
                    }
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao excluir dados Categoria.");
            }
        }
    }
}

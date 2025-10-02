using MarceTech.Web.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace MarceTech.Web.Controllers
{
    public class AmbientesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult ListarAmbientes()
        {
            ArrayList lista = null;

            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Ambientes.ToList();

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
                return BadRequest("Erro ao listar ambientes.");
            }

            return Ok(lista);
        }

        [HttpPost]
        public IActionResult GravarAmbiente([FromBody] Ambiente ambiente)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    ctx.Ambientes.Add(ambiente);
                    ctx.SaveChanges();

                    return Ok(ambiente);
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao gravar dados ambiente.");
            }
        }

        [HttpDelete]
        public IActionResult ExcluirAmbiente(int id)
        {
            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Ambientes.FirstOrDefault(c => c.Id == id);

                    if (dados != null)
                    {
                        ctx.Ambientes.Remove(dados);
                        ctx.SaveChanges();

                        return Ok(dados);
                    }
                    else
                    {
                        return BadRequest("Ambiente não excluído.");
                    }
                }
            }
            catch (Exception)
            {
                return BadRequest("Erro ao excluir dados ambiente.");
            }
        }
    }
}

using MarceTech.Api.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace MarceTech.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AmbientesController : ControllerBase
    {
        [HttpGet]
        public IActionResult ListarAmbientes()
        {
            List<Ambiente> lista = null;

            try
            {
                using (MarceTechContext ctx = new MarceTechContext())
                {
                    var dados = ctx.Ambientes.ToList();

                    if (dados != null)
                    {
                        lista = new List<Ambiente>();

                        foreach (var item in dados)
                        {
                            Ambiente wDados = new Ambiente
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

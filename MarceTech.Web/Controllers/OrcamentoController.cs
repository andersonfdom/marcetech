using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Web.Controllers
{
    public class OrcamentoController : Controller
    {
        public IActionResult Gerar()
        {
            return View();
        }

        public IActionResult Listar()
        {
            return View();
        }
    }
}

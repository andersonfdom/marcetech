using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Web.Controllers
{
    public class CategoriasController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

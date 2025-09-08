using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Web.Controllers
{
    public class AmbientesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

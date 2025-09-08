using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Web.Controllers
{
    public class ClientesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

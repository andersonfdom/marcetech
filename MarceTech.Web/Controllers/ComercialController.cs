using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Web.Controllers
{
    public class ComercialController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

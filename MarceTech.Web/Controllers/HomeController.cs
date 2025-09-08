using Microsoft.AspNetCore.Mvc;

namespace MarceTech.Web.Controllers
{
    public class HomeController : Controller
    {

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }
    }
}

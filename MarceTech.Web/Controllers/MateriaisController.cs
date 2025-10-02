using MarceTech.Web.Model;
using Microsoft.AspNetCore.Mvc;
using System.Collections;

namespace MarceTech.Web.Controllers
{
    public class MateriaisController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

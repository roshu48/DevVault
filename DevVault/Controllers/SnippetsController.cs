using Microsoft.AspNetCore.Mvc;

namespace DevVault.Controllers
{
    public class SnippetsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CreateSnippets()
        {
            return View();
        }
    }

   
}

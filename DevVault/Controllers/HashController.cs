using Microsoft.AspNetCore.Mvc;

namespace DevVault.Controllers
{
    public class HashController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
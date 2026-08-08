using Microsoft.AspNetCore.Mvc;

namespace DevVault.Controllers
{
    public class TestController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
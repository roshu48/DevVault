using Microsoft.AspNetCore.Mvc;

namespace DevVault.Controllers
{
    public class APITesterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

using Microsoft.AspNetCore.Mvc;

namespace DevVault.Controllers
{
    public class JWTController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

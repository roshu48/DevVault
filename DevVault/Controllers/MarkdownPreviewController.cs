using Microsoft.AspNetCore.Mvc;

namespace DevVault.Controllers
{
    public class MarkdownPreviewController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

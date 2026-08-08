using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Formatting;
using System.Diagnostics;

namespace DevVault.Controllers
{
    public class FormatterController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Tool(string type)
        {
            ViewBag.FormatterType = type;

            return View();
        }

        [HttpPost]
        public IActionResult FormatCSharp([FromBody] FormatRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Code))
                {
                    return Json(new
                    {
                        success = false,
                        message = "C# code cannot be empty."
                    });
                }

                var formattedCode = FormatCSharpCode(request.Code);

                return Json(new
                {
                    success = true,
                    code = formattedCode
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        private static string FormatCSharpCode(string code)
        {
            var tree = CSharpSyntaxTree.ParseText(code);

            var root = tree.GetRoot();

            var workspace = new AdhocWorkspace();

            var formattedRoot =
                Formatter.Format(root, workspace);

            return formattedRoot.ToFullString();
        }        
    }

    public class FormatRequest
    {
        public string Code { get; set; } = string.Empty;
    }
}
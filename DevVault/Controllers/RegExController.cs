using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace DevVault.Controllers
{
    public class RegExController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult TestRegex(
            string pattern,
            string testString,
            bool global,
            bool ignoreCase,
            bool multiline,
            bool dotAll)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(pattern))
                {
                    ViewBag.Error = "Please enter a regular expression.";
                    return View("RegexTester");
                }

                RegexOptions options = RegexOptions.None;

                if (ignoreCase)
                    options |= RegexOptions.IgnoreCase;

                if (multiline)
                    options |= RegexOptions.Multiline;

                if (dotAll)
                    options |= RegexOptions.Singleline;

                Regex regex = new Regex(pattern, options);

                var matches = global
                    ? regex.Matches(testString ?? "").Cast<Match>()
                    : new[] { regex.Match(testString ?? "") }
                        .Where(x => x.Success);

                ViewBag.MatchCount = matches.Count();

                ViewBag.Matches = matches
                    .Select(x => x.Value)
                    .ToList();

                return View("Index");
            }
            catch (Exception ex)
            {
                ViewBag.Error = ex.Message;

                return View("Index");
            }
        }
    }    
}

using DevVault.Models;
using Microsoft.AspNetCore.Mvc;
using Uuids;

namespace DevVault.Controllers
{
    public class UUIDController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            return View(new UUIDViewModel());
        }

        [HttpPost]
        public IActionResult Index(UUIDViewModel model)
        {
            if (model.UUIDQty < 1 || model.UUIDQty > 100)
            {
                model.UUIDQty = 1;
            }

            model.UUIDLst ??= new List<string>();

            if (model.UUIDVersion == "v1")
            {
                for(int i=1; i<= model.UUIDQty; i++)
                {                    
                    model.UUIDLst.Add(Uuids.Uuid.NewTimeBased().ToString());
                }
            }
            else if (model.UUIDVersion == "v4")
            {
                for (int i = 1; i <= model.UUIDQty; i++)
                {
                    model.UUIDLst.Add(Guid.NewGuid().ToString());
                }
            }
            else
            {
                for (int i = 1; i <= model.UUIDQty; i++)
                {
                    model.UUIDLst.Add(Guid.CreateVersion7().ToString());
                }
            }                
            return View(model);
        }
    }
}

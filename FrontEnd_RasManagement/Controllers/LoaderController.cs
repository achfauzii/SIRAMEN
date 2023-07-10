using Microsoft.AspNetCore.Mvc;

namespace FrontEnd_RasManagement.Controllers
{
    public class LoaderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
